const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
process.env.DB_PATH = ':memory:';
const app = require('../server');
const db = require('../db');
const server = app.listen(0,'127.0.0.1');
let base; before(async()=>{if(!server.listening)await new Promise(resolve=>server.once('listening',resolve));base=`http://127.0.0.1:${server.address().port}`;});
after(async()=>{await new Promise(resolve=>server.close(resolve));db.close();});
const body={owner_name:'William Kapinga',project_title:'API verification',description:'Temporary test record',skill:'Node.js',status:'Planned',project_year:2026};
const json = (method,data) => ({method,headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
test('one application table, six theme fields, timestamps and ten sample records',()=>{
  assert.deepEqual(db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'").all().map(r=>r.name),['portfolio']);
  assert.equal(db.prepare('SELECT count(*) AS n FROM portfolio').get().n,10);
  assert.equal(db.prepare('PRAGMA table_info(portfolio)').all().length,9);
});
test('all five CRUD endpoints return JSON and persist their changes',async()=>{
  let res=await fetch(`${base}/api/portfolio`,{headers:{Origin:'http://localhost:5500'}});
  assert.equal(res.status,200);assert.equal(res.headers.get('access-control-allow-origin'),'*');assert.equal((await res.json()).length,10);
  res=await fetch(`${base}/api/portfolio`,json('POST',body));assert.equal(res.status,201);
  const created=await res.json(); assert.ok(created.id>10);assert.ok(created.created_at);assert.ok(created.updated_at);
  res=await fetch(`${base}/api/portfolio/${created.id}`);assert.equal(res.status,200);assert.deepEqual(await res.json(),created);
  res=await fetch(`${base}/api/portfolio/${created.id}`,json('PUT',{...body,status:'Completed'}));assert.equal(res.status,200);assert.equal((await res.json()).status,'Completed');
  assert.equal(db.prepare('SELECT status FROM portfolio WHERE id=?').get(created.id).status,'Completed');
  res=await fetch(`${base}/api/portfolio/${created.id}`,{method:'DELETE'});assert.equal(res.status,200);assert.equal((await res.json()).id,created.id);
  assert.equal((await fetch(`${base}/api/portfolio/${created.id}`)).status,404);
});
test('rejects missing fields, bad types, invalid IDs and malformed JSON',async()=>{
  for(const invalid of [{},{...body,owner_name:'   '},{...body,project_year:'2026'},{...body,project_year:2026.5},{...body,status:'bad'},{...body,project_title:'x'.repeat(151)}]){
    const res=await fetch(`${base}/api/portfolio`,json('POST',invalid));assert.equal(res.status,400);assert.ok((await res.json()).error);
  }
  for(const id of ['abc','0','-1','1.5','9007199254740992'])assert.equal((await fetch(`${base}/api/portfolio/${id}`)).status,400);
  for(const method of ['GET','PUT','DELETE']){
    const res=await fetch(`${base}/api/portfolio/999999`,method==='PUT'?json('PUT',body):{method});assert.equal(res.status,404);assert.ok((await res.json()).error);
  }
  const res=await fetch(`${base}/api/portfolio`,{method:'POST',headers:{'Content-Type':'application/json'},body:'{'});assert.equal(res.status,400);assert.ok((await res.json()).error);
});
test('serves portfolio and CRUD page while keeping backend configuration private',async()=>{
  for(const url of ['/','/frontend/','/frontend/app.js','/frontend/styles.css'])assert.equal((await fetch(base+url)).status,200);
  for(const url of ['/backend/.env','/.env','/backend/data/portfolio.sqlite','/api/no-such-endpoint']){
    const res=await fetch(base+url);assert.equal(res.status,404);assert.ok((await res.json()).error);
  }
});

