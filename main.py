from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from pydantic import BaseModel
from typing import Optional
import os
from datetime import date
from pathlib import Path
import psycopg2
from psycopg2.extras import RealDictCursor

app = FastAPI(title="Mis Finanzas")

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR.mkdir(exist_ok=True)
TEMPLATES_DIR.mkdir(exist_ok=True)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")

# ── Base de datos PostgreSQL ───────────────────────────────────────────────────
DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:password@helium/heliumdb?sslmode=disable"
)

def get_db():
    conn = psycopg2.connect(DATABASE_URL, cursor_factory=RealDictCursor)
    return conn

def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
    CREATE TABLE IF NOT EXISTS movimientos (
        id        SERIAL PRIMARY KEY,
        tipo      TEXT NOT NULL,
        cat       TEXT,
        cat_label TEXT,
        cat_ico   TEXT,
        cat_color TEXT,
        descr     TEXT,
        monto     REAL,
        fecha     TEXT
    );

    CREATE TABLE IF NOT EXISTS deudas (
        id       SERIAL PRIMARY KEY,
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
        id       SERIAL PRIMARY KEY,
        deuda_id INTEGER,
        fecha    TEXT,
        monto    REAL,
        tipo     TEXT DEFAULT 'normal',
        nota     TEXT
    );

    CREATE TABLE IF NOT EXISTS ahorros (
        id     SERIAL PRIMARY KEY,
        type   TEXT DEFAULT 'meta',
        name   TEXT,
        ico    TEXT,
        meta   REAL,
        actual REAL DEFAULT 0,
        fecha  TEXT
    );

    CREATE TABLE IF NOT EXISTS ahorro_abonos (
        id        SERIAL PRIMARY KEY,
        ahorro_id INTEGER,
        fecha     TEXT,
        monto     REAL,
        nota      TEXT
    );

    CREATE TABLE IF NOT EXISTS inversiones (
        id        SERIAL PRIMARY KEY,
        name      TEXT,
        entidad   TEXT,
        capital   REAL,
        tasa      REAL,
        periodo   TEXT DEFAULT 'anual',
        fecha     TEXT,
        meses     INTEGER DEFAULT 12,
        sin_plazo BOOLEAN DEFAULT FALSE
    );

    CREATE TABLE IF NOT EXISTS inv_movimientos (
        id     SERIAL PRIMARY KEY,
        inv_id INTEGER,
        fecha  TEXT,
        monto  REAL,
        nota   TEXT
    );

    CREATE TABLE IF NOT EXISTS recurrentes (
        id    SERIAL PRIMARY KEY,
        name  TEXT,
        ico   TEXT,
        color TEXT,
        monto REAL,
        dia   INTEGER DEFAULT 1,
        nota  TEXT
    );

    CREATE TABLE IF NOT EXISTS recurrente_pagos (
        id     SERIAL PRIMARY KEY,
        rec_id INTEGER,
        fecha  TEXT,
        monto  REAL
    );
    """)
    conn.commit()
    cur.close()
    conn.close()

init_db()

# ── Modelos ────────────────────────────────────────────────────────────────────

class Movimiento(BaseModel):
    tipo: str
    cat: Optional[str] = ""
    cat_label: Optional[str] = ""
    cat_ico: Optional[str] = ""
    cat_color: Optional[str] = ""
    descr: str
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
    meses: Optional[int] = 0
    sin_plazo: Optional[bool] = False

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
    cur.execute(f"SELECT * FROM {table} WHERE {fk_col}=%s ORDER BY fecha ASC", (fk_id,))
    rows = cur.fetchall()
    cur.close()
    return rows_to_list(rows)

# ── Página principal ───────────────────────────────────────────────────────────

@app.get("/", response_class=HTMLResponse)
def root():
    with open(TEMPLATES_DIR / "index.html", encoding="utf-8") as f:
        return f.read()

# ── MOVIMIENTOS ────────────────────────────────────────────────────────────────

@app.get("/api/movimientos")
def listar_movimientos():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM movimientos ORDER BY fecha DESC")
    rows = rows_to_list(cur.fetchall())
    cur.close(); conn.close()
    return rows

@app.post("/api/movimientos")
def crear_movimiento(m: Movimiento):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO movimientos (tipo,cat,cat_label,cat_ico,cat_color,descr,monto,fecha) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
        (m.tipo, m.cat, m.cat_label, m.cat_ico, m.cat_color, m.descr, m.monto, m.fecha)
    )
    row_id = cur.fetchone()["id"]
    conn.commit(); cur.close(); conn.close()
    return {"id": row_id, **m.dict()}

@app.put("/api/movimientos/{mid}")
def editar_movimiento(mid: int, m: Movimiento):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "UPDATE movimientos SET tipo=%s,cat=%s,cat_label=%s,cat_ico=%s,cat_color=%s,descr=%s,monto=%s,fecha=%s WHERE id=%s",
        (m.tipo, m.cat, m.cat_label, m.cat_ico, m.cat_color, m.descr, m.monto, m.fecha, mid)
    )
    conn.commit(); cur.close(); conn.close()
    return {"ok": True}

@app.delete("/api/movimientos/{mid}")
def borrar_movimiento(mid: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM movimientos WHERE id=%s", (mid,))
    conn.commit(); cur.close(); conn.close()
    return {"ok": True}

# ── DEUDAS ─────────────────────────────────────────────────────────────────────

@app.get("/api/deudas")
def listar_deudas():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM deudas ORDER BY id")
    deudas = rows_to_list(cur.fetchall())
    for d in deudas:
        d["historial"] = get_historial("deuda_pagos", "deuda_id", d["id"], conn)
    cur.close(); conn.close()
    return deudas

@app.post("/api/deudas")
def crear_deuda(d: Deuda):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO deudas (name,ico,color,total,cuotas,pagadas,pagado,fecha,vence) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
        (d.name, d.ico, d.color, d.total, d.cuotas, d.pagadas, d.pagado, d.fecha, d.vence)
    )
    row_id = cur.fetchone()["id"]
    conn.commit()
    if d.pagado > 0:
        cur.execute(
            "INSERT INTO deuda_pagos (deuda_id,fecha,monto,tipo,nota) VALUES (%s,%s,%s,%s,%s)",
            (row_id, d.fecha, d.pagado, "normal", "Saldo inicial")
        )
        conn.commit()
    cur.close(); conn.close()
    return {"id": row_id, **d.dict()}

@app.put("/api/deudas/{did}")
def editar_deuda(did: int, d: Deuda):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "UPDATE deudas SET name=%s,ico=%s,color=%s,total=%s,cuotas=%s,pagadas=%s,pagado=%s,fecha=%s,vence=%s WHERE id=%s",
        (d.name, d.ico, d.color, d.total, d.cuotas, d.pagadas, d.pagado, d.fecha, d.vence, did)
    )
    conn.commit(); cur.close(); conn.close()
    return {"ok": True}

@app.delete("/api/deudas/{did}")
def borrar_deuda(did: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM deudas WHERE id=%s", (did,))
    cur.execute("DELETE FROM deuda_pagos WHERE deuda_id=%s", (did,))
    conn.commit(); cur.close(); conn.close()
    return {"ok": True}

@app.post("/api/deudas/{did}/pagos")
def agregar_pago_deuda(did: int, pago: DeudaPago):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM deudas WHERE id=%s", (did,))
    deuda = cur.fetchone()
    if not deuda:
        raise HTTPException(404, "Deuda no encontrada")
    deuda = dict(deuda)
    nuevo_pagado = min(deuda["total"], deuda["pagado"] + pago.monto)
    nuevas_pagadas = min(deuda["cuotas"], int(nuevo_pagado / (deuda["total"] / deuda["cuotas"])))
    cur.execute("UPDATE deudas SET pagado=%s, pagadas=%s WHERE id=%s", (nuevo_pagado, nuevas_pagadas, did))
    cur.execute(
        "INSERT INTO deuda_pagos (deuda_id,fecha,monto,tipo,nota) VALUES (%s,%s,%s,%s,%s)",
        (did, pago.fecha, pago.monto, pago.tipo, pago.nota)
    )
    conn.commit(); cur.close(); conn.close()
    return {"ok": True, "pagado": nuevo_pagado, "pagadas": nuevas_pagadas}

# ── AHORROS ────────────────────────────────────────────────────────────────────

@app.get("/api/ahorros")
def listar_ahorros():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM ahorros ORDER BY id")
    ahorros = rows_to_list(cur.fetchall())
    for a in ahorros:
        a["historial"] = get_historial("ahorro_abonos", "ahorro_id", a["id"], conn)
    cur.close(); conn.close()
    return ahorros

@app.post("/api/ahorros")
def crear_ahorro(a: Ahorro):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO ahorros (type,name,ico,meta,actual,fecha) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id",
        (a.type, a.name, a.ico, a.meta, a.actual, a.fecha)
    )
    row_id = cur.fetchone()["id"]
    conn.commit()
    if a.actual > 0:
        cur.execute(
            "INSERT INTO ahorro_abonos (ahorro_id,fecha,monto,nota) VALUES (%s,%s,%s,%s)",
            (row_id, date.today().isoformat(), a.actual, "Saldo inicial")
        )
        conn.commit()
    cur.close(); conn.close()
    return {"id": row_id, **a.dict()}

@app.put("/api/ahorros/{aid}")
def editar_ahorro(aid: int, a: Ahorro):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "UPDATE ahorros SET type=%s,name=%s,ico=%s,meta=%s,actual=%s,fecha=%s WHERE id=%s",
        (a.type, a.name, a.ico, a.meta, a.actual, a.fecha, aid)
    )
    conn.commit(); cur.close(); conn.close()
    return {"ok": True}

@app.delete("/api/ahorros/{aid}")
def borrar_ahorro(aid: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM ahorros WHERE id=%s", (aid,))
    cur.execute("DELETE FROM ahorro_abonos WHERE ahorro_id=%s", (aid,))
    conn.commit(); cur.close(); conn.close()
    return {"ok": True}

@app.post("/api/ahorros/{aid}/abonos")
def abonar_ahorro(aid: int, abono: AhorroAbono):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM ahorros WHERE id=%s", (aid,))
    ahorro = cur.fetchone()
    if not ahorro:
        raise HTTPException(404, "Ahorro no encontrado")
    ahorro = dict(ahorro)
    nuevo = min(ahorro["meta"], ahorro["actual"] + abono.monto)
    cur.execute("UPDATE ahorros SET actual=%s WHERE id=%s", (nuevo, aid))
    cur.execute(
        "INSERT INTO ahorro_abonos (ahorro_id,fecha,monto,nota) VALUES (%s,%s,%s,%s)",
        (aid, abono.fecha, abono.monto, abono.nota)
    )
    conn.commit(); cur.close(); conn.close()
    return {"ok": True, "actual": nuevo}

# ── INVERSIONES ────────────────────────────────────────────────────────────────

@app.get("/api/inversiones")
def listar_inversiones():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM inversiones ORDER BY id")
    invs = rows_to_list(cur.fetchall())
    for inv in invs:
        inv["historial"] = get_historial("inv_movimientos", "inv_id", inv["id"], conn)
    cur.close(); conn.close()
    return invs

@app.post("/api/inversiones")
def crear_inversion(inv: Inversion):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO inversiones (name,entidad,capital,tasa,periodo,fecha,meses,sin_plazo) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
        (inv.name, inv.entidad, inv.capital, inv.tasa, inv.periodo, inv.fecha, inv.meses, inv.sin_plazo)
    )
    row_id = cur.fetchone()["id"]
    conn.commit()
    cur.execute(
        "INSERT INTO inv_movimientos (inv_id,fecha,monto,nota) VALUES (%s,%s,%s,%s)",
        (row_id, inv.fecha, inv.capital, "Apertura")
    )
    conn.commit(); cur.close(); conn.close()
    return {"id": row_id, **inv.dict()}

@app.put("/api/inversiones/{iid}")
def editar_inversion(iid: int, inv: Inversion):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "UPDATE inversiones SET name=%s,entidad=%s,capital=%s,tasa=%s,periodo=%s,fecha=%s,meses=%s,sin_plazo=%s WHERE id=%s",
        (inv.name, inv.entidad, inv.capital, inv.tasa, inv.periodo, inv.fecha, inv.meses, inv.sin_plazo, iid)
    )
    conn.commit(); cur.close(); conn.close()
    return {"ok": True}

@app.delete("/api/inversiones/{iid}")
def borrar_inversion(iid: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM inversiones WHERE id=%s", (iid,))
    cur.execute("DELETE FROM inv_movimientos WHERE inv_id=%s", (iid,))
    conn.commit(); cur.close(); conn.close()
    return {"ok": True}

@app.post("/api/inversiones/{iid}/movimientos")
def agregar_mov_inv(iid: int, mov: InvMovimiento):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO inv_movimientos (inv_id,fecha,monto,nota) VALUES (%s,%s,%s,%s)",
        (iid, mov.fecha, mov.monto, mov.nota)
    )
    conn.commit(); cur.close(); conn.close()
    return {"ok": True}

# ── RECURRENTES ────────────────────────────────────────────────────────────────

@app.get("/api/recurrentes")
def listar_recurrentes():
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM recurrentes ORDER BY id")
    recs = rows_to_list(cur.fetchall())
    for r in recs:
        r["historial"] = get_historial("recurrente_pagos", "rec_id", r["id"], conn)
    cur.close(); conn.close()
    return recs

@app.post("/api/recurrentes")
def crear_recurrente(r: Recurrente):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO recurrentes (name,ico,color,monto,dia,nota) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id",
        (r.name, r.ico, r.color, r.monto, r.dia, r.nota)
    )
    row_id = cur.fetchone()["id"]
    conn.commit(); cur.close(); conn.close()
    return {"id": row_id, **r.dict()}

@app.put("/api/recurrentes/{rid}")
def editar_recurrente(rid: int, r: Recurrente):
    conn = get_db()
    cur = conn.cursor()
    cur.execute(
        "UPDATE recurrentes SET name=%s,ico=%s,color=%s,monto=%s,dia=%s,nota=%s WHERE id=%s",
        (r.name, r.ico, r.color, r.monto, r.dia, r.nota, rid)
    )
    conn.commit(); cur.close(); conn.close()
    return {"ok": True}

@app.delete("/api/recurrentes/{rid}")
def borrar_recurrente(rid: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("DELETE FROM recurrentes WHERE id=%s", (rid,))
    cur.execute("DELETE FROM recurrente_pagos WHERE rec_id=%s", (rid,))
    conn.commit(); cur.close(); conn.close()
    return {"ok": True}

@app.post("/api/recurrentes/{rid}/pagos")
def registrar_pago_rec(rid: int, pago: RecPago):
    """Registra el pago de un gasto fijo y lo crea como movimiento automáticamente."""
    conn = get_db()
    cur = conn.cursor()
    # Obtener info del recurrente
    cur.execute("SELECT * FROM recurrentes WHERE id=%s", (rid,))
    rec = cur.fetchone()
    if not rec:
        raise HTTPException(404, "Gasto fijo no encontrado")
    rec = dict(rec)
    # Guardar en historial de recurrente
    cur.execute(
        "INSERT INTO recurrente_pagos (rec_id,fecha,monto) VALUES (%s,%s,%s)",
        (rid, pago.fecha, pago.monto)
    )
    # Crear movimiento automático en la tabla de movimientos
    cur.execute(
        "INSERT INTO movimientos (tipo,cat,cat_label,cat_ico,cat_color,descr,monto,fecha) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
        ("gasto", "recurrente", rec["name"], rec["ico"], rec["color"], rec["name"], pago.monto, pago.fecha)
    )
    mov_id = cur.fetchone()["id"]
    conn.commit(); cur.close(); conn.close()
    return {"ok": True, "movimiento_id": mov_id}