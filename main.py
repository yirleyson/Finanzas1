from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional, List
import sqlite3, json, os
from datetime import date
from pathlib import Path

app = FastAPI(title="Mis Finanzas")

# Obtener la ruta del directorio actual
BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = BASE_DIR / "templates"

# Crear directorios si no existen
STATIC_DIR.mkdir(exist_ok=True)
TEMPLATES_DIR.mkdir(exist_ok=True)

# ── Servir archivos estáticos ──────────────────────────────────────────────────
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# ── Base de datos ──────────────────────────────────────────────────────────────
DB = str(BASE_DIR / "finanzas.db")

def get_db():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()

    cur.executescript("""
    CREATE TABLE IF NOT EXISTS movimientos (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        tipo      TEXT NOT NULL,
        cat       TEXT,
        cat_label TEXT,
        cat_ico   TEXT,
        cat_color TEXT,
        desc      TEXT,
        monto     REAL,
        fecha     TEXT
    );

    CREATE TABLE IF NOT EXISTS deudas (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        name     TEXT,
        ico      TEXT,
        color    TEXT,
        total    REAL,
        cuotas   INTEGER,
        pagadas  INTEGER DEFAULT 0,
        pagado   REAL DEFAULT 0,
        fecha    TEXT,
        vence    INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS deuda_pagos (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        deuda_id INTEGER,
        fecha    TEXT,
        monto    REAL,
        tipo     TEXT DEFAULT 'normal',
        nota     TEXT
    );

    CREATE TABLE IF NOT EXISTS ahorros (
        id     INTEGER PRIMARY KEY AUTOINCREMENT,
        type   TEXT DEFAULT 'meta',
        name   TEXT,
        ico    TEXT,
        meta   REAL,
        actual REAL DEFAULT 0,
        fecha  TEXT
    );

    CREATE TABLE IF NOT EXISTS ahorro_abonos (
        id        INTEGER PRIMARY KEY AUTOINCREMENT,
        ahorro_id INTEGER,
        fecha     TEXT,
        monto     REAL,
        nota      TEXT
    );

    CREATE TABLE IF NOT EXISTS inversiones (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        name     TEXT,
        entidad  TEXT,
        capital  REAL,
        tasa     REAL,
        periodo  TEXT DEFAULT 'anual',
        fecha    TEXT,
        meses    INTEGER DEFAULT 12
    );

    CREATE TABLE IF NOT EXISTS inv_movimientos (
        id      INTEGER PRIMARY KEY AUTOINCREMENT,
        inv_id  INTEGER,
        fecha   TEXT,
        monto   REAL,
        nota    TEXT
    );

    CREATE TABLE IF NOT EXISTS recurrentes (
        id    INTEGER PRIMARY KEY AUTOINCREMENT,
        name  TEXT,
        ico   TEXT,
        color TEXT,
        monto REAL,
        dia   INTEGER DEFAULT 1,
        nota  TEXT
    );

    CREATE TABLE IF NOT EXISTS recurrente_pagos (
        id       INTEGER PRIMARY KEY AUTOINCREMENT,
        rec_id   INTEGER,
        fecha    TEXT,
        monto    REAL
    );
    """)
    conn.commit()
    conn.close()

init_db()

# ── Modelos Pydantic ───────────────────────────────────────────────────────────

class Movimiento(BaseModel):
    tipo: str
    cat: Optional[str] = ""
    cat_label: Optional[str] = ""
    cat_ico: Optional[str] = ""
    cat_color: Optional[str] = ""
    desc: str
    monto: float
    fecha: str

class Deuda(BaseModel):
    name: str
    ico: Optional[str] = "💰"
    color: Optional[str] = "#378ADD"
    total: float
    cuotas: int
    pagadas: Optional[int] = 0
    pagado: Optional[float] = 0
    fecha: str
    vence: Optional[int] = 1

class DeudaPago(BaseModel):
    fecha: str
    monto: float
    tipo: Optional[str] = "normal"
    nota: Optional[str] = ""

class Ahorro(BaseModel):
    type: Optional[str] = "meta"
    name: str
    ico: Optional[str] = "🎯"
    meta: float
    actual: Optional[float] = 0
    fecha: Optional[str] = ""

class AhorroAbono(BaseModel):
    fecha: str
    monto: float
    nota: Optional[str] = ""

class Inversion(BaseModel):
    name: str
    entidad: Optional[str] = ""
    capital: float
    tasa: float
    periodo: Optional[str] = "anual"
    fecha: str
    meses: Optional[int] = 12

class InvMovimiento(BaseModel):
    fecha: str
    monto: float
    nota: Optional[str] = ""

class Recurrente(BaseModel):
    name: str
    ico: Optional[str] = "🔁"
    color: Optional[str] = "#888780"
    monto: float
    dia: int
    nota: Optional[str] = ""

class RecPago(BaseModel):
    fecha: str
    monto: float

# ── Helpers ────────────────────────────────────────────────────────────────────

def rows_to_list(rows):
    return [dict(r) for r in rows]

def get_historial(table, fk_col, fk_id, conn):
    cur = conn.cursor()
    rows = cur.execute(
        f"SELECT * FROM {table} WHERE {fk_col}=? ORDER BY fecha ASC", (fk_id,)
    ).fetchall()
    return rows_to_list(rows)

# ── Página principal ───────────────────────────────────────────────────────────

@app.get("/", response_class=HTMLResponse)
def root():
    index_path = TEMPLATES_DIR / "index.html"
    with open(index_path, encoding="utf-8") as f:
        return f.read()

# ── MOVIMIENTOS ────────────────────────────────────────────────────────────────

@app.get("/api/movimientos")
def listar_movimientos():
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM movimientos ORDER BY fecha DESC"
    ).fetchall()
    conn.close()
    return rows_to_list(rows)

@app.post("/api/movimientos")
def crear_movimiento(m: Movimiento):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO movimientos (tipo,cat,cat_label,cat_ico,cat_color,desc,monto,fecha) VALUES (?,?,?,?,?,?,?,?)",
        (m.tipo, m.cat, m.cat_label, m.cat_ico, m.cat_color, m.desc, m.monto, m.fecha)
    )
    conn.commit()
    row_id = cur.lastrowid
    conn.close()
    return {"id": row_id, **m.dict()}

@app.put("/api/movimientos/{mid}")
def editar_movimiento(mid: int, m: Movimiento):
    conn = get_db()
    conn.execute(
        "UPDATE movimientos SET tipo=?,cat=?,cat_label=?,cat_ico=?,cat_color=?,desc=?,monto=?,fecha=? WHERE id=?",
        (m.tipo, m.cat, m.cat_label, m.cat_ico, m.cat_color, m.desc, m.monto, m.fecha, mid)
    )
    conn.commit()
    conn.close()
    return {"ok": True}

@app.delete("/api/movimientos/{mid}")
def borrar_movimiento(mid: int):
    conn = get_db()
    conn.execute("DELETE FROM movimientos WHERE id=?", (mid,))
    conn.commit()
    conn.close()
    return {"ok": True}

# ── DEUDAS ─────────────────────────────────────────────────────────────────────

@app.get("/api/deudas")
def listar_deudas():
    conn = get_db()
    deudas = rows_to_list(conn.execute("SELECT * FROM deudas ORDER BY id").fetchall())
    for d in deudas:
        d["historial"] = get_historial("deuda_pagos", "deuda_id", d["id"], conn)
    conn.close()
    return deudas

@app.post("/api/deudas")
def crear_deuda(d: Deuda):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO deudas (name,ico,color,total,cuotas,pagadas,pagado,fecha,vence) VALUES (?,?,?,?,?,?,?,?,?)",
        (d.name, d.ico, d.color, d.total, d.cuotas, d.pagadas, d.pagado, d.fecha, d.vence)
    )
    conn.commit()
    row_id = cur.lastrowid
    if d.pagado > 0:
        conn.execute(
            "INSERT INTO deuda_pagos (deuda_id,fecha,monto,tipo,nota) VALUES (?,?,?,?,?)",
            (row_id, d.fecha, d.pagado, "normal", "Saldo inicial")
        )
        conn.commit()
    conn.close()
    return {"id": row_id, **d.dict()}

@app.put("/api/deudas/{did}")
def editar_deuda(did: int, d: Deuda):
    conn = get_db()
    conn.execute(
        "UPDATE deudas SET name=?,ico=?,color=?,total=?,cuotas=?,pagadas=?,pagado=?,fecha=?,vence=? WHERE id=?",
        (d.name, d.ico, d.color, d.total, d.cuotas, d.pagadas, d.pagado, d.fecha, d.vence, did)
    )
    conn.commit()
    conn.close()
    return {"ok": True}

@app.delete("/api/deudas/{did}")
def borrar_deuda(did: int):
    conn = get_db()
    conn.execute("DELETE FROM deudas WHERE id=?", (did,))
    conn.execute("DELETE FROM deuda_pagos WHERE deuda_id=?", (did,))
    conn.commit()
    conn.close()
    return {"ok": True}

@app.post("/api/deudas/{did}/pagos")
def agregar_pago_deuda(did: int, pago: DeudaPago):
    conn = get_db()
    deuda = conn.execute("SELECT * FROM deudas WHERE id=?", (did,)).fetchone()
    if not deuda:
        raise HTTPException(404, "Deuda no encontrada")
    deuda = dict(deuda)
    nuevo_pagado = min(deuda["total"], deuda["pagado"] + pago.monto)
    nuevas_pagadas = min(deuda["cuotas"], int(nuevo_pagado / (deuda["total"] / deuda["cuotas"])))
    conn.execute(
        "UPDATE deudas SET pagado=?, pagadas=? WHERE id=?",
        (nuevo_pagado, nuevas_pagadas, did)
    )
    conn.execute(
        "INSERT INTO deuda_pagos (deuda_id,fecha,monto,tipo,nota) VALUES (?,?,?,?,?)",
        (did, pago.fecha, pago.monto, pago.tipo, pago.nota)
    )
    conn.commit()
    conn.close()
    return {"ok": True, "pagado": nuevo_pagado, "pagadas": nuevas_pagadas}

# ── AHORROS ────────────────────────────────────────────────────────────────────

@app.get("/api/ahorros")
def listar_ahorros():
    conn = get_db()
    ahorros = rows_to_list(conn.execute("SELECT * FROM ahorros ORDER BY id").fetchall())
    for a in ahorros:
        a["historial"] = get_historial("ahorro_abonos", "ahorro_id", a["id"], conn)
    conn.close()
    return ahorros

@app.post("/api/ahorros")
def crear_ahorro(a: Ahorro):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO ahorros (type,name,ico,meta,actual,fecha) VALUES (?,?,?,?,?,?)",
        (a.type, a.name, a.ico, a.meta, a.actual, a.fecha)
    )
    conn.commit()
    row_id = cur.lastrowid
    if a.actual > 0:
        conn.execute(
            "INSERT INTO ahorro_abonos (ahorro_id,fecha,monto,nota) VALUES (?,?,?,?)",
            (row_id, date.today().isoformat(), a.actual, "Saldo inicial")
        )
        conn.commit()
    conn.close()
    return {"id": row_id, **a.dict()}

@app.put("/api/ahorros/{aid}")
def editar_ahorro(aid: int, a: Ahorro):
    conn = get_db()
    conn.execute(
        "UPDATE ahorros SET type=?,name=?,ico=?,meta=?,actual=?,fecha=? WHERE id=?",
        (a.type, a.name, a.ico, a.meta, a.actual, a.fecha, aid)
    )
    conn.commit()
    conn.close()
    return {"ok": True}

@app.delete("/api/ahorros/{aid}")
def borrar_ahorro(aid: int):
    conn = get_db()
    conn.execute("DELETE FROM ahorros WHERE id=?", (aid,))
    conn.execute("DELETE FROM ahorro_abonos WHERE ahorro_id=?", (aid,))
    conn.commit()
    conn.close()
    return {"ok": True}

@app.post("/api/ahorros/{aid}/abonos")
def abonar_ahorro(aid: int, abono: AhorroAbono):
    conn = get_db()
    ahorro = conn.execute("SELECT * FROM ahorros WHERE id=?", (aid,)).fetchone()
    if not ahorro:
        raise HTTPException(404, "Ahorro no encontrado")
    nuevo = min(dict(ahorro)["meta"], dict(ahorro)["actual"] + abono.monto)
    conn.execute("UPDATE ahorros SET actual=? WHERE id=?", (nuevo, aid))
    conn.execute(
        "INSERT INTO ahorro_abonos (ahorro_id,fecha,monto,nota) VALUES (?,?,?,?)",
        (aid, abono.fecha, abono.monto, abono.nota)
    )
    conn.commit()
    conn.close()
    return {"ok": True, "actual": nuevo}

# ── INVERSIONES ────────────────────────────────────────────────────────────────

@app.get("/api/inversiones")
def listar_inversiones():
    conn = get_db()
    invs = rows_to_list(conn.execute("SELECT * FROM inversiones ORDER BY id").fetchall())
    for inv in invs:
        inv["historial"] = get_historial("inv_movimientos", "inv_id", inv["id"], conn)
    conn.close()
    return invs

@app.post("/api/inversiones")
def crear_inversion(inv: Inversion):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO inversiones (name,entidad,capital,tasa,periodo,fecha,meses) VALUES (?,?,?,?,?,?,?)",
        (inv.name, inv.entidad, inv.capital, inv.tasa, inv.periodo, inv.fecha, inv.meses)
    )
    conn.commit()
    row_id = cur.lastrowid
    conn.execute(
        "INSERT INTO inv_movimientos (inv_id,fecha,monto,nota) VALUES (?,?,?,?)",
        (row_id, inv.fecha, inv.capital, "Apertura")
    )
    conn.commit()
    conn.close()
    return {"id": row_id, **inv.dict()}

@app.put("/api/inversiones/{iid}")
def editar_inversion(iid: int, inv: Inversion):
    conn = get_db()
    conn.execute(
        "UPDATE inversiones SET name=?,entidad=?,capital=?,tasa=?,periodo=?,fecha=?,meses=? WHERE id=?",
        (inv.name, inv.entidad, inv.capital, inv.tasa, inv.periodo, inv.fecha, inv.meses, iid)
    )
    conn.commit()
    conn.close()
    return {"ok": True}

@app.delete("/api/inversiones/{iid}")
def borrar_inversion(iid: int):
    conn = get_db()
    conn.execute("DELETE FROM inversiones WHERE id=?", (iid,))
    conn.execute("DELETE FROM inv_movimientos WHERE inv_id=?", (iid,))
    conn.commit()
    conn.close()
    return {"ok": True}

@app.post("/api/inversiones/{iid}/movimientos")
def agregar_mov_inv(iid: int, mov: InvMovimiento):
    conn = get_db()
    conn.execute(
        "INSERT INTO inv_movimientos (inv_id,fecha,monto,nota) VALUES (?,?,?,?)",
        (iid, mov.fecha, mov.monto, mov.nota)
    )
    conn.commit()
    conn.close()
    return {"ok": True}

# ── RECURRENTES ────────────────────────────────────────────────────────────────

@app.get("/api/recurrentes")
def listar_recurrentes():
    conn = get_db()
    recs = rows_to_list(conn.execute("SELECT * FROM recurrentes ORDER BY id").fetchall())
    for r in recs:
        r["historial"] = get_historial("recurrente_pagos", "rec_id", r["id"], conn)
    conn.close()
    return recs

@app.post("/api/recurrentes")
def crear_recurrente(r: Recurrente):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO recurrentes (name,ico,color,monto,dia,nota) VALUES (?,?,?,?,?,?)",
        (r.name, r.ico, r.color, r.monto, r.dia, r.nota)
    )
    conn.commit()
    row_id = cur.lastrowid
    conn.close()
    return {"id": row_id, **r.dict()}

@app.put("/api/recurrentes/{rid}")
def editar_recurrente(rid: int, r: Recurrente):
    conn = get_db()
    conn.execute(
        "UPDATE recurrentes SET name=?,ico=?,color=?,monto=?,dia=?,nota=? WHERE id=?",
        (r.name, r.ico, r.color, r.monto, r.dia, r.nota, rid)
    )
    conn.commit()
    conn.close()
    return {"ok": True}

@app.delete("/api/recurrentes/{rid}")
def borrar_recurrente(rid: int):
    conn = get_db()
    conn.execute("DELETE FROM recurrentes WHERE id=?", (rid,))
    conn.execute("DELETE FROM recurrente_pagos WHERE rec_id=?", (rid,))
    conn.commit()
    conn.close()
    return {"ok": True}

@app.post("/api/recurrentes/{rid}/pagos")
def registrar_pago_rec(rid: int, pago: RecPago):
    conn = get_db()
    conn.execute(
        "INSERT INTO recurrente_pagos (rec_id,fecha,monto) VALUES (?,?,?)",
        (rid, pago.fecha, pago.monto)
    )
    conn.commit()
    conn.close()
    return {"ok": True}