// ── CONFIG ─────────────────────────────────────────────────────────────────────
const CATS = {
  ingreso: [
    { key: 'salario',       label: 'Salario',       laben: 'Salary',      ico: '💼', color: '#378ADD' },
    { key: 'arriendo_i',    label: 'Arriendo',      laben: 'Rent in',     ico: '🏠', color: '#1D9E75' },
    { key: 'honorarios',    label: 'Honorarios',    laben: 'Fees',        ico: '📋', color: '#7F77DD' },
    { key: 'ventas',        label: 'Ventas',        laben: 'Sales',       ico: '🛍️', color: '#EF9F27' },
    { key: 'transferencia', label: 'Transferencia', laben: 'Transfer',    ico: '🔄', color: '#5DCAA5' },
    { key: 'personalizado', label: 'Personalizada', laben: 'Custom',      ico: '✏️', color: '#888780' }
  ],
  gasto: [
    { key: 'alimentacion',  label: 'Alimentación',  laben: 'Food',        ico: '🛒', color: '#D85A30' },
    { key: 'arriendo_g',    label: 'Arriendo',      laben: 'Rent',        ico: '🏠', color: '#993C1D' },
    { key: 'servicios',     label: 'Servicios',     laben: 'Utilities',   ico: '💡', color: '#BA7517' },
    { key: 'transporte',    label: 'Transporte',    laben: 'Transport',   ico: '🚌', color: '#639922' },
    { key: 'salud',         label: 'Salud',         laben: 'Health',      ico: '🏥', color: '#D4537E' },
    { key: 'educacion',     label: 'Educación',     laben: 'Education',   ico: '📚', color: '#7F77DD' },
    { key: 'ocio',          label: 'Ocio',          laben: 'Leisure',     ico: '🎬', color: '#5DCAA5' },
    { key: 'ropa',          label: 'Ropa',          laben: 'Clothing',    ico: '👕', color: '#EF9F27' },
    { key: 'personalizado', label: 'Personalizada', laben: 'Custom',      ico: '✏️', color: '#888780' }
  ]
};

// ── TRADUCCIONES ───────────────────────────────────────────────────────────────
const I18N = {
  es: {
    // topbar
    appTitle: 'Mis finanzas',
    btnAgregar: '+ Agregar',
    // tabs
    resumen: 'Resumen', movimientos: 'Movimientos', deudas: 'Deudas',
    ahorros: 'Ahorros', fijos: 'Fijos', alertas: 'Alertas',
    // métricas
    ingresos: 'Ingresos', gastos: 'Gastos', disponible: 'Disponible', deudaTotal: 'Deuda total',
    // cards resumen
    distGastos: 'Distribución de gastos', sinGastos: 'Sin gastos aún.',
    ingVsGas: 'Ingresos vs gastos', ultimosAbonos: 'Últimos abonos a deudas', sinAbonos: 'Sin abonos aún.',
    // movimientos
    sinMovimientos: 'Sin movimientos.',
    // deudas
    tocaTarjeta: 'Toca una tarjeta para ver el historial completo y estadísticas.',
    sinDeudasActivas: 'Sin deudas activas.',
    deudasPagadas: 'Deudas pagadas',
    nuevaDeuda: '+ Nueva deuda',
    // ahorros
    totalAhorrado: 'Total ahorrado', metasActivas: 'Metas activas',
    sinMetas: 'Sin metas de ahorro.',
    nuevaMetaInv: '+ Nueva meta / inversión',
    // fijos
    infoFijos: 'Suscripciones y pagos fijos. Toca una tarjeta para ver el historial de cobros.',
    sinFijos: 'Sin gastos fijos.',
    totalMensualFijos: 'Total mensual fijos', servicios: 'servicios',
    proximoCobro: 'Próximo cobro', cobrado: 'Cobrado', hoy: '¡Hoy!',
    agregarFijo: '+ Agregar gasto fijo',
    registrarPago: 'Registrar pago',
    pagoRegistrado: 'Pago registrado y agregado a movimientos ✓',
    // alertas
    alertasActivas: 'Alertas activas', sinAlertas: 'Sin alertas activas.',
    ventanaRecordatorio: 'Ventana de recordatorio',
    ventanaSub: '¿Con cuántos días de anticipación avisamos?',
    // modal
    nuevoMovimiento: 'Nuevo movimiento',
    ingreso: '↑ Ingreso', gasto: '↓ Gasto', deuda: '💳 Deuda',
    ahorro: '🐷 Ahorro', gastoFijo: '🔁 Gasto fijo',
    categoria: 'Categoría', descripcion: 'Descripción', monto: 'Monto ($)', fecha: 'Fecha',
    guardar: '✓ Guardar',
    nombre: 'Nombre', icono: 'Ícono', notas: 'Notas',
    montoMensual: 'Monto mensual ($)', diaCobro: 'Día de cobro',
    metaAhorro: '🎯 Meta de ahorro', cdtInversion: '📈 CDT / Inversión',
    cuentaAR: '🏦 Cuenta alto rendimiento',
    metaTotal: 'Meta total ($)', yaAhorrado: 'Ya ahorrado ($)', fechaObjetivo: 'Fecha objetivo',
    capital: 'Capital ($)', tasa: 'Tasa (%)', periodo: 'Período',
    anual: 'Anual (E.A.)', mensual: 'Mensual',
    duracion: 'Duración (meses)', sinPlazoLabel: 'Sin plazo fijo',
    entidad: 'Entidad',
    montoTotal: 'Monto total ($)', cuotasTotales: 'Cuotas totales',
    cuotasPagadas: 'Cuotas pagadas', yaPagado: 'Ya pagado ($)',
    fechaInicio: 'Fecha inicio', diaVencimiento: 'Día vencimiento',
    // detalle
    detalleDeuda: 'Detalle de deuda', metaAhorroLabel: 'Meta de ahorro',
    cdtLabel: 'CDT / Inversión', cuentaARLabel: 'Cuenta alto rendimiento',
    gastoFijoLabel: 'Gasto fijo mensual',
    estadisticas: 'Estadísticas', evolucionPagos: 'Evolución de pagos',
    evolucionAhorro: 'Evolución del ahorro', proyeccionMensual: 'Proyección mensual',
    historialPagos: 'Historial completo', historialAbonos: 'Historial de abonos',
    historialCobros: 'Todos los cobros', historialMov: 'Historial de movimientos',
    cuotasRest: 'cuotas rest.', pagado: 'Pagado', restante: 'Restante',
    promedioPago: 'Promedio/pago', promedioAbono: 'Promedio/abono',
    paraCompletar: 'Para completar', abonos: 'abonos',
    ganancia: 'Ganancia', totalFinal: 'Total final', porDia: 'Por día',
    rendimientoTotal: 'Rendimiento total', gananciaMensual: 'Ganancia mensual promedio',
    pagosRegistrados: 'Pagos registrados', totalPagado: 'Total pagado',
    anual_label: 'Anual', mensual_label: 'Mensual',
    abonarBtn: '+ Abonar', pagoExtra: 'Abono extra ($)',
    nuevaNotaOpc: 'Nota (opcional)',
    editarBtn: '✏️ Editar', eliminarBtn: '🗑 Eliminar',
    guardarCambios: 'Guardar cambios',
    // config
    configuracion: 'Configuración', modoOscuro: 'Modo oscuro',
    idioma: 'Idioma', moneda: 'Moneda',
    personalizarIconos: 'Personalizar íconos de pestañas',
    iconoPara: 'Ícono para:',
    subirImagen: '📷 Subir imagen propia',
    // consejos
    consejos: '💡 Consejos',
    // confirmaciones
    confirmarEliminar: '¿Eliminar?',
    confirmarEliminarDeuda: '¿Eliminar esta deuda?',
    confirmarEliminarMeta: '¿Eliminar esta meta?',
    confirmarEliminarInv: '¿Eliminar esta inversión?',
    confirmarEliminarFijo: '¿Eliminar este gasto fijo?',
    pagada100: '¡pagada al 100%!',
    metaCompleta: '¡Meta completada! 🎉',
  },
  en: {
    appTitle: 'My finances',
    btnAgregar: '+ Add',
    resumen: 'Summary', movimientos: 'Transactions', deudas: 'Debts',
    ahorros: 'Savings', fijos: 'Fixed', alertas: 'Alerts',
    ingresos: 'Income', gastos: 'Expenses', disponible: 'Available', deudaTotal: 'Total debt',
    distGastos: 'Expense breakdown', sinGastos: 'No expenses yet.',
    ingVsGas: 'Income vs expenses', ultimosAbonos: 'Latest debt payments', sinAbonos: 'No payments yet.',
    sinMovimientos: 'No transactions.',
    tocaTarjeta: 'Tap a card to see full history and statistics.',
    sinDeudasActivas: 'No active debts.',
    deudasPagadas: 'Paid debts',
    nuevaDeuda: '+ New debt',
    totalAhorrado: 'Total saved', metasActivas: 'Active goals',
    sinMetas: 'No savings goals.',
    nuevaMetaInv: '+ New goal / investment',
    infoFijos: 'Subscriptions and fixed payments. Tap a card to see payment history.',
    sinFijos: 'No fixed expenses.',
    totalMensualFijos: 'Total monthly fixed', servicios: 'services',
    proximoCobro: 'Next charge', cobrado: 'Charged', hoy: 'Today!',
    agregarFijo: '+ Add fixed expense',
    registrarPago: 'Register payment',
    pagoRegistrado: 'Payment registered and added to transactions ✓',
    alertasActivas: 'Active alerts', sinAlertas: 'No active alerts.',
    ventanaRecordatorio: 'Reminder window',
    ventanaSub: 'How many days in advance should we remind you?',
    nuevoMovimiento: 'New transaction',
    ingreso: '↑ Income', gasto: '↓ Expense', deuda: '💳 Debt',
    ahorro: '🐷 Savings', gastoFijo: '🔁 Fixed expense',
    categoria: 'Category', descripcion: 'Description', monto: 'Amount ($)', fecha: 'Date',
    guardar: '✓ Save',
    nombre: 'Name', icono: 'Icon', notas: 'Notes',
    montoMensual: 'Monthly amount ($)', diaCobro: 'Charge day',
    metaAhorro: '🎯 Savings goal', cdtInversion: '📈 Fixed deposit',
    cuentaAR: '🏦 High-yield account',
    metaTotal: 'Total goal ($)', yaAhorrado: 'Already saved ($)', fechaObjetivo: 'Target date',
    capital: 'Capital ($)', tasa: 'Rate (%)', periodo: 'Period',
    anual: 'Annual (E.A.)', mensual: 'Monthly',
    duracion: 'Duration (months)', sinPlazoLabel: 'No fixed term',
    entidad: 'Institution',
    montoTotal: 'Total amount ($)', cuotasTotales: 'Total installments',
    cuotasPagadas: 'Paid installments', yaPagado: 'Already paid ($)',
    fechaInicio: 'Start date', diaVencimiento: 'Due day',
    detalleDeuda: 'Debt detail', metaAhorroLabel: 'Savings goal',
    cdtLabel: 'Fixed deposit', cuentaARLabel: 'High-yield account',
    gastoFijoLabel: 'Monthly fixed expense',
    estadisticas: 'Statistics', evolucionPagos: 'Payment evolution',
    evolucionAhorro: 'Savings evolution', proyeccionMensual: 'Monthly projection',
    historialPagos: 'Full history', historialAbonos: 'Payment history',
    historialCobros: 'All charges', historialMov: 'Movement history',
    cuotasRest: 'remaining', pagado: 'Paid', restante: 'Remaining',
    promedioPago: 'Avg/payment', promedioAbono: 'Avg/deposit',
    paraCompletar: 'To complete', abonos: 'deposits',
    ganancia: 'Gain', totalFinal: 'Final total', porDia: 'Per day',
    rendimientoTotal: 'Total return', gananciaMensual: 'Monthly avg gain',
    pagosRegistrados: 'Registered payments', totalPagado: 'Total paid',
    anual_label: 'Annual', mensual_label: 'Monthly',
    abonarBtn: '+ Pay', pagoExtra: 'Extra payment ($)',
    nuevaNotaOpc: 'Note (optional)',
    editarBtn: '✏️ Edit', eliminarBtn: '🗑 Delete',
    guardarCambios: 'Save changes',
    configuracion: 'Settings', modoOscuro: 'Dark mode',
    idioma: 'Language', moneda: 'Currency',
    personalizarIconos: 'Customize tab icons',
    iconoPara: 'Icon for:',
    subirImagen: '📷 Upload image',
    consejos: '💡 Tips',
    confirmarEliminar: 'Delete?',
    confirmarEliminarDeuda: 'Delete this debt?',
    confirmarEliminarMeta: 'Delete this goal?',
    confirmarEliminarInv: 'Delete this investment?',
    confirmarEliminarFijo: 'Delete this fixed expense?',
    pagada100: 'paid 100%!',
    metaCompleta: 'Goal completed! 🎉',
  }
};

const EMOJIS = ['📊','📈','💰','🏦','💎','🌱','⭐','🔥','🎯','🚀','🦁','🌟','🎉','🐱','🦊','🌈','🍀','🎨','⚡','🧠'];
const TAB_IDS = ['resumen','movimientos','deudas','ahorros','recurrentes','notificaciones'];

// ── ESTADO ─────────────────────────────────────────────────────────────────────
let currency = 'COP', lang = 'es', darkMode = false;
let selectedCat = 'salario', currentTipo = 'ingreso', savType = 'meta';
let editingId = null, txnFilter = 'todos', paidOpen = false;
let editingTab = 'resumen';
let tabIcons = { resumen:'📊', movimientos:'📋', deudas:'💳', ahorros:'🐷', recurrentes:'🔁', notificaciones:'🔔' };
let detailType = null, detailId = null, detailChartInst = null, barInst = null, savAbonoId = null;
let txns = [], debts = [], savings = [], inversiones = [], recurrentes = [];

// ── UTILS ──────────────────────────────────────────────────────────────────────
const pM = s => parseFloat(String(s).replace(/\./g, '').replace(',', '.')) || 0;
const mi = el => { const r = el.value.replace(/[^0-9]/g, ''); el.value = r ? parseInt(r).toLocaleString('es-CO') : ''; };
const fmt = n => {
  const v = Math.round(Math.abs(n));
  return currency === 'USD' ? '$' + Math.round(v / 4200).toLocaleString('en-US') : '$' + v.toLocaleString('es-CO');
};
const todayStr = () => new Date().toISOString().split('T')[0];
const t = k => (I18N[lang] || I18N.es)[k] || k;

function setTopbarDate() {
  const d = new Date();
  const msEs = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const msEn = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const ms = lang === 'en' ? msEn : msEs;
  document.getElementById('topbar-date').textContent = `${d.getDate()} de ${ms[d.getMonth()]} de ${d.getFullYear()}`;
}

// ── APLICAR IDIOMA ─────────────────────────────────────────────────────────────
function applyLang() {
  setTopbarDate();
  // topbar
  const appTitleEl = document.getElementById('app-title');
  if (appTitleEl) appTitleEl.textContent = t('appTitle');
  const btnAdd = document.getElementById('btn-agregar-top');
  if (btnAdd) btnAdd.textContent = t('btnAgregar');
  // tabs
  TAB_IDS.forEach((id, i) => {
    const keys = ['resumen','movimientos','deudas','ahorros','fijos','alertas'];
    const el = document.querySelector(`#tab-btn-${id} .tab-label`);
    if (el) el.textContent = t(keys[i]);
  });
  // métricas
  setText('lbl-ingresos', t('ingresos'));
  setText('lbl-gastos', t('gastos'));
  setText('lbl-disponible', t('disponible'));
  setText('lbl-deuda-total', t('deudaTotal'));
  // resumen cards
  setText('lbl-dist-gastos', t('distGastos'));
  setText('lbl-ing-vs-gas', t('ingVsGas'));
  setText('lbl-ultimos-abonos', t('ultimosAbonos'));
  // modal
  setText('modal-title-txt', t('nuevoMovimiento'));
  setText('btn-ing', t('ingreso'));
  setText('btn-exp', t('gasto'));
  setText('btn-deu', t('deuda'));
  setText('btn-sav', t('ahorro'));
  setText('btn-rec', t('gastoFijo'));
  setText('lbl-cat', t('categoria'));
  setText('lbl-desc', t('descripcion'));
  setText('lbl-monto', t('monto'));
  setText('lbl-fecha', t('fecha'));
  setText('btn-guardar', t('guardar'));
  // config
  setText('lbl-config', t('configuracion'));
  setText('lbl-dark', t('modoOscuro'));
  setText('lbl-idioma', t('idioma'));
  setText('lbl-moneda', t('moneda'));
  // re-render todo
  renderAll();
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

// ── API ────────────────────────────────────────────────────────────────────────
async function api(method, url, body = null) {
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
const GET = url => api('GET', url);
const POST = (url, b) => api('POST', url, b);
const PUT = (url, b) => api('PUT', url, b);
const DEL = url => api('DELETE', url);

async function loadAll() {
  try {
    [txns, debts, savings, inversiones, recurrentes] = await Promise.all([
      GET('/api/movimientos'),
      GET('/api/deudas'),
      GET('/api/ahorros'),
      GET('/api/inversiones'),
      GET('/api/recurrentes')
    ]);
    renderAll();
  } catch (e) { console.error('Error cargando datos:', e); }
}

function renderAll() {
  calcTotals(); renderBars(); renderTxns(); renderDebts();
  renderSavings(); renderHistorial(); renderRecurrentes(); renderNotifs();
  setTimeout(buildBarChart, 100);
}

// ── TOTALES ────────────────────────────────────────────────────────────────────
function calcTotals() {
  const ing = txns.filter(x => x.tipo === 'ingreso').reduce((s, x) => s + x.monto, 0);
  const gas = txns.filter(x => x.tipo === 'gasto').reduce((s, x) => s + x.monto, 0);
  const deu = debts.filter(d => d.pagado < d.total).reduce((s, d) => s + (d.total - d.pagado), 0);
  document.getElementById('t-ing').textContent = fmt(ing);
  document.getElementById('t-gas').textContent = fmt(gas);
  document.getElementById('t-dis').textContent = fmt(ing - gas);
  document.getElementById('t-deu').textContent = fmt(deu);
  return { ing, gas, deu };
}

function renderBars() {
  const by = {};
  txns.filter(x => x.tipo === 'gasto').forEach(x => {
    const k = x.cat_label || x.cat || 'Otro';
    if (!by[k]) by[k] = { val: 0, color: x.cat_color || '#888' };
    by[k].val += x.monto;
  });
  const total = Object.values(by).reduce((a, b) => a + b.val, 0) || 1;
  const sorted = Object.entries(by).sort((a, b) => b[1].val - a[1].val);
  const el = document.getElementById('gasto-bars');
  if (!sorted.length) { el.innerHTML = `<div style="font-size:13px;color:var(--txt2)">${t('sinGastos')}</div>`; return; }
  el.innerHTML = sorted.map(([l, { val, color }]) =>
    `<div class="bar-row"><div class="bar-label">${l}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.round(val/total*100)}%;background:${color}"></div></div><div class="bar-val">${fmt(val)}</div></div>`
  ).join('');
}

function renderHistorial() {
  const all = [];
  debts.forEach(d => (d.historial || []).forEach(h => all.push({ ...h, dname: d.name, dico: d.ico })));
  const sorted = all.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 5);
  const el = document.getElementById('historial-res');
  if (!sorted.length) { el.innerHTML = `<div style="font-size:13px;color:var(--txt2)">${t('sinAbonos')}</div>`; return; }
  el.innerHTML = sorted.map(h =>
    `<div class="tl-item"><div class="tl-dot ${h.tipo==='extra'?'e':'p'}"></div>
     <div class="tl-body"><div class="tl-name">${h.dico||''} ${h.dname}</div><div class="tl-date">${h.fecha}</div></div>
     <div class="tl-right"><div class="tag ${h.tipo==='extra'?'tag-e':'tag-p'}">${h.tipo==='extra'?t('pagoExtra'):'Normal'}</div><div style="font-size:12px;font-weight:500">${fmt(h.monto)}</div></div></div>`
  ).join('');
}

// ── MOVIMIENTOS ────────────────────────────────────────────────────────────────
function renderTxns(filter) {
  if (filter !== undefined) txnFilter = filter;
  const list = txnFilter === 'todos' ? txns : txns.filter(x => x.tipo === txnFilter);
  const sorted = [...list].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  const el = document.getElementById('txn-list');
  if (!sorted.length) { el.innerHTML = `<div style="font-size:13px;color:var(--txt2)">${t('sinMovimientos')}</div>`; return; }
  el.innerHTML = sorted.map(x =>
    `<div class="txn">
      <div class="txn-ico" style="background:${x.cat_color||'#888'}22">${x.cat_ico||'📌'}</div>
      <div class="txn-info"><div class="txn-name">${x.descr||x.desc||''}</div><div class="txn-cat">${x.cat_label||x.cat||''} · ${x.fecha}</div></div>
      <div class="txn-amount" style="color:${x.tipo==='ingreso'?'#0F6E56':'#993C1D'}">${x.tipo==='ingreso'?'+':'-'}${fmt(x.monto)}</div>
      <div class="txn-actions">
        <button class="icon-btn" onclick="openEdit(${x.id})">✏️</button>
        <button class="icon-btn del" onclick="deleteTxn(${x.id})">🗑</button>
      </div>
    </div>`
  ).join('');
}

async function deleteTxn(id) {
  if (!confirm(t('confirmarEliminar'))) return;
  await DEL(`/api/movimientos/${id}`);
  txns = txns.filter(x => x.id !== id);
  renderTxns(); calcTotals(); renderBars(); updateBarChart();
}

function openEdit(id) {
  const x = txns.find(y => y.id === id); if (!x) return;
  editingId = id;
  document.getElementById('edit-desc').value = x.descr || x.desc || '';
  document.getElementById('edit-monto').value = x.monto.toLocaleString('es-CO');
  document.getElementById('edit-fecha').value = x.fecha;
  document.getElementById('modal-edit').classList.add('open');
}
function closeEdit() { document.getElementById('modal-edit').classList.remove('open'); editingId = null; }
async function saveEdit() {
  const x = txns.find(y => y.id === editingId); if (!x) return;
  const updated = { ...x, descr: document.getElementById('edit-desc').value.trim() || x.descr, monto: pM(document.getElementById('edit-monto').value) || x.monto, fecha: document.getElementById('edit-fecha').value || x.fecha };
  await PUT(`/api/movimientos/${editingId}`, updated);
  Object.assign(x, updated);
  closeEdit(); renderTxns(); calcTotals(); renderBars(); updateBarChart();
}

function filterTxn(f, btn) {
  document.querySelectorAll('#tab-movimientos .chip').forEach(c => c.classList.remove('sel'));
  btn.classList.add('sel'); renderTxns(f);
}

// ── DEUDAS ─────────────────────────────────────────────────────────────────────
function renderDebts() {
  const active = debts.filter(d => d.pagado < d.total);
  const paid = debts.filter(d => d.pagado >= d.total);
  const el = document.getElementById('debt-active-list');
  el.innerHTML = active.length ? active.map(d => debtCardHTML(d)).join('') : `<div style="font-size:13px;color:var(--txt2)">${t('sinDeudasActivas')}</div>`;
  const ps = document.getElementById('paid-section'), pl = document.getElementById('debt-paid-list');
  if (paid.length) { ps.classList.remove('hidden'); pl.innerHTML = paid.map(d => debtCardHTML(d, true)).join(''); }
  else ps.classList.add('hidden');
}

function debtCardHTML(d, isPaid = false) {
  const pct = Math.min(100, Math.round(d.pagado / d.total * 100));
  const pc = isPaid ? '#1D9E75' : pct >= 75 ? '#1D9E75' : pct >= 40 ? '#EF9F27' : '#D85A30';
  const lastH = (d.historial || []).slice(-1)[0];
  return `<div class="item-card" onclick="openDetail('deuda',${d.id})">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:.625rem">
      <div style="width:38px;height:38px;border-radius:50%;background:${d.color||'#888'}22;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${d.ico}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:14px;font-weight:500">${d.name}</div>
        <div style="font-size:11px;color:var(--txt2)">Cuota ≈ ${fmt(d.total/d.cuotas)} · ${Math.max(0,d.cuotas-d.pagadas)} ${t('cuotasRest')}</div>
        ${lastH ? `<div style="font-size:11px;color:var(--txt2)">${lang==='en'?'Last payment':'Último pago'}: ${lastH.fecha} · ${fmt(lastH.monto)}</div>` : ''}
      </div>
      <span style="color:var(--txt2);font-size:14px">›</span>
    </div>
    <div class="prog-track"><div class="prog-fill" style="width:${pct}%;background:${pc}"></div></div>
    <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--txt2);margin-top:3px"><span>${pct}% ${t('pagado').toLowerCase()}</span><span>${t('restante')} ${fmt(d.total-d.pagado)}</span></div>
  </div>`;
}

async function deleteDebt(id) {
  if (!confirm(t('confirmarEliminarDeuda'))) return;
  await DEL(`/api/deudas/${id}`);
  debts = debts.filter(d => d.id !== id);
  renderDebts(); calcTotals(); renderNotifs();
}
function togglePaid() {
  paidOpen = !paidOpen;
  document.getElementById('debt-paid-list').classList.toggle('hidden', !paidOpen);
  document.getElementById('paid-arrow').classList.toggle('open', paidOpen);
}

// ── AHORROS ────────────────────────────────────────────────────────────────────
function renderSavings() {
  const total = savings.reduce((s, g) => s + g.actual, 0);
  document.getElementById('saving-total').textContent = fmt(total);
  document.getElementById('saving-count').textContent = savings.length;
  const el = document.getElementById('saving-goals-list');
  el.innerHTML = savings.map(g => {
    const pct = Math.min(100, Math.round(g.actual / g.meta * 100));
    const circ = 2 * Math.PI * 24, dash = (circ * pct / 100).toFixed(1);
    const lastH = (g.historial || []).slice(-1)[0];
    return `<div class="item-card" onclick="openDetail('ahorro',${g.id})">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="ring-wrap" style="width:60px;height:60px">
          <svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="24" fill="none" stroke="var(--bg2)" stroke-width="6"/><circle cx="30" cy="30" r="24" fill="none" stroke="#185FA5" stroke-width="6" stroke-dasharray="${dash} ${circ.toFixed(1)}" stroke-linecap="round"/></svg>
          <div class="ring-center"><div class="ring-pct">${pct}%</div></div>
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:500">${g.ico||''} ${g.name}</div>
          <div style="font-size:12px;color:var(--txt2)">${fmt(g.actual)} ${lang==='en'?'of':'de'} ${fmt(g.meta)}</div>
          ${lastH ? `<div style="font-size:11px;color:var(--txt2)">${lang==='en'?'Last deposit':'Último abono'}: ${lastH.fecha} · ${fmt(lastH.monto)}</div>` : ''}
          ${g.fecha ? `<div style="font-size:11px;color:#185FA5">${lang==='en'?'Target':'Objetivo'}: ${g.fecha}</div>` : ''}
        </div>
        <span style="color:var(--txt2);font-size:14px">›</span>
      </div>
    </div>`;
  }).join('');
  renderInversiones();
}

function renderInversiones() {
  const el = document.getElementById('inv-list');
  el.innerHTML = inversiones.map(inv => {
    const tasaM = inv.periodo === 'anual' ? Math.pow(1 + inv.tasa / 100, 1/12) - 1 : inv.tasa / 100;
    const mesesCalc = inv.sin_plazo ? 12 : (inv.meses || 12);
    const ganancia = inv.capital * (Math.pow(1 + tasaM, mesesCalc) - 1);
    const diaria = ganancia / 365;
    const lastH = (inv.historial || []).slice(-1)[0];
    const label = inv.sin_plazo ? t('cuentaARLabel') : t('cdtLabel');
    return `<div class="inv-card" onclick="openDetail('inversion',${inv.id})">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:.75rem">
        <div style="width:38px;height:38px;border-radius:50%;background:#E6F1FB;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${inv.sin_plazo?'🏦':'📈'}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:500">${inv.name}</div>
          <div style="font-size:11px;color:#185FA5">${label} · ${inv.entidad||''} · ${inv.tasa}% ${inv.periodo==='anual'?t('anual_label'):t('mensual_label')}</div>
          ${lastH ? `<div style="font-size:11px;color:var(--txt2)">${lang==='en'?'Last mov':'Último mov'}: ${lastH.fecha}</div>` : ''}
        </div>
        <span style="color:var(--txt2);font-size:14px">›</span>
      </div>
      <div class="inv-stats">
        <div class="inv-stat"><div class="inv-stat-val">${fmt(inv.capital)}</div><div class="inv-stat-lbl">${t('capital')}</div></div>
        <div class="inv-stat"><div class="inv-stat-val" style="color:#085041">+${fmt(ganancia)}</div><div class="inv-stat-lbl">${t('ganancia')}</div></div>
        <div class="inv-stat"><div class="inv-stat-val">${fmt(diaria)}/${lang==='en'?'day':'día'}</div><div class="inv-stat-lbl">${t('porDia')}</div></div>
      </div>
    </div>`;
  }).join('');
}

async function deleteSaving(id) {
  if (!confirm(t('confirmarEliminarMeta'))) return;
  await DEL(`/api/ahorros/${id}`);
  savings = savings.filter(x => x.id !== id); renderSavings();
}
async function deleteInv(id) {
  if (!confirm(t('confirmarEliminarInv'))) return;
  await DEL(`/api/inversiones/${id}`);
  inversiones = inversiones.filter(x => x.id !== id); renderInversiones();
}

function openSavAbono(id) {
  savAbonoId = id;
  const g = savings.find(x => x.id === id); if (!g) return;
  document.getElementById('sav-abono-name').textContent = `${g.ico||''} ${g.name}`;
  document.getElementById('sav-abono-monto').value = '';
  document.getElementById('sav-abono-nota').value = '';
  document.getElementById('modal-sav-abono').classList.add('open');
}
async function guardarAbonoSaving() {
  const g = savings.find(x => x.id === savAbonoId); if (!g) return;
  const monto = pM(document.getElementById('sav-abono-monto').value);
  const nota = document.getElementById('sav-abono-nota').value.trim();
  if (!monto || monto <= 0) return;
  await POST(`/api/ahorros/${savAbonoId}/abonos`, { fecha: todayStr(), monto, nota });
  g.actual = Math.min(g.meta, g.actual + monto);
  if (!g.historial) g.historial = [];
  g.historial.push({ fecha: todayStr(), monto, nota });
  document.getElementById('modal-sav-abono').classList.remove('open');
  renderSavings();
  if (g.actual >= g.meta) setTimeout(() => alert(`${g.name} — ${t('metaCompleta')}`), 100);
}

// ── RECURRENTES ────────────────────────────────────────────────────────────────
function renderRecurrentes() {
  const today_d = new Date().getDate();
  const total = recurrentes.reduce((s, r) => s + r.monto, 0);
  const el = document.getElementById('recur-list');
  if (!recurrentes.length) { el.innerHTML = `<div style="font-size:13px;color:var(--txt2)">${t('sinFijos')}</div>`; return; }
  el.innerHTML = `<div class="card" style="margin-bottom:.875rem">
    <div style="display:flex;justify-content:space-between;align-items:center">
      <div><div style="font-size:12px;color:var(--txt2)">${t('totalMensualFijos')}</div><div style="font-size:20px;font-weight:500;color:#993C1D">${fmt(total)}</div></div>
      <div style="font-size:12px;color:var(--txt2)">${recurrentes.length} ${t('servicios')}</div>
    </div>
  </div>` +
  recurrentes.map(r => {
    const diff = r.dia - today_d;
    let badge, bclass;
    if (diff < 0) { badge = t('cobrado'); bclass = 'b-ok'; }
    else if (diff === 0) { badge = t('hoy'); bclass = 'b-due'; }
    else if (diff <= 3) { badge = `${lang==='en'?'In':'En'} ${diff}d`; bclass = 'b-soon'; }
    else { badge = `${lang==='en'?'Day':'Día'} ${r.dia}`; bclass = 'b-ok'; }
    const lastH = (r.historial || []).slice(-1)[0];
    return `<div class="item-card" onclick="openDetail('recurrente',${r.id})">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:.5rem">
        <div style="width:36px;height:36px;border-radius:50%;background:${r.color||'#888'}22;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">${r.ico}</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:500">${r.name}</div>
          <div style="font-size:11px;color:var(--txt2)">${r.nota||''}</div>
          ${lastH ? `<div style="font-size:11px;color:var(--txt2)">${lang==='en'?'Last charge':'Último cobro'}: ${lastH.fecha}</div>` : ''}
        </div>
        <div style="text-align:right">
          <div style="font-size:15px;font-weight:500;color:#993C1D">${fmt(r.monto)}</div>
          <div style="font-size:11px;color:var(--txt2)">/ ${lang==='en'?'mo':'mes'}</div>
        </div>
        <span style="color:var(--txt2);font-size:14px;margin-left:4px">›</span>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.45rem .75rem;border-radius:var(--r);background:var(--bg2);font-size:12px">
        <span style="color:var(--txt2)">${t('proximoCobro')}</span>
        <span class="badge ${bclass}">${badge}</span>
      </div>
    </div>`;
  }).join('');
}

async function registrarPagoFijo(id) {
  const r = recurrentes.find(x => x.id === id); if (!r) return;
  try {
    const res = await POST(`/api/recurrentes/${id}/pagos`, { fecha: todayStr(), monto: r.monto });
    if (!r.historial) r.historial = [];
    r.historial.push({ fecha: todayStr(), monto: r.monto });
    // Agregar a txns en memoria para que aparezca en movimientos sin recargar
    txns.unshift({ id: res.movimiento_id, tipo: 'gasto', cat: 'recurrente', cat_label: r.name, cat_ico: r.ico, cat_color: r.color, descr: r.name, monto: r.monto, fecha: todayStr() });
    renderRecurrentes(); renderTxns(); calcTotals(); renderBars(); updateBarChart();
    alert(t('pagoRegistrado'));
  } catch(e) { console.error(e); }
}

async function deleteRecurrente(id) {
  if (!confirm(t('confirmarEliminarFijo'))) return;
  await DEL(`/api/recurrentes/${id}`);
  recurrentes = recurrentes.filter(r => r.id !== id); renderRecurrentes(); renderNotifs();
}

// ── NOTIFICACIONES ─────────────────────────────────────────────────────────────
function renderNotifs() {
  const { ing } = calcTotals(), today_d = new Date().getDate(), items = [];
  debts.filter(d => d.pagado < d.total).forEach(d => {
    const diff = d.vence - today_d, cuota = Math.round(d.total / d.cuotas);
    if (diff === 0) items.push({ cls: 'a', ico: d.ico, title: `${lang==='en'?'Due today!':'¡Vence hoy!'} — ${d.name}`, sub: `${lang==='en'?'Installment of':'Cuota de'} ${fmt(cuota)} ${lang==='en'?'due today.':'vence hoy.'}`, time: lang==='en'?'Today, 8:00 AM':'Hoy, 8:00 a.m.' });
    else if (diff > 0 && diff <= 3) items.push({ cls: 'w', ico: d.ico, title: `${lang==='en'?`Due in ${diff} days`:`Vence en ${diff} días`} — ${d.name}`, sub: `${lang==='en'?'Installment of':'Cuota de'} ${fmt(cuota)} ${lang==='en'?`due on day ${d.vence}`:`vence el día ${d.vence}`}. ${lang==='en'?'Available:':'Disponible:'} ${fmt(ing)}.`, time: lang==='en'?'Today, 10:00 AM':'Hoy, 10:00 a.m.' });
  });
  recurrentes.forEach(r => {
    const diff = r.dia - today_d;
    if (diff >= 0 && diff <= 2) items.push({ cls: 'w', ico: r.ico, title: `${diff===0?(lang==='en'?'Today':'¡Hoy'):(lang==='en'?`In ${diff}d`:`En ${diff}d`)} — ${r.name}`, sub: `${lang==='en'?'Auto charge of':'Cobro de'} ${fmt(r.monto)} ${lang==='en'?`on day ${r.dia}`:`el día ${r.dia}`}.`, time: diff === 0 ? (lang==='en'?'Today':'Hoy') : (lang==='en'?'Soon':'Próximamente') });
  });
  const lastH = debts.flatMap(d => (d.historial||[]).map(h => ({ ...h, d }))).sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0];
  if (lastH) items.push({ cls: 'ok', ico: '✅', title: `${lang==='en'?'Payment recorded':'Pago registrado'} — ${lastH.d.name}`, sub: `${lang==='en'?'You paid':'Abonaste'} ${fmt(lastH.monto)}.`, time: lang==='en'?'2 hours ago':'Hace 2 horas' });
  const el = document.getElementById('notif-list');
  if (!items.length) { el.innerHTML = `<div style="font-size:13px;color:var(--txt2)">${t('sinAlertas')}</div>`; return; }
  el.innerHTML = items.map(n =>
    `<div class="notif ${n.cls}"><div class="notif-ico">${n.ico}</div><div>
     <div style="font-size:12px;font-weight:500">${n.title}</div>
     <div style="font-size:11px;color:var(--txt2);margin-top:2px;line-height:1.4">${n.sub}</div>
     <div style="font-size:11px;color:var(--txt2);margin-top:2px">${n.time}</div>
    </div></div>`
  ).join('');
}

// ── PANTALLA DETALLE ───────────────────────────────────────────────────────────
function openDetail(type, id) {
  detailType = type; detailId = id;
  document.getElementById('detail-screen').classList.add('open');
  buildDetail(type, id);
}
function closeDetail() {
  document.getElementById('detail-screen').classList.remove('open');
  detailType = null; detailId = null;
  if (detailChartInst) { detailChartInst.destroy(); detailChartInst = null; }
}
function openDetailEdit() {
  if (detailType === 'deuda') editDebtModal(detailId);
  else if (detailType === 'ahorro') editSavModal(detailId);
  else if (detailType === 'inversion') editInvModal(detailId);
  else if (detailType === 'recurrente') editRecModal(detailId);
}
function buildDetail(type, id) {
  if (type === 'deuda') buildDebtDetail(id);
  else if (type === 'ahorro') buildSavDetail(id);
  else if (type === 'inversion') buildInvDetail(id);
  else if (type === 'recurrente') buildRecDetail(id);
}

function buildDebtDetail(id) {
  const d = debts.find(x => x.id === id); if (!d) return;
  document.getElementById('detail-title').textContent = `${d.ico} ${d.name}`;
  document.getElementById('detail-subtitle').textContent = t('detalleDeuda');
  const pct = Math.min(100, Math.round(d.pagado / d.total * 100));
  const hist = d.historial || [];
  const avg = hist.length ? Math.round(hist.reduce((s, h) => s + h.monto, 0) / hist.length) : 0;
  const extras = hist.filter(h => h.tipo === 'extra').length;
  const cBase = Math.round(d.total / d.cuotas);
  const restC = Math.max(0, d.cuotas - d.pagadas);
  const pc = pct >= 75 ? '#1D9E75' : pct >= 40 ? '#EF9F27' : '#D85A30';
  document.getElementById('detail-body').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
      <div style="width:52px;height:52px;border-radius:50%;background:${d.color||'#888'}22;display:flex;align-items:center;justify-content:center;font-size:24px">${d.ico}</div>
      <div><div style="font-size:17px;font-weight:500">${d.name}</div><div style="font-size:12px;color:var(--txt2)">${t('fechaInicio')}: ${d.fecha} · ${t('diaVencimiento')} ${d.vence}</div></div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--txt2);margin-bottom:4px"><span>${pct}% ${t('pagado').toLowerCase()}</span><span>${t('restante')} ${fmt(d.total-d.pagado)}</span></div>
      <div class="prog-track" style="height:12px"><div class="prog-fill" style="width:${pct}%;background:${pc}"></div></div>
    </div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-box-val">${fmt(d.total)}</div><div class="stat-box-lbl">${lang==='en'?'Total debt':'Total deuda'}</div></div>
      <div class="stat-box"><div class="stat-box-val pos">${fmt(d.pagado)}</div><div class="stat-box-lbl">${t('pagado')}</div></div>
      <div class="stat-box"><div class="stat-box-val neg">${fmt(d.total-d.pagado)}</div><div class="stat-box-lbl">${t('restante')}</div></div>
      <div class="stat-box"><div class="stat-box-val">${fmt(avg)}</div><div class="stat-box-lbl">${t('promedioPago')}</div></div>
    </div>
    <div class="card" style="margin-bottom:.875rem">
      <div class="card-title">${t('estadisticas')}</div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:13px">
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">${t('cuotasPagadas')}</span><span style="font-weight:500">${d.pagadas} de ${d.cuotas}</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">${lang==='en'?'Extra payments':'Abonos extra'}</span><span style="font-weight:500">${extras}</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">${lang==='en'?'Base installment':'Cuota base'}</span><span style="font-weight:500">${fmt(cBase)}</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">${lang==='en'?'Projected close':'Proyección cierre'}</span><span style="font-weight:500">${restC>0?`≈${restC} ${lang==='en'?'months':'meses'}`:lang==='en'?'Paid off!':'¡Pagada!'}</span></div>
      </div>
    </div>
    <div class="card" style="margin-bottom:.875rem"><div class="card-title">${t('evolucionPagos')}</div><div style="position:relative;height:140px"><canvas id="det-chart"></canvas></div></div>
    <div class="card">
      <div class="card-title">${t('historialPagos')}</div>
      ${hist.length ? hist.slice().reverse().map(h =>
        `<div class="tl-item"><div class="tl-dot ${h.tipo==='extra'?'e':'p'}"></div>
         <div class="tl-body"><div class="tl-name">${h.nota||lang==='en'?'Payment':'Pago realizado'}</div><div class="tl-date">${h.fecha}</div></div>
         <div class="tl-right"><div class="tag ${h.tipo==='extra'?'tag-e':'tag-p'}">${h.tipo==='extra'?lang==='en'?'Extra':'Extra':'Normal'}</div><div style="font-size:13px;font-weight:500">${fmt(h.monto)}</div></div></div>`
      ).join('') : `<div style="font-size:13px;color:var(--txt2)">${lang==='en'?'No payments yet.':'Sin pagos aún.'}</div>`}
    </div>
    <div class="abono-row" style="margin-top:.75rem;padding-top:0;border-top:none">
      <input class="abono-input" type="text" inputmode="numeric" placeholder="${t('pagoExtra')}" id="det-abono-inp" oninput="mi(this)">
      <button class="abono-btn" onclick="hacerAbonoDebt(${id})">${t('abonarBtn')}</button>
    </div>`;
  setTimeout(() => buildDetChart(hist.map(h => h.fecha), hist.map((_, i) => Math.round(hist.slice(0, i+1).reduce((s, x) => s+x.monto, 0))), '#378ADD'), 50);
}

function buildSavDetail(id) {
  const g = savings.find(x => x.id === id); if (!g) return;
  document.getElementById('detail-title').textContent = `${g.ico||''} ${g.name}`;
  document.getElementById('detail-subtitle').textContent = t('metaAhorroLabel');
  const pct = Math.min(100, Math.round(g.actual / g.meta * 100));
  const hist = g.historial || [];
  const avg = hist.length ? Math.round(hist.reduce((s, h) => s + h.monto, 0) / hist.length) : 0;
  const resta = g.meta - g.actual, ritmo = avg > 0 ? Math.ceil(resta / avg) : null;
  document.getElementById('detail-body').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
      <div style="width:52px;height:52px;border-radius:50%;background:#E6F1FB;display:flex;align-items:center;justify-content:center;font-size:24px">${g.ico||'🎯'}</div>
      <div><div style="font-size:17px;font-weight:500">${g.name}</div><div style="font-size:12px;color:var(--txt2)">${g.fecha?`${lang==='en'?'Target':'Objetivo'}: ${g.fecha}`:lang==='en'?'No target date':'Sin fecha objetivo'}</div></div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--txt2);margin-bottom:4px"><span>${pct}% ${lang==='en'?'completed':'completado'}</span><span>${lang==='en'?'Left':'Faltan'} ${fmt(resta)}</span></div>
      <div class="prog-track" style="height:12px"><div class="prog-fill" style="width:${pct}%;background:#185FA5"></div></div>
    </div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-box-val sav">${fmt(g.actual)}</div><div class="stat-box-lbl">${lang==='en'?'Saved':'Ahorrado'}</div></div>
      <div class="stat-box"><div class="stat-box-val">${fmt(g.meta)}</div><div class="stat-box-lbl">${lang==='en'?'Goal':'Meta'}</div></div>
      <div class="stat-box"><div class="stat-box-val">${fmt(avg)}</div><div class="stat-box-lbl">${t('promedioAbono')}</div></div>
      <div class="stat-box"><div class="stat-box-val">${ritmo?ritmo+' '+t('abonos'):'—'}</div><div class="stat-box-lbl">${t('paraCompletar')}</div></div>
    </div>
    <div class="card" style="margin-bottom:.875rem"><div class="card-title">${t('evolucionAhorro')}</div><div style="position:relative;height:140px"><canvas id="det-chart"></canvas></div></div>
    <div class="card">
      <div class="card-title">${t('historialAbonos')}</div>
      ${hist.length ? hist.slice().reverse().map(h =>
        `<div class="tl-item"><div class="tl-dot a"></div>
         <div class="tl-body"><div class="tl-name">${h.nota||lang==='en'?'Deposit':'Abono'}</div><div class="tl-date">${h.fecha}</div></div>
         <div class="tl-right"><div class="tag tag-a">${lang==='en'?'Deposit':'Abono'}</div><div style="font-size:13px;font-weight:500;color:#185FA5">+${fmt(h.monto)}</div></div></div>`
      ).join('') : `<div style="font-size:13px;color:var(--txt2)">${lang==='en'?'No deposits yet.':'Sin abonos aún.'}</div>`}
    </div>
    <div class="abono-row" style="margin-top:.75rem;padding-top:0;border-top:none">
      <input class="abono-input" type="text" inputmode="numeric" placeholder="${lang==='en'?'New deposit ($)':'Nuevo abono ($)'}" id="det-sav-inp" oninput="mi(this)">
      <input class="abono-input" type="text" placeholder="${t('nuevaNotaOpc')}" id="det-sav-nota" style="flex:1.2">
      <button class="abono-btn" onclick="hacerAbonoSav(${id})">${t('abonarBtn')}</button>
    </div>`;
  setTimeout(() => buildDetChart(hist.map(h => h.fecha), hist.map((_, i) => Math.round(hist.slice(0, i+1).reduce((s, x) => s+x.monto, 0))), '#185FA5'), 50);
}

function buildInvDetail(id) {
  const inv = inversiones.find(x => x.id === id); if (!inv) return;
  document.getElementById('detail-title').textContent = inv.name;
  document.getElementById('detail-subtitle').textContent = inv.sin_plazo ? t('cuentaARLabel') : t('cdtLabel');
  const tasaM = inv.periodo === 'anual' ? Math.pow(1 + inv.tasa/100, 1/12) - 1 : inv.tasa/100;
  const mesesCalc = inv.sin_plazo ? 12 : (inv.meses || 12);
  const total = inv.capital * Math.pow(1 + tasaM, mesesCalc);
  const ganancia = total - inv.capital, diaria = ganancia / 365;
  const hist = inv.historial || [];
  const labels = Array.from({ length: Math.min(mesesCalc, 12) }, (_, i) => `M${i+1}`);
  const vals = labels.map((_, i) => Math.round(inv.capital * Math.pow(1 + tasaM, i+1)));
  document.getElementById('detail-body').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
      <div style="width:52px;height:52px;border-radius:50%;background:#E6F1FB;display:flex;align-items:center;justify-content:center;font-size:24px">${inv.sin_plazo?'🏦':'📈'}</div>
      <div><div style="font-size:17px;font-weight:500">${inv.name}</div><div style="font-size:12px;color:#185FA5">${inv.entidad||''} · ${inv.tasa}% ${inv.periodo==='anual'?t('anual_label'):t('mensual_label')}${inv.sin_plazo?` · ${t('sinPlazoLabel')}`:`· ${mesesCalc} ${lang==='en'?'months':'meses'}`}</div></div>
    </div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-box-val">${fmt(inv.capital)}</div><div class="stat-box-lbl">${t('capital')}</div></div>
      <div class="stat-box"><div class="stat-box-val" style="color:#0F6E56">+${fmt(ganancia)}</div><div class="stat-box-lbl">${t('ganancia')} ${inv.sin_plazo?'(12m)':''}</div></div>
      <div class="stat-box"><div class="stat-box-val">${fmt(total)}</div><div class="stat-box-lbl">${t('totalFinal')}</div></div>
      <div class="stat-box"><div class="stat-box-val" style="color:#0F6E56">+${fmt(diaria)}</div><div class="stat-box-lbl">${t('porDia')}</div></div>
    </div>
    <div class="card" style="margin-bottom:.875rem"><div class="card-title">${t('proyeccionMensual')}</div><div style="position:relative;height:150px"><canvas id="det-chart"></canvas></div></div>
    <div class="card" style="margin-bottom:.875rem">
      <div class="card-title">${t('estadisticas')}</div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:13px">
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">${lang==='en'?'Duration':'Duración'}</span><span style="font-weight:500">${inv.sin_plazo?t('sinPlazoLabel'):mesesCalc+' '+(lang==='en'?'months':'meses')}</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">${lang==='en'?'Start':'Inicio'}</span><span style="font-weight:500">${inv.fecha}</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">${t('gananciaMensual')}</span><span style="font-weight:500;color:#0F6E56">+${fmt(ganancia/mesesCalc)}</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">${t('rendimientoTotal')}</span><span style="font-weight:500;color:#0F6E56">${((ganancia/inv.capital)*100).toFixed(2)}%</span></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">${t('historialMov')}</div>
      ${hist.length ? hist.slice().reverse().map(h =>
        `<div class="tl-item"><div class="tl-dot a"></div>
         <div class="tl-body"><div class="tl-name">${h.nota||lang==='en'?'Movement':'Movimiento'}</div><div class="tl-date">${h.fecha}</div></div>
         <div class="tl-right"><div style="font-size:13px;font-weight:500;color:#185FA5">${fmt(h.monto)}</div></div></div>`
      ).join('') : `<div style="font-size:13px;color:var(--txt2)">${lang==='en'?'No movements.':'Sin movimientos.'}</div>`}
    </div>`;
  setTimeout(() => buildDetChart(labels, vals, '#185FA5'), 50);
}

function buildRecDetail(id) {
  const r = recurrentes.find(x => x.id === id); if (!r) return;
  document.getElementById('detail-title').textContent = `${r.ico} ${r.name}`;
  document.getElementById('detail-subtitle').textContent = t('gastoFijoLabel');
  const hist = r.historial || [];
  const totalPag = hist.reduce((s, h) => s + h.monto, 0);
  document.getElementById('detail-body').innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
      <div style="width:52px;height:52px;border-radius:50%;background:${r.color||'#888'}22;display:flex;align-items:center;justify-content:center;font-size:24px">${r.ico}</div>
      <div><div style="font-size:17px;font-weight:500">${r.name}</div><div style="font-size:12px;color:var(--txt2)">${r.nota||''} · ${lang==='en'?'Day':'Día'} ${r.dia} ${lang==='en'?'each month':'de cada mes'}</div></div>
    </div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-box-val neg">${fmt(r.monto)}</div><div class="stat-box-lbl">${lang==='en'?'Monthly':'Mensual'}</div></div>
      <div class="stat-box"><div class="stat-box-val neg">${fmt(r.monto*12)}</div><div class="stat-box-lbl">${lang==='en'?'Annual':'Anual'}</div></div>
      <div class="stat-box"><div class="stat-box-val">${hist.length}</div><div class="stat-box-lbl">${t('pagosRegistrados')}</div></div>
      <div class="stat-box"><div class="stat-box-val neg">${fmt(totalPag)}</div><div class="stat-box-lbl">${t('totalPagado')}</div></div>
    </div>
    <div style="margin-bottom:.875rem">
      <button class="abono-btn" style="width:100%;padding:10px;font-size:13px;border-radius:var(--r)" onclick="registrarPagoFijo(${id})">✓ ${t('registrarPago')} — ${fmt(r.monto)}</button>
    </div>
    <div class="card" style="margin-bottom:.875rem"><div class="card-title">${t('historialCobros')}</div><div style="position:relative;height:130px"><canvas id="det-chart"></canvas></div></div>
    <div class="card">
      <div class="card-title">${lang==='en'?'All charges':'Todos los cobros'}</div>
      ${hist.length ? hist.slice().reverse().map(h =>
        `<div class="tl-item"><div class="tl-dot p"></div>
         <div class="tl-body"><div class="tl-name">${lang==='en'?'Auto charge':'Cobro automático'}</div><div class="tl-date">${h.fecha}</div></div>
         <div class="tl-right"><div style="font-size:13px;font-weight:500;color:#993C1D">-${fmt(h.monto)}</div></div></div>`
      ).join('') : `<div style="font-size:13px;color:var(--txt2)">${lang==='en'?'No charges yet.':'Sin cobros aún.'}</div>`}
    </div>
    <div style="margin-top:.75rem;display:flex;gap:8px">
      <button class="icon-btn" style="width:auto;padding:6px 12px;font-size:12px" onclick="editRecModal(${id})">${t('editarBtn')}</button>
      <button class="icon-btn del" style="width:auto;padding:6px 12px;font-size:12px" onclick="deleteRecurrente(${id}).then(closeDetail)">${t('eliminarBtn')}</button>
    </div>`;
  setTimeout(() => buildDetChart(hist.map(h => h.fecha), hist.map(h => h.monto), r.color||'#D85A30', true), 50);
}

function buildDetChart(labels, data, color, bar = false) {
  const canvas = document.getElementById('det-chart'); if (!canvas) return;
  const isDark = matchMedia('(prefers-color-scheme:dark)').matches;
  const grid = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)', txt = isDark ? '#aaa' : '#666';
  if (detailChartInst) detailChartInst.destroy();
  detailChartInst = new Chart(canvas, {
    type: bar ? 'bar' : 'line',
    data: { labels, datasets: [{ data, borderColor: color, backgroundColor: bar ? color : color+'33', fill: !bar, tension: .4, pointRadius: 3, borderWidth: 2, pointBackgroundColor: color }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => fmt(c.raw) } } },
      scales: { x: { ticks: { color: txt, font: { size: 10 }, maxTicksLimit: 6 }, grid: { color: grid } }, y: { ticks: { color: txt, font: { size: 10 }, callback: v => fmt(v) }, grid: { color: grid } } } }
  });
}

async function hacerAbonoDebt(id) {
  const d = debts.find(x => x.id === id); if (!d) return;
  const val = pM(document.getElementById('det-abono-inp').value); if (!val || val <= 0) return;
  const isX = val > d.total / d.cuotas * 1.05;
  await POST(`/api/deudas/${id}/pagos`, { fecha: todayStr(), monto: val, tipo: isX ? 'extra' : 'normal', nota: isX ? (lang==='en'?'Extra payment':'Abono extra') : (lang==='en'?'Installment':'Cuota') });
  d.pagado = Math.min(d.total, d.pagado + val);
  d.pagadas = Math.min(d.cuotas, Math.floor(d.pagado / (d.total / d.cuotas)));
  const pct = Math.min(100, Math.round(d.pagado / d.total * 100));
  if (!d.historial) d.historial = [];
  d.historial.push({ fecha: todayStr(), monto: val, tipo: isX ? 'extra' : 'normal', nota: '', pctAfter: pct });
  if (d.pagado >= d.total) setTimeout(() => alert(`"${d.name}" ${t('pagada100')}`), 100);
  renderDebts(); calcTotals(); renderHistorial(); renderNotifs(); buildDebtDetail(id);
}

async function hacerAbonoSav(id) {
  const g = savings.find(x => x.id === id); if (!g) return;
  const monto = pM(document.getElementById('det-sav-inp').value); if (!monto || monto <= 0) return;
  const nota = document.getElementById('det-sav-nota').value.trim();
  await POST(`/api/ahorros/${id}/abonos`, { fecha: todayStr(), monto, nota });
  g.actual = Math.min(g.meta, g.actual + monto);
  if (!g.historial) g.historial = [];
  g.historial.push({ fecha: todayStr(), monto, nota });
  if (g.actual >= g.meta) setTimeout(() => alert(`${g.name} — ${t('metaCompleta')}`), 100);
  renderSavings(); buildSavDetail(id);
}

// ── EDICIÓN DESDE DETALLE ──────────────────────────────────────────────────────
function editDebtModal(id) {
  const d = debts.find(x => x.id === id); if (!d) return;
  document.getElementById('modal-det-edit-body').innerHTML = `
    <div class="modal-title">${t('editarBtn').replace('✏️ ','')} ${t('detalleDeuda')} <button class="close-btn" onclick="document.getElementById('modal-det-edit').classList.remove('open')">×</button></div>
    <div class="form-row"><label>${t('nombre')}</label><input type="text" id="ed-name" value="${d.name}"></div>
    <div class="form-grid">
      <div class="form-row"><label>${t('montoTotal')}</label><input type="text" id="ed-total" value="${d.total.toLocaleString('es-CO')}" inputmode="numeric"></div>
      <div class="form-row"><label>${t('cuotasTotales')}</label><input type="number" id="ed-cuotas" value="${d.cuotas}" min="1"></div>
    </div>
    <div class="form-grid">
      <div class="form-row"><label>${t('cuotasPagadas')}</label><input type="number" id="ed-pagadas" value="${d.pagadas}" min="0"></div>
      <div class="form-row"><label>${t('diaVencimiento')}</label><input type="number" id="ed-vence" value="${d.vence}" min="1" max="31"></div>
    </div>
    <button class="btn-save" onclick="saveDebtEdit(${id})">${t('guardarCambios')}</button>`;
  document.getElementById('modal-det-edit').classList.add('open');
}
async function saveDebtEdit(id) {
  const d = debts.find(x => x.id === id); if (!d) return;
  d.name = document.getElementById('ed-name').value.trim() || d.name;
  d.total = pM(document.getElementById('ed-total').value) || d.total;
  d.cuotas = parseInt(document.getElementById('ed-cuotas').value) || d.cuotas;
  d.pagadas = parseInt(document.getElementById('ed-pagadas').value) || 0;
  d.vence = parseInt(document.getElementById('ed-vence').value) || d.vence;
  await PUT(`/api/deudas/${id}`, d);
  document.getElementById('modal-det-edit').classList.remove('open');
  renderDebts(); calcTotals(); buildDebtDetail(id);
}

function editSavModal(id) {
  const g = savings.find(x => x.id === id); if (!g) return;
  document.getElementById('modal-det-edit-body').innerHTML = `
    <div class="modal-title">${t('editarBtn').replace('✏️ ','')} ${t('metaAhorroLabel')} <button class="close-btn" onclick="document.getElementById('modal-det-edit').classList.remove('open')">×</button></div>
    <div class="form-row"><label>${t('nombre')}</label><input type="text" id="es-name" value="${g.name}"></div>
    <div class="form-grid">
      <div class="form-row"><label>${t('metaTotal')}</label><input type="text" id="es-meta" value="${g.meta.toLocaleString('es-CO')}" inputmode="numeric"></div>
      <div class="form-row"><label>${t('yaAhorrado')}</label><input type="text" id="es-actual" value="${g.actual.toLocaleString('es-CO')}" inputmode="numeric"></div>
    </div>
    <div class="form-row"><label>${t('fechaObjetivo')}</label><input type="date" id="es-fecha" value="${g.fecha||''}"></div>
    <button class="btn-save" onclick="saveSavEdit(${id})">${t('guardarCambios')}</button>`;
  document.getElementById('modal-det-edit').classList.add('open');
}
async function saveSavEdit(id) {
  const g = savings.find(x => x.id === id); if (!g) return;
  g.name = document.getElementById('es-name').value.trim() || g.name;
  g.meta = pM(document.getElementById('es-meta').value) || g.meta;
  g.actual = pM(document.getElementById('es-actual').value);
  g.fecha = document.getElementById('es-fecha').value;
  await PUT(`/api/ahorros/${id}`, g);
  document.getElementById('modal-det-edit').classList.remove('open');
  renderSavings(); buildSavDetail(id);
}

function editInvModal(id) {
  const inv = inversiones.find(x => x.id === id); if (!inv) return;
  document.getElementById('modal-det-edit-body').innerHTML = `
    <div class="modal-title">${t('editarBtn').replace('✏️ ','')} ${t('cdtLabel')} <button class="close-btn" onclick="document.getElementById('modal-det-edit').classList.remove('open')">×</button></div>
    <div class="form-row"><label>${t('nombre')}</label><input type="text" id="ei-name" value="${inv.name}"></div>
    <div class="form-grid">
      <div class="form-row"><label>${t('capital')}</label><input type="text" id="ei-capital" value="${inv.capital.toLocaleString('es-CO')}" inputmode="numeric"></div>
      <div class="form-row"><label>${t('tasa')}</label><input type="text" id="ei-tasa" value="${inv.tasa}" inputmode="decimal"></div>
    </div>
    <div class="form-grid">
      <div class="form-row"><label>${t('periodo')}</label><select id="ei-periodo"><option value="anual" ${inv.periodo==='anual'?'selected':''}>Anual</option><option value="mensual" ${inv.periodo==='mensual'?'selected':''}>Mensual</option></select></div>
      <div class="form-row"><label>${t('duracion')}</label><input type="number" id="ei-meses" value="${inv.meses||''}" min="1" ${inv.sin_plazo?'disabled':''}></div>
    </div>
    <div class="form-row"><label>${t('entidad')}</label><input type="text" id="ei-entidad" value="${inv.entidad||''}"></div>
    <button class="btn-save" onclick="saveInvEdit(${id})">${t('guardarCambios')}</button>`;
  document.getElementById('modal-det-edit').classList.add('open');
}
async function saveInvEdit(id) {
  const inv = inversiones.find(x => x.id === id); if (!inv) return;
  inv.name = document.getElementById('ei-name').value.trim() || inv.name;
  inv.capital = pM(document.getElementById('ei-capital').value) || inv.capital;
  inv.tasa = parseFloat(document.getElementById('ei-tasa').value) || inv.tasa;
  inv.periodo = document.getElementById('ei-periodo').value;
  inv.meses = parseInt(document.getElementById('ei-meses').value) || inv.meses;
  inv.entidad = document.getElementById('ei-entidad').value.trim();
  await PUT(`/api/inversiones/${id}`, inv);
  document.getElementById('modal-det-edit').classList.remove('open');
  renderSavings(); buildInvDetail(id);
}

function editRecModal(id) {
  const r = recurrentes.find(x => x.id === id); if (!r) return;
  document.getElementById('modal-det-edit-body').innerHTML = `
    <div class="modal-title">${t('editarBtn').replace('✏️ ','')} ${t('gastoFijoLabel')} <button class="close-btn" onclick="document.getElementById('modal-det-edit').classList.remove('open')">×</button></div>
    <div class="form-row"><label>${t('nombre')}</label><input type="text" id="er-name" value="${r.name}"></div>
    <div class="form-grid">
      <div class="form-row"><label>${t('montoMensual')}</label><input type="text" id="er-monto" value="${r.monto.toLocaleString('es-CO')}" inputmode="numeric"></div>
      <div class="form-row"><label>${t('diaCobro')}</label><input type="number" id="er-dia" value="${r.dia}" min="1" max="31"></div>
    </div>
    <div class="form-row"><label>${t('notas')}</label><input type="text" id="er-nota" value="${r.nota||''}"></div>
    <button class="btn-save" onclick="saveRecEdit(${id})">${t('guardarCambios')}</button>`;
  document.getElementById('modal-det-edit').classList.add('open');
}
async function saveRecEdit(id) {
  const r = recurrentes.find(x => x.id === id); if (!r) return;
  r.name = document.getElementById('er-name').value.trim() || r.name;
  r.monto = pM(document.getElementById('er-monto').value) || r.monto;
  r.dia = parseInt(document.getElementById('er-dia').value) || r.dia;
  r.nota = document.getElementById('er-nota').value.trim();
  await PUT(`/api/recurrentes/${id}`, r);
  document.getElementById('modal-det-edit').classList.remove('open');
  renderRecurrentes(); buildRecDetail(id);
}

// ── FORMULARIO AGREGAR ─────────────────────────────────────────────────────────
function setSavType(type) {
  savType = type;
  document.getElementById('sav-btn-meta').className = 'sav-type-btn' + (type === 'meta' ? ' sel-meta' : '');
  document.getElementById('sav-btn-inv-cdt').className = 'sav-type-btn' + (type === 'cdt' ? ' sel-inv' : '');
  document.getElementById('sav-btn-inv-ar').className = 'sav-type-btn' + (type === 'ar' ? ' sel-inv' : '');
  document.getElementById('sav-fields-meta').classList.toggle('hidden', type !== 'meta');
  document.getElementById('sav-fields-inv').classList.toggle('hidden', type === 'meta');
  // Si es cuenta de alto rendimiento, ocultar campo meses
  const mesesRow = document.getElementById('inv-meses-row');
  if (mesesRow) mesesRow.style.display = type === 'ar' ? 'none' : '';
}

function updateInvPreview() {
  const capital = pM(document.getElementById('inv-capital').value);
  const tasa = parseFloat(document.getElementById('inv-tasa').value) || 0;
  const periodo = document.getElementById('inv-periodo').value;
  const mesesEl = document.getElementById('inv-meses');
  const meses = savType === 'ar' ? 12 : (parseInt(mesesEl?.value) || 0);
  const el = document.getElementById('inv-preview');
  if (!capital || !tasa) { el.textContent = lang==='en'?'Fill in the fields to see projection.':'Completa los campos para ver la proyección.'; return; }
  const tasaM = periodo === 'anual' ? Math.pow(1 + tasa/100, 1/12) - 1 : tasa/100;
  const ganancia = capital * (Math.pow(1 + tasaM, meses || 12) - 1);
  const prefijo = savType === 'ar' ? `${lang==='en'?'Annual projection':'Proyección anual'}: ` : '';
  el.innerHTML = `${prefijo}${t('capital')}: ${fmt(capital)} · ${t('ganancia')}: <span style="color:#0F6E56;font-weight:500">+${fmt(ganancia)}</span> · Total: <span style="font-weight:500">${fmt(capital+ganancia)}</span> · ${lang==='en'?'Daily':'+Diario'}: <span style="color:#0F6E56">+${fmt(ganancia/365)}</span>`;
}

function buildCatGrid() {
  const tipo = currentTipo === 'deuda' || currentTipo === 'recurrente' || currentTipo === 'ahorro' ? 'gasto' : currentTipo;
  const cats = CATS[tipo] || CATS.gasto;
  document.getElementById('cat-grid').innerHTML = cats.map(c =>
    `<button class="cat-btn${selectedCat===c.key?' sel':''}" onclick="selectCat('${c.key}')">
      <span style="font-size:18px">${c.ico}</span>
      <span>${lang==='en'?c.laben:c.label}</span>
    </button>`
  ).join('');
  document.getElementById('custom-row').style.display = selectedCat === 'personalizado' ? 'block' : 'none';
}
function selectCat(k) { selectedCat = k; buildCatGrid(); }

function setTipo(tipo) {
  currentTipo = tipo;
  const map = { ingreso: 'ing', gasto: 'exp', deuda: 'deu', ahorro: 'sav', recurrente: 'rec' };
  Object.entries(map).forEach(([t_, k]) => {
    const b = document.getElementById('btn-' + k);
    if (b) b.className = 'tipo-btn' + (tipo === t_ ? ` t-${k}` : '');
  });
  // Altura uniforme del modal — siempre mostramos el mismo contenedor
  ['fields-txn','fields-deu','fields-sav','fields-rec'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
  const show = { ingreso:'fields-txn', gasto:'fields-txn', deuda:'fields-deu', ahorro:'fields-sav', recurrente:'fields-rec' };
  const toShow = document.getElementById(show[tipo]);
  if (toShow) toShow.style.display = 'block';
  if (tipo !== 'deuda' && tipo !== 'recurrente' && tipo !== 'ahorro') {
    selectedCat = tipo === 'ingreso' ? 'salario' : 'alimentacion';
    buildCatGrid();
  }
  if (tipo === 'ahorro') setSavType('meta');
}

// Modal de altura fija uniforme
function setModalMinHeight() {
  const sheet = document.querySelector('#modal .modal-sheet');
  if (sheet) sheet.style.minHeight = '70dvh';
}

function openModal(force) {
  document.getElementById('modal').classList.add('open');
  setModalMinHeight();
  const td = todayStr();
  ['fecha-inp','deu-fecha','inv-fecha'].forEach(id => { const e = document.getElementById(id); if (e) e.value = td; });
  ['desc-inp','monto-inp','deu-name','deu-total','deu-cuotas','deu-pagadas','deu-pagado',
   'sav-name','sav-meta','sav-actual','inv-name','inv-entidad','inv-capital','inv-tasa',
   'inv-meses','rec-name','rec-monto','rec-dia','rec-nota','custom-cat'].forEach(id => {
    const e = document.getElementById(id); if (e) e.value = '';
  });
  document.getElementById('deu-vence').value = '1';
  const prev = document.getElementById('inv-preview');
  if (prev) prev.textContent = lang==='en'?'Fill in the fields to see projection.':'Completa los campos para ver la proyección.';
  setTipo(force || 'ingreso');
}
function closeModal() { document.getElementById('modal').classList.remove('open'); }

async function guardar() {
  if (currentTipo === 'ahorro') {
    if (savType === 'meta') {
      const name = document.getElementById('sav-name').value.trim();
      const meta = pM(document.getElementById('sav-meta').value);
      const actual = pM(document.getElementById('sav-actual').value);
      const fecha = document.getElementById('sav-fecha').value;
      const ico = document.getElementById('sav-ico').value;
      if (!name || !meta) return;
      const created = await POST('/api/ahorros', { type: 'meta', name, ico, meta, actual, fecha });
      const hist = actual > 0 ? [{ fecha: todayStr(), monto: actual, nota: lang==='en'?'Initial balance':'Saldo inicial' }] : [];
      savings.push({ ...created, historial: hist });
      closeModal(); renderSavings();
    } else {
      // CDT o cuenta alto rendimiento
      const name = document.getElementById('inv-name').value.trim();
      const capital = pM(document.getElementById('inv-capital').value);
      const tasa = parseFloat(document.getElementById('inv-tasa').value) || 0;
      const periodo = document.getElementById('inv-periodo').value;
      const fecha = document.getElementById('inv-fecha').value;
      const entidad = document.getElementById('inv-entidad').value.trim();
      const sinPlazo = savType === 'ar';
      const mesesEl = document.getElementById('inv-meses');
      const meses = sinPlazo ? 0 : (parseInt(mesesEl?.value) || 12);
      if (!name || !capital || !tasa) return;
      const created = await POST('/api/inversiones', { name, entidad, capital, tasa, periodo, fecha, meses, sin_plazo: sinPlazo });
      inversiones.push({ ...created, historial: [{ fecha, monto: capital, nota: lang==='en'?'Opening':'Apertura' }] });
      closeModal(); renderSavings();
    }
  } else if (currentTipo === 'recurrente') {
    const name = document.getElementById('rec-name').value.trim();
    const monto = pM(document.getElementById('rec-monto').value);
    const dia = parseInt(document.getElementById('rec-dia').value) || 1;
    const nota = document.getElementById('rec-nota').value.trim();
    const ico = document.getElementById('rec-ico').value;
    if (!name || !monto) return;
    const colors = ['#1D9E75','#D85A30','#378ADD','#7F77DD','#EF9F27','#D4537E'];
    const color = colors[recurrentes.length % colors.length];
    const created = await POST('/api/recurrentes', { name, ico, color, monto, dia, nota });
    recurrentes.push({ ...created, historial: [] });
    closeModal(); renderRecurrentes(); renderNotifs();
  } else if (currentTipo === 'deuda') {
    const name = document.getElementById('deu-name').value.trim();
    const total = pM(document.getElementById('deu-total').value);
    const cuotas = parseInt(document.getElementById('deu-cuotas').value) || 1;
    const pagadas = parseInt(document.getElementById('deu-pagadas').value) || 0;
    const pagado = pM(document.getElementById('deu-pagado').value);
    const fecha = document.getElementById('deu-fecha').value;
    const vence = parseInt(document.getElementById('deu-vence').value) || 1;
    const ico = document.getElementById('deu-ico').value;
    if (!name || !total) return;
    const colors = ['#378ADD','#7F77DD','#1D9E75','#D4537E','#EF9F27','#D85A30'];
    const color = colors[debts.length % colors.length];
    const created = await POST('/api/deudas', { name, ico, color, total, cuotas, pagadas, pagado, fecha, vence });
    const hist = pagado > 0 ? [{ fecha, monto: pagado, tipo: 'normal', nota: lang==='en'?'Initial balance':'Saldo inicial' }] : [];
    debts.push({ ...created, historial: hist });
    closeModal(); renderDebts(); calcTotals(); renderNotifs();
  } else {
    // INGRESO o GASTO — incluyendo personalizado
    const descr = document.getElementById('desc-inp').value.trim();
    const monto = pM(document.getElementById('monto-inp').value);
    const fecha = document.getElementById('fecha-inp').value;
    if (!descr || !monto) return;
    const cats = CATS[currentTipo] || CATS.ingreso;
    let info = cats.find(c => c.key === selectedCat) || cats[0];
    let catLabel = lang === 'en' ? info.laben : info.label;
    let catKey = info.key;
    // ── FIX: categoría personalizada ──
    if (selectedCat === 'personalizado') {
      const customVal = document.getElementById('custom-cat').value.trim();
      if (!customVal) {
        document.getElementById('custom-cat').focus();
        return;
      }
      catLabel = customVal;
      catKey = 'custom_' + customVal.toLowerCase().replace(/\s+/g, '_');
    }
    const created = await POST('/api/movimientos', {
      tipo: currentTipo, cat: catKey, cat_label: catLabel,
      cat_ico: info.ico, cat_color: info.color, descr, monto, fecha
    });
    txns.push(created);
    closeModal(); renderTxns(); calcTotals(); renderBars(); updateBarChart();
  }
}

// ── NAVEGACIÓN ─────────────────────────────────────────────────────────────────
function showTab(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
  document.getElementById('scroll-body').scrollTop = 0;
}
function setPeriod(p, btn) {
  document.querySelectorAll('#tab-notificaciones .chip').forEach(c => c.classList.remove('sel'));
  btn.classList.add('sel');
}

// ── CONSEJOS ───────────────────────────────────────────────────────────────────
function openTips() {
  const { ing, gas, deu } = calcTotals();
  const recurTotal = recurrentes.reduce((s, r) => s + r.monto, 0);
  const ratio = gas / (ing || 1), tips = [];
  if (ratio > 0.7) tips.push({ cls: 'w', title: lang==='en'?'⚠️ High expenses':'⚠️ Gastos elevados', text: lang==='en'?`You're using ${Math.round(ratio*100)}% of your income on expenses. Aim for under 70%.`:`Usas el ${Math.round(ratio*100)}% de tus ingresos en gastos. Lo ideal es no superar el 70%.` });
  else tips.push({ cls: 's', title: lang==='en'?'✅ Good control':'✅ Buen control', text: lang==='en'?`You're only using ${Math.round(ratio*100)}% of your income. Great job!`:`Solo usas el ${Math.round(ratio*100)}% de tus ingresos. ¡Muy bien!` });
  if (deu > 0) tips.push({ cls: 'w', title: lang==='en'?'💳 Active debts':'💳 Deudas activas', text: lang==='en'?`You have ${fmt(deu)} pending. Extra payments reduce time and interest.`:`Tienes ${fmt(deu)} pendientes. Los abonos extra reducen tiempo e intereses.` });
  if (recurTotal > ing * 0.2) tips.push({ cls: 'i', title: lang==='en'?'🔁 High fixed expenses':'🔁 Gastos fijos altos', text: lang==='en'?`Your fixed expenses total ${fmt(recurTotal)} (${Math.round(recurTotal/(ing||1)*100)}% of income). Review if all are necessary.`:`Tus fijos suman ${fmt(recurTotal)} (${Math.round(recurTotal/(ing||1)*100)}%). Revisa si todos son necesarios.` });
  tips.push({ cls: 'n', title: '💡 50/30/20', text: lang==='en'?'50% needs, 30% wants, 20% savings & investment.':'50% necesidades, 30% deseos, 20% ahorro e inversión.' });
  document.getElementById('tips-list').innerHTML = tips.map(tp =>
    `<div class="tip-card ${tp.cls}"><div style="font-weight:500;margin-bottom:2px">${tp.title}</div>${tp.text}</div>`
  ).join('');
  document.getElementById('modal-tips').classList.add('open');
}
function closeTips() { document.getElementById('modal-tips').classList.remove('open'); }

// ── CONFIGURACIÓN ──────────────────────────────────────────────────────────────
function openSettings() { buildTabChips(); buildEmojiPicker(); document.getElementById('modal-settings').classList.add('open'); }
function closeSettings() { document.getElementById('modal-settings').classList.remove('open'); }

function toggleDark() {
  darkMode = !darkMode;
  document.getElementById('toggle-dark').classList.toggle('on', darkMode);
  // Modo oscuro real sin invert — cambia clase en body
  document.body.classList.toggle('force-dark', darkMode);
  document.body.classList.toggle('force-light', !darkMode);
}

function setLang(l) {
  lang = l;
  applyLang();
}

function setCurrency(c) {
  currency = c;
  calcTotals(); renderBars(); renderTxns(); renderDebts();
  renderSavings(); renderHistorial(); renderNotifs(); renderRecurrentes();
  updateBarChart();
}

function buildTabChips() {
  document.getElementById('tab-chips').innerHTML = TAB_IDS.map(id =>
    `<button class="chip${editingTab===id?' sel':''}" id="tc-${id}" onclick="selectTabEdit('${id}',this)">${tabIcons[id]} ${TAB_NAMES?.[id]||id}</button>`
  ).join('');
}
function selectTabEdit(id, btn) {
  editingTab = id;
  document.querySelectorAll('#tab-chips .chip').forEach(c => c.classList.remove('sel'));
  btn.classList.add('sel');
  document.getElementById('editing-tab-name').textContent = TAB_NAMES?.[id] || id;
  buildEmojiPicker();
}
function buildEmojiPicker() {
  document.getElementById('emoji-picker').innerHTML = EMOJIS.map(e =>
    `<div class="ico-opt${tabIcons[editingTab]===e?' sel':''}" onclick="setTabIcon('${e}')">${e}</div>`
  ).join('');
}
function setTabIcon(e) {
  tabIcons[editingTab] = e;
  const el = document.getElementById('tabi-' + editingTab);
  if (el) el.textContent = e;
  buildEmojiPicker(); buildTabChips();
}
function handleImgUpload(ev) {
  const file = ev.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas'); c.width = 32; c.height = 32;
      const ctx = c.getContext('2d'); const s = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width-s)/2, (img.height-s)/2, s, s, 0, 0, 32, 32);
      const url = c.toDataURL();
      const el = document.getElementById('tabi-' + editingTab);
      if (el) { el.innerHTML = ''; const im = document.createElement('img'); im.src = url; im.style.cssText = 'width:18px;height:18px;border-radius:3px;object-fit:cover'; el.appendChild(im); }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file); ev.target.value = '';
}

// ── GRÁFICA PRINCIPAL ──────────────────────────────────────────────────────────
function buildBarChart() {
  const isDark = matchMedia('(prefers-color-scheme:dark)').matches || darkMode;
  const grid = isDark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)', txt = isDark ? '#aaa' : '#666';
  const { ing, gas } = calcTotals();
  if (barInst) barInst.destroy();
  barInst = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: { labels: ['Ene','Feb','Mar','Abr','May'], datasets: [
      { label: t('ingresos'), data: [3800000,4100000,3900000,4000000,ing], backgroundColor: '#1D9E75' },
      { label: t('gastos'),   data: [3100000,3400000,2900000,3200000,gas], backgroundColor: '#D85A30' }
    ]},
    options: { responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => fmt(c.raw) } } },
      scales: { x: { ticks: { color: txt, font: { size: 10 } }, grid: { color: grid } }, y: { ticks: { color: txt, font: { size: 10 }, callback: v => '$'+(v/1000000).toFixed(1)+'M' }, grid: { color: grid } } } }
  });
}
function updateBarChart() {
  if (!barInst) return;
  const { ing, gas } = calcTotals();
  barInst.data.datasets[0].data[4] = ing;
  barInst.data.datasets[1].data[4] = gas;
  barInst.update();
}

// ── INPUTS NUMÉRICOS ───────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  ['monto-inp','deu-total','deu-pagado','sav-meta','sav-actual','inv-capital',
   'rec-monto','edit-monto','sav-abono-monto'].forEach(id => {
    const el = document.getElementById(id); if (el) el.addEventListener('input', () => mi(el));
  });
  ['inv-capital','inv-tasa','inv-periodo','inv-meses'].forEach(id => {
    const el = document.getElementById(id); if (el) el.addEventListener('input', updateInvPreview);
  });
  // Cerrar modales al click en overlay
  ['modal','modal-edit','modal-det-edit','modal-sav-abono','modal-tips','modal-settings'].forEach(id => {
    const el = document.getElementById(id);
    el?.querySelector('.modal-overlay')?.addEventListener('click', () => el.classList.remove('open'));
  });
});

// ── INIT ───────────────────────────────────────────────────────────────────────
setTopbarDate();
loadAll();