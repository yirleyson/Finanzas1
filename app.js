// ── CONFIG ─────────────────────────────────────────────────────────────────────
const CATS={
  ingreso:[{key:'salario',label:'Salario',ico:'💼',color:'#378ADD'},{key:'arriendo_i',label:'Arriendo',ico:'🏠',color:'#1D9E75'},{key:'honorarios',label:'Honorarios',ico:'📋',color:'#7F77DD'},{key:'ventas',label:'Ventas',ico:'🛍️',color:'#EF9F27'},{key:'transferencia',label:'Transferencia',ico:'🔄',color:'#5DCAA5'},{key:'personalizado',label:'Personalizada',ico:'✏️',color:'#888780'}],
  gasto:[{key:'alimentacion',label:'Alimentación',ico:'🛒',color:'#D85A30'},{key:'arriendo_g',label:'Arriendo',ico:'🏠',color:'#993C1D'},{key:'servicios',label:'Servicios',ico:'💡',color:'#BA7517'},{key:'transporte',label:'Transporte',ico:'🚌',color:'#639922'},{key:'salud',label:'Salud',ico:'🏥',color:'#D4537E'},{key:'educacion',label:'Educación',ico:'📚',color:'#7F77DD'},{key:'ocio',label:'Ocio',ico:'🎬',color:'#5DCAA5'},{key:'ropa',label:'Ropa',ico:'👕',color:'#EF9F27'},{key:'personalizado',label:'Personalizada',ico:'✏️',color:'#888780'}]
};
const EMOJIS=['📊','📈','💰','🏦','💎','🌱','⭐','🔥','🎯','🚀','🦁','🌟','🎉','🐱','🦊','🌈','🍀','🎨','⚡','🧠'];
const TAB_IDS=['resumen','movimientos','deudas','ahorros','recurrentes','notificaciones'];
const TAB_NAMES={resumen:'Resumen',movimientos:'Movimientos',deudas:'Deudas',ahorros:'Ahorros',recurrentes:'Fijos',notificaciones:'Alertas'};

// ── ESTADO ─────────────────────────────────────────────────────────────────────
let currency='COP', darkMode=false, selectedCat='salario', currentTipo='ingreso';
let savType='meta', editingId=null, txnFilter='todos', paidOpen=false;
let editingTab='resumen', tabIcons={resumen:'📊',movimientos:'📋',deudas:'💳',ahorros:'🐷',recurrentes:'🔁',notificaciones:'🔔'};
let detailType=null, detailId=null, detailChartInst=null, barInst=null, savAbonoId=null;

// Datos en memoria (se sincronizan con la API al cargar y guardar)
let txns=[], debts=[], savings=[], inversiones=[], recurrentes=[];

// ── UTILS ──────────────────────────────────────────────────────────────────────
const pM=s=>parseFloat(String(s).replace(/\./g,'').replace(',','.'))||0;
const mi=el=>{const r=el.value.replace(/[^0-9]/g,'');el.value=r?parseInt(r).toLocaleString('es-CO'):''};
const fmt=n=>{const v=Math.round(Math.abs(n));return currency==='USD'?'$'+Math.round(v/4200).toLocaleString('en-US'):'$'+v.toLocaleString('es-CO')};
const todayStr=()=>new Date().toISOString().split('T')[0];

function setTopbarDate(){
  const d=new Date(),ms=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  document.getElementById('topbar-date').textContent=`${d.getDate()} de ${ms[d.getMonth()]} de ${d.getFullYear()}`;
}

// ── API CALLS ──────────────────────────────────────────────────────────────────
async function api(method, url, body=null){
  const opts={method,headers:{'Content-Type':'application/json'}};
  if(body)opts.body=JSON.stringify(body);
  const res=await fetch(url,opts);
  if(!res.ok)throw new Error(await res.text());
  return res.json();
}
const GET=url=>api('GET',url);
const POST=(url,b)=>api('POST',url,b);
const PUT=(url,b)=>api('PUT',url,b);
const DEL=url=>api('DELETE',url);

// ── CARGA INICIAL ──────────────────────────────────────────────────────────────
async function loadAll(){
  try{
    [txns, debts, savings, inversiones, recurrentes] = await Promise.all([
      GET('/api/movimientos'),
      GET('/api/deudas'),
      GET('/api/ahorros'),
      GET('/api/inversiones'),
      GET('/api/recurrentes')
    ]);
    renderAll();
  } catch(e){console.error('Error cargando datos:',e)}
}

function renderAll(){
  calcTotals(); renderBars(); renderTxns(); renderDebts();
  renderSavings(); renderHistorial(); renderRecurrentes(); renderNotifs();
  setTimeout(buildBarChart, 100);
}

// ── TOTALES ────────────────────────────────────────────────────────────────────
function calcTotals(){
  const ing=txns.filter(t=>t.tipo==='ingreso').reduce((s,t)=>s+t.monto,0);
  const gas=txns.filter(t=>t.tipo==='gasto').reduce((s,t)=>s+t.monto,0);
  const deu=debts.filter(d=>d.pagado<d.total).reduce((s,d)=>s+(d.total-d.pagado),0);
  document.getElementById('t-ing').textContent=fmt(ing);
  document.getElementById('t-gas').textContent=fmt(gas);
  document.getElementById('t-dis').textContent=fmt(ing-gas);
  document.getElementById('t-deu').textContent=fmt(deu);
  return{ing,gas,deu};
}

function renderBars(){
  const by={};
  txns.filter(t=>t.tipo==='gasto').forEach(t=>{
    const k=t.cat_label||t.cat||'Otro';
    if(!by[k])by[k]={val:0,color:t.cat_color||'#888'};
    by[k].val+=t.monto;
  });
  const total=Object.values(by).reduce((a,b)=>a+b.val,0)||1;
  const sorted=Object.entries(by).sort((a,b)=>b[1].val-a[1].val);
  const el=document.getElementById('gasto-bars');
  if(!sorted.length){el.innerHTML='<div style="font-size:13px;color:var(--txt2)">Sin gastos aún.</div>';return}
  el.innerHTML=sorted.map(([l,{val,color}])=>`<div class="bar-row"><div class="bar-label">${l}</div><div class="bar-track"><div class="bar-fill" style="width:${Math.round(val/total*100)}%;background:${color}"></div></div><div class="bar-val">${fmt(val)}</div></div>`).join('');
}

function renderHistorial(){
  const all=[];
  debts.forEach(d=>(d.historial||[]).forEach(h=>all.push({...h,dname:d.name,dico:d.ico})));
  const sorted=all.sort((a,b)=>new Date(b.fecha)-new Date(a.fecha)).slice(0,5);
  const el=document.getElementById('historial-res');
  if(!sorted.length){el.innerHTML='<div style="font-size:13px;color:var(--txt2)">Sin abonos aún.</div>';return}
  el.innerHTML=sorted.map(h=>`<div class="tl-item"><div class="tl-dot ${h.tipo==='extra'?'e':'p'}"></div><div class="tl-body"><div class="tl-name">${h.dico||''} ${h.dname}</div><div class="tl-date">${h.fecha}</div></div><div class="tl-right"><div class="tag ${h.tipo==='extra'?'tag-e':'tag-p'}">${h.tipo==='extra'?'Extra':'Normal'}</div><div style="font-size:12px;font-weight:500">${fmt(h.monto)}</div></div></div>`).join('');
}

// ── MOVIMIENTOS ────────────────────────────────────────────────────────────────
function renderTxns(filter){
  if(filter!==undefined)txnFilter=filter;
  const list=txnFilter==='todos'?txns:txns.filter(x=>x.tipo===txnFilter);
  const sorted=[...list].sort((a,b)=>new Date(b.fecha)-new Date(a.fecha));
  const el=document.getElementById('txn-list');
  if(!sorted.length){el.innerHTML='<div style="font-size:13px;color:var(--txt2)">Sin movimientos.</div>';return}
  el.innerHTML=sorted.map(x=>`<div class="txn">
    <div class="txn-ico" style="background:${x.cat_color||'#888'}22">${x.cat_ico||'📌'}</div>
    <div class="txn-info"><div class="txn-name">${x.desc}</div><div class="txn-cat">${x.cat_label||x.cat||''} · ${x.fecha}</div></div>
    <div class="txn-amount" style="color:${x.tipo==='ingreso'?'#0F6E56':'#993C1D'}">${x.tipo==='ingreso'?'+':'-'}${fmt(x.monto)}</div>
    <div class="txn-actions">
      <button class="icon-btn" onclick="openEdit(${x.id})">✏️</button>
      <button class="icon-btn del" onclick="deleteTxn(${x.id})">🗑</button>
    </div>
  </div>`).join('');
}

async function deleteTxn(id){
  if(!confirm('¿Eliminar?'))return;
  await DEL(`/api/movimientos/${id}`);
  txns=txns.filter(x=>x.id!==id);
  renderTxns();calcTotals();renderBars();updateBarChart();
}
function openEdit(id){
  const x=txns.find(y=>y.id===id);if(!x)return;
  editingId=id;
  document.getElementById('edit-desc').value=x.desc;
  document.getElementById('edit-monto').value=x.monto.toLocaleString('es-CO');
  document.getElementById('edit-fecha').value=x.fecha;
  document.getElementById('modal-edit').classList.add('open');
}
function closeEdit(){document.getElementById('modal-edit').classList.remove('open');editingId=null}
async function saveEdit(){
  const x=txns.find(y=>y.id===editingId);if(!x)return;
  const updated={...x,desc:document.getElementById('edit-desc').value.trim()||x.desc,monto:pM(document.getElementById('edit-monto').value)||x.monto,fecha:document.getElementById('edit-fecha').value||x.fecha};
  await PUT(`/api/movimientos/${editingId}`,updated);
  Object.assign(x,updated);
  closeEdit();renderTxns();calcTotals();renderBars();updateBarChart();
}

function filterTxn(f,btn){
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('sel'));
  btn.classList.add('sel');renderTxns(f);
}

// ── DEUDAS ─────────────────────────────────────────────────────────────────────
function renderDebts(){
  const active=debts.filter(d=>d.pagado<d.total), paid=debts.filter(d=>d.pagado>=d.total);
  const el=document.getElementById('debt-active-list');
  el.innerHTML=active.length?active.map(d=>debtCardHTML(d)).join(''):'<div style="font-size:13px;color:var(--txt2)">Sin deudas activas.</div>';
  const ps=document.getElementById('paid-section'),pl=document.getElementById('debt-paid-list');
  if(paid.length){ps.classList.remove('hidden');pl.innerHTML=paid.map(d=>debtCardHTML(d,true)).join('')}else ps.classList.add('hidden');
}
function debtCardHTML(d,isPaid=false){
  const pct=Math.min(100,Math.round(d.pagado/d.total*100));
  const pc=isPaid?'#1D9E75':pct>=75?'#1D9E75':pct>=40?'#EF9F27':'#D85A30';
  const lastH=(d.historial||[]).slice(-1)[0];
  return`<div class="item-card" onclick="openDetail('deuda',${d.id})">
    <div style="display:flex;align-items:center;gap:10px;margin-bottom:.625rem">
      <div style="width:38px;height:38px;border-radius:50%;background:${d.color||'#888'}22;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${d.ico}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:14px;font-weight:500">${d.name}</div>
        <div style="font-size:11px;color:var(--txt2)">Cuota ≈ ${fmt(d.total/d.cuotas)} · ${Math.max(0,d.cuotas-d.pagadas)} cuotas rest.</div>
        ${lastH?`<div style="font-size:11px;color:var(--txt2)">Último pago: ${lastH.fecha} · ${fmt(lastH.monto)}</div>`:''}
      </div>
      <span style="color:var(--txt2);font-size:14px">›</span>
    </div>
    <div class="prog-track"><div class="prog-fill" style="width:${pct}%;background:${pc}"></div></div>
    <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--txt2);margin-top:3px"><span>${pct}% pagado</span><span>Resta ${fmt(d.total-d.pagado)}</span></div>
  </div>`;
}
async function deleteDebt(id){
  if(!confirm('¿Eliminar esta deuda?'))return;
  await DEL(`/api/deudas/${id}`);
  debts=debts.filter(d=>d.id!==id);
  renderDebts();calcTotals();renderNotifs();
}
function togglePaid(){
  paidOpen=!paidOpen;
  document.getElementById('debt-paid-list').classList.toggle('hidden',!paidOpen);
  document.getElementById('paid-arrow').classList.toggle('open',paidOpen);
}

// ── AHORROS ────────────────────────────────────────────────────────────────────
function renderSavings(){
  const total=savings.reduce((s,g)=>s+g.actual,0);
  document.getElementById('saving-total').textContent=fmt(total);
  document.getElementById('saving-count').textContent=savings.length;
  const el=document.getElementById('saving-goals-list');
  el.innerHTML=savings.map(g=>{
    const pct=Math.min(100,Math.round(g.actual/g.meta*100));
    const circ=2*Math.PI*24,dash=(circ*pct/100).toFixed(1);
    const lastH=(g.historial||[]).slice(-1)[0];
    return`<div class="item-card" onclick="openDetail('ahorro',${g.id})">
      <div style="display:flex;align-items:center;gap:12px">
        <div class="ring-wrap"><svg width="60" height="60" viewBox="0 0 60 60"><circle cx="30" cy="30" r="24" fill="none" stroke="var(--bg2)" stroke-width="6"/><circle cx="30" cy="30" r="24" fill="none" stroke="#185FA5" stroke-width="6" stroke-dasharray="${dash} ${circ.toFixed(1)}" stroke-linecap="round"/></svg><div class="ring-center"><div class="ring-pct">${pct}%</div></div></div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:500">${g.ico||''} ${g.name}</div>
          <div style="font-size:12px;color:var(--txt2)">${fmt(g.actual)} de ${fmt(g.meta)}</div>
          ${lastH?`<div style="font-size:11px;color:var(--txt2)">Último abono: ${lastH.fecha} · ${fmt(lastH.monto)}</div>`:''}
          ${g.fecha?`<div style="font-size:11px;color:#185FA5">Objetivo: ${g.fecha}</div>`:''}
        </div>
        <span style="color:var(--txt2);font-size:14px">›</span>
      </div>
    </div>`;
  }).join('');
  renderInversiones();
}
function renderInversiones(){
  const el=document.getElementById('inv-list');
  el.innerHTML=inversiones.map(inv=>{
    const tasaM=inv.periodo==='anual'?Math.pow(1+inv.tasa/100,1/12)-1:inv.tasa/100;
    const ganancia=inv.capital*(Math.pow(1+tasaM,inv.meses)-1),diaria=ganancia/365;
    const lastH=(inv.historial||[]).slice(-1)[0];
    return`<div class="inv-card" onclick="openDetail('inversion',${inv.id})">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:.75rem">
        <div style="width:38px;height:38px;border-radius:50%;background:#E6F1FB;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">📈</div>
        <div style="flex:1;min-width:0">
          <div style="font-size:14px;font-weight:500">${inv.name}</div>
          <div style="font-size:11px;color:#185FA5">${inv.entidad||''} · ${inv.tasa}% ${inv.periodo==='anual'?'E.A.':'mensual'}</div>
          ${lastH?`<div style="font-size:11px;color:var(--txt2)">Último mov: ${lastH.fecha}</div>`:''}
        </div>
        <span style="color:var(--txt2);font-size:14px">›</span>
      </div>
      <div class="inv-stats">
        <div class="inv-stat"><div class="inv-stat-val">${fmt(inv.capital)}</div><div class="inv-stat-lbl">Capital</div></div>
        <div class="inv-stat"><div class="inv-stat-val" style="color:#085041">+${fmt(ganancia)}</div><div class="inv-stat-lbl">Ganancia</div></div>
        <div class="inv-stat"><div class="inv-stat-val">${fmt(diaria)}/día</div><div class="inv-stat-lbl">Crecimiento</div></div>
      </div>
    </div>`;
  }).join('');
}
async function deleteSaving(id){
  if(!confirm('¿Eliminar?'))return;
  await DEL(`/api/ahorros/${id}`);
  savings=savings.filter(x=>x.id!==id);renderSavings();
}
async function deleteInv(id){
  if(!confirm('¿Eliminar?'))return;
  await DEL(`/api/inversiones/${id}`);
  inversiones=inversiones.filter(x=>x.id!==id);renderInversiones();
}

function openSavAbono(id){
  savAbonoId=id;const g=savings.find(x=>x.id===id);if(!g)return;
  document.getElementById('sav-abono-name').textContent=`${g.ico||''} ${g.name}`;
  document.getElementById('sav-abono-monto').value='';document.getElementById('sav-abono-nota').value='';
  document.getElementById('modal-sav-abono').classList.add('open');
}
async function guardarAbonoSaving(){
  const g=savings.find(x=>x.id===savAbonoId);if(!g)return;
  const monto=pM(document.getElementById('sav-abono-monto').value),nota=document.getElementById('sav-abono-nota').value.trim();
  if(!monto||monto<=0)return;
  await POST(`/api/ahorros/${savAbonoId}/abonos`,{fecha:todayStr(),monto,nota});
  g.actual=Math.min(g.meta,g.actual+monto);
  if(!g.historial)g.historial=[];
  g.historial.push({fecha:todayStr(),monto,nota});
  document.getElementById('modal-sav-abono').classList.remove('open');
  renderSavings();
  if(g.actual>=g.meta)setTimeout(()=>alert(`¡Meta "${g.name}" completada! 🎉`),100);
}

// ── RECURRENTES ────────────────────────────────────────────────────────────────
function renderRecurrentes(){
  const today_d=new Date().getDate(),total=recurrentes.reduce((s,r)=>s+r.monto,0);
  const el=document.getElementById('recur-list');
  if(!recurrentes.length){el.innerHTML='<div style="font-size:13px;color:var(--txt2)">Sin gastos fijos.</div>';return}
  el.innerHTML=`<div class="card" style="margin-bottom:.875rem"><div style="display:flex;justify-content:space-between;align-items:center"><div><div style="font-size:12px;color:var(--txt2)">Total mensual fijos</div><div style="font-size:20px;font-weight:500;color:#993C1D">${fmt(total)}</div></div><div style="font-size:12px;color:var(--txt2)">${recurrentes.length} servicios</div></div></div>`+
  recurrentes.map(r=>{
    const diff=r.dia-today_d;let badge,bclass;
    if(diff<0){badge='Cobrado';bclass='b-ok'}else if(diff===0){badge='¡Hoy!';bclass='b-due'}else if(diff<=3){badge=`En ${diff}d`;bclass='b-soon'}else{badge=`Día ${r.dia}`;bclass='b-ok'}
    const lastH=(r.historial||[]).slice(-1)[0];
    return`<div class="item-card" onclick="openDetail('recurrente',${r.id})">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:.5rem">
        <div style="width:36px;height:36px;border-radius:50%;background:${r.color||'#888'}22;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0">${r.ico}</div>
        <div style="flex:1;min-width:0"><div style="font-size:14px;font-weight:500">${r.name}</div><div style="font-size:11px;color:var(--txt2)">${r.nota||''}</div>${lastH?`<div style="font-size:11px;color:var(--txt2)">Último cobro: ${lastH.fecha}</div>`:''}</div>
        <div style="text-align:right"><div style="font-size:15px;font-weight:500;color:#993C1D">${fmt(r.monto)}</div><div style="font-size:11px;color:var(--txt2)">/ mes</div></div>
        <span style="color:var(--txt2);font-size:14px;margin-left:4px">›</span>
      </div>
      <div style="display:flex;align-items:center;justify-content:space-between;padding:.45rem .75rem;border-radius:var(--r);background:var(--bg2);font-size:12px"><span style="color:var(--txt2)">Próximo cobro</span><span class="badge ${bclass}">${badge}</span></div>
    </div>`;
  }).join('');
}
async function deleteRecurrente(id){
  if(!confirm('¿Eliminar?'))return;
  await DEL(`/api/recurrentes/${id}`);
  recurrentes=recurrentes.filter(r=>r.id!==id);renderRecurrentes();renderNotifs();
}

// ── NOTIFICACIONES ─────────────────────────────────────────────────────────────
function renderNotifs(){
  const{ing}=calcTotals(),today_d=new Date().getDate(),items=[];
  debts.filter(d=>d.pagado<d.total).forEach(d=>{
    const diff=d.vence-today_d,cuota=Math.round(d.total/d.cuotas);
    if(diff===0)items.push({cls:'a',ico:d.ico,title:`¡Vence hoy! — ${d.name}`,sub:`Cuota de ${fmt(cuota)} vence hoy.`,time:'Hoy, 8:00 a.m.'});
    else if(diff>0&&diff<=3)items.push({cls:'w',ico:d.ico,title:`Vence en ${diff} días — ${d.name}`,sub:`Cuota de ${fmt(cuota)} vence el día ${d.vence}. Disponible: ${fmt(ing)}.`,time:'Hoy, 10:00 a.m.'});
  });
  recurrentes.forEach(r=>{
    const diff=r.dia-today_d;
    if(diff>=0&&diff<=2)items.push({cls:'w',ico:r.ico,title:`${diff===0?'¡Hoy':'En '+diff+'d'} — ${r.name}`,sub:`Cobro de ${fmt(r.monto)} el día ${r.dia}.`,time:diff===0?'Hoy':'Próximamente'});
  });
  const lastH=debts.flatMap(d=>(d.historial||[]).map(h=>({...h,d}))).sort((a,b)=>new Date(b.fecha)-new Date(a.fecha))[0];
  if(lastH)items.push({cls:'ok',ico:'✅',title:`Pago registrado — ${lastH.d.name}`,sub:`Abonaste ${fmt(lastH.monto)}.`,time:'Hace 2 horas'});
  const el=document.getElementById('notif-list');
  if(!items.length){el.innerHTML='<div style="font-size:13px;color:var(--txt2)">Sin alertas activas.</div>';return}
  el.innerHTML=items.map(n=>`<div class="notif ${n.cls}"><div class="notif-ico">${n.ico}</div><div><div style="font-size:12px;font-weight:500">${n.title}</div><div style="font-size:11px;color:var(--txt2);margin-top:2px;line-height:1.4">${n.sub}</div><div style="font-size:11px;color:var(--txt2);margin-top:2px">${n.time}</div></div></div>`).join('');
}

// ── PANTALLA DETALLE ───────────────────────────────────────────────────────────
function openDetail(type,id){
  detailType=type;detailId=id;
  document.getElementById('detail-screen').classList.add('open');
  buildDetail(type,id);
}
function closeDetail(){
  document.getElementById('detail-screen').classList.remove('open');
  detailType=null;detailId=null;
  if(detailChartInst){detailChartInst.destroy();detailChartInst=null}
}
function openDetailEdit(){
  if(detailType==='deuda')editDebtModal(detailId);
  else if(detailType==='ahorro')editSavModal(detailId);
  else if(detailType==='inversion')editInvModal(detailId);
  else if(detailType==='recurrente')editRecModal(detailId);
}
function buildDetail(type,id){
  if(type==='deuda')buildDebtDetail(id);
  else if(type==='ahorro')buildSavDetail(id);
  else if(type==='inversion')buildInvDetail(id);
  else if(type==='recurrente')buildRecDetail(id);
}

function buildDebtDetail(id){
  const d=debts.find(x=>x.id===id);if(!d)return;
  document.getElementById('detail-title').textContent=`${d.ico} ${d.name}`;
  document.getElementById('detail-subtitle').textContent='Detalle de deuda';
  const pct=Math.min(100,Math.round(d.pagado/d.total*100));
  const hist=d.historial||[];
  const avg=hist.length?Math.round(hist.reduce((s,h)=>s+h.monto,0)/hist.length):0;
  const extras=hist.filter(h=>h.tipo==='extra').length;
  const cBase=Math.round(d.total/d.cuotas);
  const restC=Math.max(0,d.cuotas-d.pagadas);
  const pc=pct>=75?'#1D9E75':pct>=40?'#EF9F27':'#D85A30';
  document.getElementById('detail-body').innerHTML=`
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
      <div style="width:52px;height:52px;border-radius:50%;background:${d.color||'#888'}22;display:flex;align-items:center;justify-content:center;font-size:24px">${d.ico}</div>
      <div><div style="font-size:17px;font-weight:500">${d.name}</div><div style="font-size:12px;color:var(--txt2)">Inicio: ${d.fecha} · Vence día ${d.vence}</div></div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--txt2);margin-bottom:4px"><span>${pct}% pagado</span><span>Resta ${fmt(d.total-d.pagado)}</span></div>
      <div class="prog-track" style="height:12px"><div class="prog-fill" style="width:${pct}%;background:${pc}"></div></div>
    </div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-box-val">${fmt(d.total)}</div><div class="stat-box-lbl">Total deuda</div></div>
      <div class="stat-box"><div class="stat-box-val pos">${fmt(d.pagado)}</div><div class="stat-box-lbl">Pagado</div></div>
      <div class="stat-box"><div class="stat-box-val neg">${fmt(d.total-d.pagado)}</div><div class="stat-box-lbl">Restante</div></div>
      <div class="stat-box"><div class="stat-box-val">${fmt(avg)}</div><div class="stat-box-lbl">Promedio/pago</div></div>
    </div>
    <div class="card" style="margin-bottom:.875rem">
      <div class="card-title">Estadísticas</div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:13px">
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Cuotas pagadas</span><span style="font-weight:500">${d.pagadas} de ${d.cuotas}</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Abonos extra</span><span style="font-weight:500">${extras}</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Cuota base</span><span style="font-weight:500">${fmt(cBase)}</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Proyección cierre</span><span style="font-weight:500">${restC>0?`≈${restC} meses`:'¡Pagada!'}</span></div>
      </div>
    </div>
    <div class="card" style="margin-bottom:.875rem"><div class="card-title">Evolución de pagos</div><div style="position:relative;height:140px"><canvas id="det-chart" role="img" aria-label="Evolución de pagos acumulados">Pagos acumulados.</canvas></div></div>
    <div class="card">
      <div class="card-title">Historial completo</div>
      ${hist.length?hist.slice().reverse().map(h=>`<div class="tl-item"><div class="tl-dot ${h.tipo==='extra'?'e':'p'}"></div><div class="tl-body"><div class="tl-name">${h.nota||'Pago realizado'}</div><div class="tl-date">${h.fecha}</div></div><div class="tl-right"><div class="tag ${h.tipo==='extra'?'tag-e':'tag-p'}">${h.tipo==='extra'?'Extra':'Normal'}</div><div style="font-size:13px;font-weight:500">${fmt(h.monto)}</div></div></div>`).join(''):'<div style="font-size:13px;color:var(--txt2)">Sin pagos aún.</div>'}
    </div>
    <div class="abono-row" style="margin-top:.75rem;padding-top:0;border-top:none">
      <input class="abono-input" type="text" inputmode="numeric" placeholder="Abono extra ($)" id="det-abono-inp" oninput="mi(this)">
      <button class="abono-btn" onclick="hacerAbonoDebt(${id})">＋ Abonar</button>
    </div>`;
  setTimeout(()=>buildDetChart(hist.map(h=>h.fecha),hist.map((_,i)=>Math.round(hist.slice(0,i+1).reduce((s,x)=>s+x.monto,0))),'#378ADD'),50);
}

function buildSavDetail(id){
  const g=savings.find(x=>x.id===id);if(!g)return;
  document.getElementById('detail-title').textContent=`${g.ico||''} ${g.name}`;
  document.getElementById('detail-subtitle').textContent='Meta de ahorro';
  const pct=Math.min(100,Math.round(g.actual/g.meta*100));
  const hist=g.historial||[];
  const avg=hist.length?Math.round(hist.reduce((s,h)=>s+h.monto,0)/hist.length):0;
  const resta=g.meta-g.actual,ritmo=avg>0?Math.ceil(resta/avg):null;
  document.getElementById('detail-body').innerHTML=`
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
      <div style="width:52px;height:52px;border-radius:50%;background:#E6F1FB;display:flex;align-items:center;justify-content:center;font-size:24px">${g.ico||'🎯'}</div>
      <div><div style="font-size:17px;font-weight:500">${g.name}</div><div style="font-size:12px;color:var(--txt2)">${g.fecha?'Objetivo: '+g.fecha:'Sin fecha objetivo'}</div></div>
    </div>
    <div style="margin-bottom:1rem">
      <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--txt2);margin-bottom:4px"><span>${pct}% completado</span><span>Faltan ${fmt(resta)}</span></div>
      <div class="prog-track" style="height:12px"><div class="prog-fill" style="width:${pct}%;background:#185FA5"></div></div>
    </div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-box-val sav">${fmt(g.actual)}</div><div class="stat-box-lbl">Ahorrado</div></div>
      <div class="stat-box"><div class="stat-box-val">${fmt(g.meta)}</div><div class="stat-box-lbl">Meta</div></div>
      <div class="stat-box"><div class="stat-box-val">${fmt(avg)}</div><div class="stat-box-lbl">Promedio/abono</div></div>
      <div class="stat-box"><div class="stat-box-val">${ritmo?ritmo+' abonos':'—'}</div><div class="stat-box-lbl">Para completar</div></div>
    </div>
    <div class="card" style="margin-bottom:.875rem"><div class="card-title">Evolución del ahorro</div><div style="position:relative;height:140px"><canvas id="det-chart" role="img" aria-label="Evolución del ahorro acumulado">Ahorro acumulado.</canvas></div></div>
    <div class="card">
      <div class="card-title">Historial de abonos</div>
      ${hist.length?hist.slice().reverse().map(h=>`<div class="tl-item"><div class="tl-dot a"></div><div class="tl-body"><div class="tl-name">${h.nota||'Abono'}</div><div class="tl-date">${h.fecha}</div></div><div class="tl-right"><div class="tag tag-a">Abono</div><div style="font-size:13px;font-weight:500;color:#185FA5">+${fmt(h.monto)}</div></div></div>`).join(''):'<div style="font-size:13px;color:var(--txt2)">Sin abonos aún.</div>'}
    </div>
    <div class="abono-row" style="margin-top:.75rem;padding-top:0;border-top:none">
      <input class="abono-input" type="text" inputmode="numeric" placeholder="Nuevo abono ($)" id="det-sav-inp" oninput="mi(this)">
      <input class="abono-input" type="text" placeholder="Nota" id="det-sav-nota" style="flex:1.2">
      <button class="abono-btn" onclick="hacerAbonoSav(${id})">＋</button>
    </div>`;
  setTimeout(()=>buildDetChart(hist.map(h=>h.fecha),hist.map((_,i)=>Math.round(hist.slice(0,i+1).reduce((s,x)=>s+x.monto,0))),'#185FA5'),50);
}

function buildInvDetail(id){
  const inv=inversiones.find(x=>x.id===id);if(!inv)return;
  document.getElementById('detail-title').textContent=inv.name;
  document.getElementById('detail-subtitle').textContent='CDT / Inversión';
  const tasaM=inv.periodo==='anual'?Math.pow(1+inv.tasa/100,1/12)-1:inv.tasa/100;
  const total=inv.capital*Math.pow(1+tasaM,inv.meses),ganancia=total-inv.capital,diaria=ganancia/365;
  const hist=inv.historial||[];
  const labels=Array.from({length:Math.min(inv.meses,12)},(_,i)=>`M${i+1}`);
  const vals=labels.map((_,i)=>Math.round(inv.capital*Math.pow(1+tasaM,i+1)));
  document.getElementById('detail-body').innerHTML=`
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
      <div style="width:52px;height:52px;border-radius:50%;background:#E6F1FB;display:flex;align-items:center;justify-content:center;font-size:24px">📈</div>
      <div><div style="font-size:17px;font-weight:500">${inv.name}</div><div style="font-size:12px;color:#185FA5">${inv.entidad||''} · ${inv.tasa}% ${inv.periodo==='anual'?'E.A.':'mensual'}</div></div>
    </div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-box-val">${fmt(inv.capital)}</div><div class="stat-box-lbl">Capital</div></div>
      <div class="stat-box"><div class="stat-box-val" style="color:#0F6E56">+${fmt(ganancia)}</div><div class="stat-box-lbl">Ganancia</div></div>
      <div class="stat-box"><div class="stat-box-val">${fmt(total)}</div><div class="stat-box-lbl">Total final</div></div>
      <div class="stat-box"><div class="stat-box-val" style="color:#0F6E56">+${fmt(diaria)}</div><div class="stat-box-lbl">Por día</div></div>
    </div>
    <div class="card" style="margin-bottom:.875rem"><div class="card-title">Proyección mensual</div><div style="position:relative;height:150px"><canvas id="det-chart" role="img" aria-label="Proyección mensual del CDT">Proyección CDT.</canvas></div></div>
    <div class="card" style="margin-bottom:.875rem">
      <div class="card-title">Estadísticas</div>
      <div style="display:flex;flex-direction:column;gap:6px;font-size:13px">
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Duración</span><span style="font-weight:500">${inv.meses} meses</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Inicio</span><span style="font-weight:500">${inv.fecha}</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Ganancia mensual promedio</span><span style="font-weight:500;color:#0F6E56">+${fmt(ganancia/inv.meses)}</span></div>
        <div style="display:flex;justify-content:space-between"><span style="color:var(--txt2)">Rendimiento total</span><span style="font-weight:500;color:#0F6E56">${((ganancia/inv.capital)*100).toFixed(2)}%</span></div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">Historial de movimientos</div>
      ${hist.length?hist.slice().reverse().map(h=>`<div class="tl-item"><div class="tl-dot a"></div><div class="tl-body"><div class="tl-name">${h.nota||'Movimiento'}</div><div class="tl-date">${h.fecha}</div></div><div class="tl-right"><div style="font-size:13px;font-weight:500;color:#185FA5">${fmt(h.monto)}</div></div></div>`).join(''):'<div style="font-size:13px;color:var(--txt2)">Sin movimientos.</div>'}
    </div>`;
  setTimeout(()=>buildDetChart(labels,vals,'#185FA5'),50);
}

function buildRecDetail(id){
  const r=recurrentes.find(x=>x.id===id);if(!r)return;
  document.getElementById('detail-title').textContent=`${r.ico} ${r.name}`;
  document.getElementById('detail-subtitle').textContent='Gasto fijo mensual';
  const hist=r.historial||[];const totalPag=hist.reduce((s,h)=>s+h.monto,0);
  document.getElementById('detail-body').innerHTML=`
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:1rem">
      <div style="width:52px;height:52px;border-radius:50%;background:${r.color||'#888'}22;display:flex;align-items:center;justify-content:center;font-size:24px">${r.ico}</div>
      <div><div style="font-size:17px;font-weight:500">${r.name}</div><div style="font-size:12px;color:var(--txt2)">${r.nota||''} · Día ${r.dia} de cada mes</div></div>
    </div>
    <div class="stat-row">
      <div class="stat-box"><div class="stat-box-val neg">${fmt(r.monto)}</div><div class="stat-box-lbl">Mensual</div></div>
      <div class="stat-box"><div class="stat-box-val neg">${fmt(r.monto*12)}</div><div class="stat-box-lbl">Anual</div></div>
      <div class="stat-box"><div class="stat-box-val">${hist.length}</div><div class="stat-box-lbl">Pagos registrados</div></div>
      <div class="stat-box"><div class="stat-box-val neg">${fmt(totalPag)}</div><div class="stat-box-lbl">Total pagado</div></div>
    </div>
    <div class="card" style="margin-bottom:.875rem"><div class="card-title">Historial de cobros</div><div style="position:relative;height:130px"><canvas id="det-chart" role="img" aria-label="Historial de pagos del servicio">Pagos mensuales.</canvas></div></div>
    <div class="card">
      <div class="card-title">Todos los cobros</div>
      ${hist.length?hist.slice().reverse().map(h=>`<div class="tl-item"><div class="tl-dot p"></div><div class="tl-body"><div class="tl-name">Cobro automático</div><div class="tl-date">${h.fecha}</div></div><div class="tl-right"><div style="font-size:13px;font-weight:500;color:#993C1D">-${fmt(h.monto)}</div></div></div>`).join(''):'<div style="font-size:13px;color:var(--txt2)">Sin cobros aún.</div>'}
    </div>
    <div style="margin-top:.75rem;display:flex;gap:8px">
      <button class="icon-btn" style="width:auto;padding:6px 12px;font-size:12px;gap:5px" onclick="editRecModal(${id})">✏️ Editar</button>
      <button class="icon-btn del" style="width:auto;padding:6px 12px;font-size:12px;gap:5px" onclick="deleteRecurrente(${id}).then(closeDetail)">🗑 Eliminar</button>
    </div>`;
  setTimeout(()=>buildDetChart(hist.map(h=>h.fecha),hist.map(h=>h.monto),r.color||'#D85A30',true),50);
}

function buildDetChart(labels,data,color,bar=false){
  const canvas=document.getElementById('det-chart');if(!canvas)return;
  const isDark=matchMedia('(prefers-color-scheme:dark)').matches;
  const grid=isDark?'rgba(255,255,255,.08)':'rgba(0,0,0,.06)',txt=isDark?'#aaa':'#666';
  if(detailChartInst)detailChartInst.destroy();
  detailChartInst=new Chart(canvas,{
    type:bar?'bar':'line',
    data:{labels,datasets:[{data,borderColor:color,backgroundColor:bar?color:color+'33',fill:!bar,tension:.4,pointRadius:3,borderWidth:2,pointBackgroundColor:color}]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>fmt(c.raw)}}},
      scales:{x:{ticks:{color:txt,font:{size:10},maxTicksLimit:6},grid:{color:grid}},y:{ticks:{color:txt,font:{size:10},callback:v=>fmt(v)},grid:{color:grid}}}}
  });
}

async function hacerAbonoDebt(id){
  const d=debts.find(x=>x.id===id);if(!d)return;
  const val=pM(document.getElementById('det-abono-inp').value);if(!val||val<=0)return;
  const isX=val>d.total/d.cuotas*1.05;
  await POST(`/api/deudas/${id}/pagos`,{fecha:todayStr(),monto:val,tipo:isX?'extra':'normal',nota:isX?'Abono extra':'Cuota'});
  d.pagado=Math.min(d.total,d.pagado+val);d.pagadas=Math.min(d.cuotas,Math.floor(d.pagado/(d.total/d.cuotas)));
  const pct=Math.min(100,Math.round(d.pagado/d.total*100));
  if(!d.historial)d.historial=[];
  d.historial.push({fecha:todayStr(),monto:val,tipo:isX?'extra':'normal',nota:isX?'Abono extra':'Cuota',pctAfter:pct});
  if(d.pagado>=d.total)setTimeout(()=>alert(`¡"${d.name}" pagada al 100%!`),100);
  renderDebts();calcTotals();renderHistorial();renderNotifs();buildDebtDetail(id);
}

async function hacerAbonoSav(id){
  const g=savings.find(x=>x.id===id);if(!g)return;
  const monto=pM(document.getElementById('det-sav-inp').value);if(!monto||monto<=0)return;
  const nota=document.getElementById('det-sav-nota').value.trim();
  await POST(`/api/ahorros/${id}/abonos`,{fecha:todayStr(),monto,nota});
  g.actual=Math.min(g.meta,g.actual+monto);
  if(!g.historial)g.historial=[];g.historial.push({fecha:todayStr(),monto,nota});
  if(g.actual>=g.meta)setTimeout(()=>alert(`¡Meta "${g.name}" completada! 🎉`),100);
  renderSavings();buildSavDetail(id);
}

// ── EDICIÓN DESDE DETALLE ──────────────────────────────────────────────────────
function editDebtModal(id){
  const d=debts.find(x=>x.id===id);if(!d)return;
  document.getElementById('modal-det-edit-body').innerHTML=`<div class="modal-title">Editar deuda <button class="close-btn" onclick="document.getElementById('modal-det-edit').classList.remove('open')">×</button></div><div class="form-row"><label>Nombre</label><input type="text" id="ed-name" value="${d.name}"></div><div class="form-grid"><div class="form-row"><label>Total ($)</label><input type="text" id="ed-total" value="${d.total.toLocaleString('es-CO')}" inputmode="numeric"></div><div class="form-row"><label>Cuotas totales</label><input type="number" id="ed-cuotas" value="${d.cuotas}" min="1"></div></div><div class="form-grid"><div class="form-row"><label>Cuotas pagadas</label><input type="number" id="ed-pagadas" value="${d.pagadas}" min="0"></div><div class="form-row"><label>Día vencimiento</label><input type="number" id="ed-vence" value="${d.vence}" min="1" max="31"></div></div><button class="btn-save" onclick="saveDebtEdit(${id})">Guardar cambios</button>`;
  document.getElementById('modal-det-edit').classList.add('open');
}
async function saveDebtEdit(id){
  const d=debts.find(x=>x.id===id);if(!d)return;
  d.name=document.getElementById('ed-name').value.trim()||d.name;
  d.total=pM(document.getElementById('ed-total').value)||d.total;
  d.cuotas=parseInt(document.getElementById('ed-cuotas').value)||d.cuotas;
  d.pagadas=parseInt(document.getElementById('ed-pagadas').value)||0;
  d.vence=parseInt(document.getElementById('ed-vence').value)||d.vence;
  await PUT(`/api/deudas/${id}`,d);
  document.getElementById('modal-det-edit').classList.remove('open');
  renderDebts();calcTotals();buildDebtDetail(id);
}

function editSavModal(id){
  const g=savings.find(x=>x.id===id);if(!g)return;
  document.getElementById('modal-det-edit-body').innerHTML=`<div class="modal-title">Editar meta <button class="close-btn" onclick="document.getElementById('modal-det-edit').classList.remove('open')">×</button></div><div class="form-row"><label>Nombre</label><input type="text" id="es-name" value="${g.name}"></div><div class="form-grid"><div class="form-row"><label>Meta total ($)</label><input type="text" id="es-meta" value="${g.meta.toLocaleString('es-CO')}" inputmode="numeric"></div><div class="form-row"><label>Ya ahorrado ($)</label><input type="text" id="es-actual" value="${g.actual.toLocaleString('es-CO')}" inputmode="numeric"></div></div><div class="form-row"><label>Fecha objetivo</label><input type="date" id="es-fecha" value="${g.fecha||''}"></div><button class="btn-save" onclick="saveSavEdit(${id})">Guardar cambios</button>`;
  document.getElementById('modal-det-edit').classList.add('open');
}
async function saveSavEdit(id){
  const g=savings.find(x=>x.id===id);if(!g)return;
  g.name=document.getElementById('es-name').value.trim()||g.name;
  g.meta=pM(document.getElementById('es-meta').value)||g.meta;
  g.actual=pM(document.getElementById('es-actual').value);
  g.fecha=document.getElementById('es-fecha').value;
  await PUT(`/api/ahorros/${id}`,g);
  document.getElementById('modal-det-edit').classList.remove('open');
  renderSavings();buildSavDetail(id);
}

function editInvModal(id){
  const inv=inversiones.find(x=>x.id===id);if(!inv)return;
  document.getElementById('modal-det-edit-body').innerHTML=`<div class="modal-title">Editar inversión <button class="close-btn" onclick="document.getElementById('modal-det-edit').classList.remove('open')">×</button></div><div class="form-row"><label>Nombre</label><input type="text" id="ei-name" value="${inv.name}"></div><div class="form-grid"><div class="form-row"><label>Capital ($)</label><input type="text" id="ei-capital" value="${inv.capital.toLocaleString('es-CO')}" inputmode="numeric"></div><div class="form-row"><label>Tasa (%)</label><input type="text" id="ei-tasa" value="${inv.tasa}" inputmode="decimal"></div></div><div class="form-grid"><div class="form-row"><label>Período</label><select id="ei-periodo"><option value="anual" ${inv.periodo==='anual'?'selected':''}>Anual</option><option value="mensual" ${inv.periodo==='mensual'?'selected':''}>Mensual</option></select></div><div class="form-row"><label>Duración (meses)</label><input type="number" id="ei-meses" value="${inv.meses}" min="1"></div></div><div class="form-row"><label>Entidad</label><input type="text" id="ei-entidad" value="${inv.entidad||''}"></div><button class="btn-save" onclick="saveInvEdit(${id})">Guardar cambios</button>`;
  document.getElementById('modal-det-edit').classList.add('open');
}
async function saveInvEdit(id){
  const inv=inversiones.find(x=>x.id===id);if(!inv)return;
  inv.name=document.getElementById('ei-name').value.trim()||inv.name;
  inv.capital=pM(document.getElementById('ei-capital').value)||inv.capital;
  inv.tasa=parseFloat(document.getElementById('ei-tasa').value)||inv.tasa;
  inv.periodo=document.getElementById('ei-periodo').value;
  inv.meses=parseInt(document.getElementById('ei-meses').value)||inv.meses;
  inv.entidad=document.getElementById('ei-entidad').value.trim();
  await PUT(`/api/inversiones/${id}`,inv);
  document.getElementById('modal-det-edit').classList.remove('open');
  renderSavings();buildInvDetail(id);
}

function editRecModal(id){
  const r=recurrentes.find(x=>x.id===id);if(!r)return;
  document.getElementById('modal-det-edit-body').innerHTML=`<div class="modal-title">Editar gasto fijo <button class="close-btn" onclick="document.getElementById('modal-det-edit').classList.remove('open')">×</button></div><div class="form-row"><label>Nombre</label><input type="text" id="er-name" value="${r.name}"></div><div class="form-grid"><div class="form-row"><label>Monto mensual ($)</label><input type="text" id="er-monto" value="${r.monto.toLocaleString('es-CO')}" inputmode="numeric"></div><div class="form-row"><label>Día de cobro</label><input type="number" id="er-dia" value="${r.dia}" min="1" max="31"></div></div><div class="form-row"><label>Notas</label><input type="text" id="er-nota" value="${r.nota||''}"></div><button class="btn-save" onclick="saveRecEdit(${id})">Guardar cambios</button>`;
  document.getElementById('modal-det-edit').classList.add('open');
}
async function saveRecEdit(id){
  const r=recurrentes.find(x=>x.id===id);if(!r)return;
  r.name=document.getElementById('er-name').value.trim()||r.name;
  r.monto=pM(document.getElementById('er-monto').value)||r.monto;
  r.dia=parseInt(document.getElementById('er-dia').value)||r.dia;
  r.nota=document.getElementById('er-nota').value.trim();
  await PUT(`/api/recurrentes/${id}`,r);
  document.getElementById('modal-det-edit').classList.remove('open');
  renderRecurrentes();buildRecDetail(id);
}

// ── FORMULARIO AGREGAR ─────────────────────────────────────────────────────────
function setSavType(type){
  savType=type;
  document.getElementById('sav-btn-meta').className='sav-type-btn'+(type==='meta'?' sel-meta':'');
  document.getElementById('sav-btn-inv').className='sav-type-btn'+(type==='inversion'?' sel-inv':'');
  document.getElementById('sav-fields-meta').classList.toggle('hidden',type!=='meta');
  document.getElementById('sav-fields-inv').classList.toggle('hidden',type!=='inversion');
}

function updateInvPreview(){
  const capital=pM(document.getElementById('inv-capital').value);
  const tasa=parseFloat(document.getElementById('inv-tasa').value)||0;
  const periodo=document.getElementById('inv-periodo').value;
  const meses=parseInt(document.getElementById('inv-meses').value)||0;
  const el=document.getElementById('inv-preview');
  if(!capital||!tasa||!meses){el.textContent='Completa los campos para ver la proyección.';return}
  const tasaM=periodo==='anual'?Math.pow(1+tasa/100,1/12)-1:tasa/100;
  const ganancia=capital*(Math.pow(1+tasaM,meses)-1);
  el.innerHTML=`Capital: ${fmt(capital)} · Ganancia: <span style="color:#0F6E56;font-weight:500">+${fmt(ganancia)}</span> · Total: <span style="font-weight:500">${fmt(capital+ganancia)}</span> · Diario: <span style="color:#0F6E56">+${fmt(ganancia/365)}</span>`;
}

function buildCatGrid(){
  const cats=CATS[currentTipo==='deuda'||currentTipo==='recurrente'||currentTipo==='ahorro'?'gasto':currentTipo]||CATS.gasto;
  document.getElementById('cat-grid').innerHTML=cats.map(c=>`<button class="cat-btn${selectedCat===c.key?' sel':''}" onclick="selectCat('${c.key}')"><span style="font-size:18px">${c.ico}</span><span>${c.label}</span></button>`).join('');
  document.getElementById('custom-row').style.display=selectedCat==='personalizado'?'block':'none';
}
function selectCat(k){selectedCat=k;buildCatGrid()}

function setTipo(tipo){
  currentTipo=tipo;
  const map={ingreso:'ing',gasto:'exp',deuda:'deu',ahorro:'sav',recurrente:'rec'};
  Object.entries(map).forEach(([t,k])=>{const b=document.getElementById('btn-'+k);if(b)b.className='tipo-btn'+(tipo===t?` t-${k}`:'')});
  document.getElementById('fields-txn').style.display=(tipo==='deuda'||tipo==='recurrente'||tipo==='ahorro')?'none':'block';
  document.getElementById('fields-deu').style.display=tipo==='deuda'?'block':'none';
  document.getElementById('fields-sav').style.display=tipo==='ahorro'?'block':'none';
  document.getElementById('fields-rec').style.display=tipo==='recurrente'?'block':'none';
  if(tipo!=='deuda'&&tipo!=='recurrente'&&tipo!=='ahorro'){selectedCat=tipo==='ingreso'?'salario':'alimentacion';buildCatGrid()}
  if(tipo==='ahorro')setSavType('meta');
}

function openModal(force){
  document.getElementById('modal').classList.add('open');
  const t=todayStr();
  ['fecha-inp','deu-fecha','inv-fecha'].forEach(id=>{const e=document.getElementById(id);if(e)e.value=t});
  ['desc-inp','monto-inp','deu-name','deu-total','deu-cuotas','deu-pagadas','deu-pagado','sav-name','sav-meta','sav-actual','inv-name','inv-entidad','inv-capital','inv-tasa','inv-meses','rec-name','rec-monto','rec-dia','rec-nota','custom-cat'].forEach(id=>{const e=document.getElementById(id);if(e)e.value=''});
  document.getElementById('deu-vence').value='1';
  if(document.getElementById('inv-preview'))document.getElementById('inv-preview').textContent='Completa los campos para ver la proyección.';
  setTipo(force||'ingreso');
}
function closeModal(){document.getElementById('modal').classList.remove('open')}

async function guardar(){
  if(currentTipo==='ahorro'){
    if(savType==='inversion'){
      const name=document.getElementById('inv-name').value.trim(),capital=pM(document.getElementById('inv-capital').value),tasa=parseFloat(document.getElementById('inv-tasa').value)||0,periodo=document.getElementById('inv-periodo').value,meses=parseInt(document.getElementById('inv-meses').value)||12,fecha=document.getElementById('inv-fecha').value,entidad=document.getElementById('inv-entidad').value.trim();
      if(!name||!capital||!tasa)return;
      const created=await POST('/api/inversiones',{name,entidad,capital,tasa,periodo,fecha,meses});
      inversiones.push({...created,historial:[{fecha,monto:capital,nota:'Apertura'}]});
      closeModal();renderSavings();
    } else {
      const name=document.getElementById('sav-name').value.trim(),meta=pM(document.getElementById('sav-meta').value),actual=pM(document.getElementById('sav-actual').value),fecha=document.getElementById('sav-fecha').value,ico=document.getElementById('sav-ico').value;
      if(!name||!meta)return;
      const created=await POST('/api/ahorros',{type:'meta',name,ico,meta,actual,fecha});
      const hist=actual>0?[{fecha:todayStr(),monto:actual,nota:'Saldo inicial'}]:[];
      savings.push({...created,historial:hist});
      closeModal();renderSavings();
    }
  } else if(currentTipo==='recurrente'){
    const name=document.getElementById('rec-name').value.trim(),monto=pM(document.getElementById('rec-monto').value),dia=parseInt(document.getElementById('rec-dia').value)||1,nota=document.getElementById('rec-nota').value.trim(),ico=document.getElementById('rec-ico').value;
    if(!name||!monto)return;
    const colors=['#1D9E75','#D85A30','#378ADD','#7F77DD','#EF9F27','#D4537E'];
    const color=colors[recurrentes.length%colors.length];
    const created=await POST('/api/recurrentes',{name,ico,color,monto,dia,nota});
    recurrentes.push({...created,historial:[]});
    closeModal();renderRecurrentes();renderNotifs();
  } else if(currentTipo==='deuda'){
    const name=document.getElementById('deu-name').value.trim(),total=pM(document.getElementById('deu-total').value),cuotas=parseInt(document.getElementById('deu-cuotas').value)||1,pagadas=parseInt(document.getElementById('deu-pagadas').value)||0,pagado=pM(document.getElementById('deu-pagado').value),fecha=document.getElementById('deu-fecha').value,vence=parseInt(document.getElementById('deu-vence').value)||1,ico=document.getElementById('deu-ico').value;
    if(!name||!total)return;
    const colors=['#378ADD','#7F77DD','#1D9E75','#D4537E','#EF9F27','#D85A30'];
    const color=colors[debts.length%colors.length];
    const created=await POST('/api/deudas',{name,ico,color,total,cuotas,pagadas,pagado,fecha,vence});
    const hist=pagado>0?[{fecha,monto:pagado,tipo:'normal',nota:'Saldo inicial'}]:[];
    debts.push({...created,historial:hist});
    closeModal();renderDebts();calcTotals();renderNotifs();
  } else {
    const desc=document.getElementById('desc-inp').value.trim(),monto=pM(document.getElementById('monto-inp').value),fecha=document.getElementById('fecha-inp').value;
    if(!desc||!monto)return;
    const cats=CATS[currentTipo]||CATS.ingreso;
    let info=cats.find(c=>c.key===selectedCat)||cats[0],catLabel=info.label,catKey=info.key;
    if(selectedCat==='personalizado'){const v=document.getElementById('custom-cat').value.trim();catLabel=v||'Otro';catKey='custom_'+catLabel}
    const created=await POST('/api/movimientos',{tipo:currentTipo,cat:catKey,cat_label:catLabel,cat_ico:info.ico,cat_color:info.color,desc,monto,fecha});
    txns.push(created);
    closeModal();renderTxns();calcTotals();renderBars();updateBarChart();
  }
}

// ── NAVEGACIÓN ─────────────────────────────────────────────────────────────────
function showTab(id,btn){
  document.querySelectorAll('.section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
  document.getElementById('tab-'+id).classList.add('active');
  btn.classList.add('active');
  document.getElementById('scroll-body').scrollTop=0;
}
function setPeriod(p,btn){
  document.querySelectorAll('#tab-notificaciones .chip').forEach(c=>c.classList.remove('sel'));
  btn.classList.add('sel');
}

// ── CONSEJOS ───────────────────────────────────────────────────────────────────
function openTips(){
  const{ing,gas,deu}=calcTotals();
  const recurTotal=recurrentes.reduce((s,r)=>s+r.monto,0),ratio=gas/(ing||1),tips=[];
  if(ratio>0.7)tips.push({cls:'w',title:'⚠️ Gastos elevados',text:`Usas el ${Math.round(ratio*100)}% de tus ingresos en gastos. Lo ideal es no superar el 70%.`});
  else tips.push({cls:'s',title:'✅ Buen control',text:`Solo usas el ${Math.round(ratio*100)}% de tus ingresos. ¡Muy bien!`});
  if(deu>0)tips.push({cls:'w',title:'💳 Deudas activas',text:`Tienes ${fmt(deu)} pendientes. Los abonos extra reducen tiempo e intereses.`});
  if(recurTotal>ing*0.2)tips.push({cls:'i',title:'🔁 Gastos fijos altos',text:`Tus fijos suman ${fmt(recurTotal)} (${Math.round(recurTotal/(ing||1)*100)}% de tus ingresos). Revisa si todos son necesarios.`});
  tips.push({cls:'n',title:'💡 Regla 50/30/20',text:'50% necesidades, 30% deseos, 20% ahorro e inversión. Los gastos fijos cuentan en necesidades y deseos.'});
  tips.push({cls:'i',title:'🏦 Maximiza el CDT',text:'Con 8% E.A., cada $1.000.000 extra en un CDT genera $80.000 al año sin riesgo.'});
  document.getElementById('tips-list').innerHTML=tips.map(t=>`<div class="tip-card ${t.cls}"><div style="font-weight:500;margin-bottom:2px">${t.title}</div>${t.text}</div>`).join('');
  document.getElementById('modal-tips').classList.add('open');
}
function closeTips(){document.getElementById('modal-tips').classList.remove('open')}

// ── CONFIGURACIÓN ──────────────────────────────────────────────────────────────
function openSettings(){buildTabChips();buildEmojiPicker();document.getElementById('modal-settings').classList.add('open')}
function closeSettings(){document.getElementById('modal-settings').classList.remove('open')}
function toggleDark(){
  darkMode=!darkMode;
  document.getElementById('toggle-dark').classList.toggle('on',darkMode);
  document.getElementById('app').style.filter=darkMode?'invert(1) hue-rotate(180deg)':'none';
}
function setLang(l){
  const lb={es:{resumen:'Resumen',movimientos:'Movimientos',deudas:'Deudas',ahorros:'Ahorros',recurrentes:'Fijos',notificaciones:'Alertas'},
             en:{resumen:'Summary',movimientos:'Transactions',deudas:'Debts',ahorros:'Savings',recurrentes:'Fixed',notificaciones:'Alerts'}};
  const t=lb[l]||lb.es;
  document.querySelectorAll('.tab-label').forEach((el,i)=>{if(TAB_IDS[i])el.textContent=t[TAB_IDS[i]]||el.textContent});
}
function setCurrency(c){
  currency=c;
  calcTotals();renderBars();renderTxns();renderDebts();renderSavings();renderHistorial();renderRecurrentes();renderNotifs();
  updateBarChart();
}
function buildTabChips(){
  document.getElementById('tab-chips').innerHTML=TAB_IDS.map(id=>`<button class="chip${editingTab===id?' sel':''}" id="tc-${id}" onclick="selectTabEdit('${id}',this)">${tabIcons[id]} ${TAB_NAMES[id]}</button>`).join('');
}
function selectTabEdit(id,btn){
  editingTab=id;
  document.querySelectorAll('#tab-chips .chip').forEach(c=>c.classList.remove('sel'));
  btn.classList.add('sel');
  document.getElementById('editing-tab-name').textContent=TAB_NAMES[id];
  buildEmojiPicker();
}
function buildEmojiPicker(){
  document.getElementById('emoji-picker').innerHTML=EMOJIS.map(e=>`<div class="ico-opt${tabIcons[editingTab]===e?' sel':''}" onclick="setTabIcon('${e}')">${e}</div>`).join('');
}
function setTabIcon(e){
  tabIcons[editingTab]=e;
  const el=document.getElementById('tabi-'+editingTab);
  if(el)el.textContent=e;
  buildEmojiPicker();buildTabChips();
}
function handleImgUpload(ev){
  const file=ev.target.files[0];if(!file)return;
  const reader=new FileReader();
  reader.onload=e=>{
    const img=new Image();
    img.onload=()=>{
      const c=document.createElement('canvas');c.width=32;c.height=32;
      const ctx=c.getContext('2d');const s=Math.min(img.width,img.height);
      ctx.drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,32,32);
      const url=c.toDataURL();
      const el=document.getElementById('tabi-'+editingTab);
      if(el){el.innerHTML='';const im=document.createElement('img');im.src=url;im.style.cssText='width:18px;height:18px;border-radius:3px;object-fit:cover';el.appendChild(im)}
    };img.src=e.target.result;
  };
  reader.readAsDataURL(file);ev.target.value='';
}

// ── GRÁFICA PRINCIPAL ──────────────────────────────────────────────────────────
function buildBarChart(){
  const isDark=matchMedia('(prefers-color-scheme:dark)').matches;
  const grid=isDark?'rgba(255,255,255,.08)':'rgba(0,0,0,.06)',txt=isDark?'#aaa':'#666';
  const{ing,gas}=calcTotals();
  if(barInst)barInst.destroy();
  barInst=new Chart(document.getElementById('barChart'),{
    type:'bar',
    data:{labels:['Ene','Feb','Mar','Abr','May'],datasets:[
      {label:'Ingresos',data:[3800000,4100000,3900000,4000000,ing],backgroundColor:'#1D9E75'},
      {label:'Gastos',data:[3100000,3400000,2900000,3200000,gas],backgroundColor:'#D85A30'}
    ]},
    options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>fmt(c.raw)}}},
      scales:{x:{ticks:{color:txt,font:{size:10}},grid:{color:grid}},y:{ticks:{color:txt,font:{size:10},callback:v=>'$'+(v/1000000).toFixed(1)+'M'},grid:{color:grid}}}}
  });
}
function updateBarChart(){
  if(!barInst)return;
  const{ing,gas}=calcTotals();
  barInst.data.datasets[0].data[4]=ing;barInst.data.datasets[1].data[4]=gas;barInst.update();
}

// ── INPUTS NUMÉRICOS ───────────────────────────────────────────────────────────
['monto-inp','deu-total','deu-pagado','sav-meta','sav-actual','inv-capital','rec-monto','edit-monto','sav-abono-monto'].forEach(id=>{
  const el=document.getElementById(id);if(el)el.addEventListener('input',()=>mi(el));
});
['inv-capital','inv-tasa','inv-periodo','inv-meses'].forEach(id=>{
  const el=document.getElementById(id);if(el)el.addEventListener('input',updateInvPreview);
});

// ── CERRAR MODALES AL HACER CLICK FUERA ───────────────────────────────────────
['modal','modal-edit','modal-det-edit','modal-sav-abono','modal-tips','modal-settings'].forEach(id=>{
  const el=document.getElementById(id);
  if(el)el.querySelector('.modal-overlay')?.addEventListener('click',()=>el.classList.remove('open'));
});

// ── INIT ───────────────────────────────────────────────────────────────────────
setTopbarDate();
loadAll();