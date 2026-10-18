'use strict';
// Same-origin requests work locally and when hosted together in the cloud.
const API = '/api/portfolio';
const form = document.querySelector('#record-form');
const tbody = document.querySelector('#records');
const feedback = document.querySelector('#feedback');
let editingId = null;
let busy = false;
function announce(message, error=false) { feedback.textContent=message; feedback.dataset.error=String(error); }
async function request(url, options={}) {
  const response = await fetch(url, options);
  const data = await response.json();
  if (!response.ok) throw new Error([data.error,...Object.values(data.fields || {})].join(' '));
  return data;
}
function resetForm() {
  editingId=null; form.reset(); document.querySelector('#form-title').textContent='Add a record';
  document.querySelector('#save').textContent='Add record'; document.querySelector('#cancel').hidden=true;
}
function lock(value) { busy=value; document.querySelectorAll('button').forEach(b => b.disabled=value); }
async function loadRecords() {
  const rows=await request(API); tbody.replaceChildren();
  for (const row of rows) {
    const tr=document.createElement('tr');
    for (const key of ['id','owner_name','project_title','description','skill','status','project_year','created_at','updated_at']) {
      const cell=document.createElement('td'); cell.textContent=row[key]; tr.append(cell);
    }
    const actions=document.createElement('td');
    for (const action of ['Edit','Delete']) {
      const button=document.createElement('button'); button.type='button'; button.textContent=action;
      button.dataset.id=row.id; button.dataset.action=action; button.setAttribute('aria-label',`${action} ${row.project_title}`); actions.append(button);
    }
    tr.append(actions); tbody.append(tr);
  }
  document.querySelector('#count').textContent=`(${rows.length})`; document.querySelector('#empty').hidden=rows.length!==0;
}
form.addEventListener('submit',async event => {
  event.preventDefault(); if(busy) return;
  const body=Object.fromEntries(new FormData(form));
  for(const key of ['owner_name','project_title','description','skill']) body[key]=body[key].trim();
  body.project_year=Number(body.project_year);
  lock(true);
  try {
    const update=editingId!==null;
    await request(update ? `${API}/${editingId}` : API,{method:update?'PUT':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    resetForm();
    try { await loadRecords(); announce(update?'Record updated.':'Record created.'); }
    catch(error) { announce(`Record saved, but refresh failed: ${error.message}. Use Refresh to reload.`,true); }
  } catch(error) { announce(error.message,true); }
  finally { lock(false); }
});
tbody.addEventListener('click',async event => {
  const button=event.target.closest('button'); if(!button || busy) return;
  const id=button.dataset.id;
  if(button.dataset.action==='Delete' && !confirm('Delete this portfolio record?')) return;
  lock(true);
  try {
    if(button.dataset.action==='Edit') {
      const row=await request(`${API}/${id}`);
      for(const key of ['owner_name','project_title','description','skill','status','project_year']) form.elements[key].value=row[key];
      editingId=row.id; document.querySelector('#form-title').textContent=`Edit record #${row.id}`;
      document.querySelector('#save').textContent='Save changes'; document.querySelector('#cancel').hidden=false;
      form.elements.project_title.focus(); form.scrollIntoView({behavior:'smooth'}); announce(`Editing record #${row.id}.`);
    } else {
      await request(`${API}/${id}`,{method:'DELETE'}); if(editingId===Number(id)) resetForm();
      try { await loadRecords(); announce('Record deleted.'); }
      catch(error) { announce(`Record deleted, but refresh failed: ${error.message}. Use Refresh to reload.`,true); }
    }
  } catch(error) { announce(error.message,true); }
  finally { lock(false); }
});
document.querySelector('#cancel').addEventListener('click',()=>{resetForm();announce('Edit cancelled.');});
async function refresh() { if(busy)return; lock(true); try{await loadRecords();announce('Records loaded.');}catch(error){announce(`Could not load records: ${error.message}. Start the Node.js server and open this page through it.`,true);}finally{lock(false);} }
document.querySelector('#refresh').addEventListener('click',refresh);
refresh();
