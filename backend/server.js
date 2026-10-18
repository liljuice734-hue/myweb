const express = require('express');
const cors = require('cors');
const path = require('node:path');
require('dotenv').config({ path: path.join(__dirname, '.env'), quiet: true });
const db = require('./db');
const app = express();
app.disable('x-powered-by');
app.use(cors({ origin: process.env.CORS_ORIGIN === '*' || !process.env.CORS_ORIGIN ? '*' : process.env.CORS_ORIGIN.split(',').map(s => s.trim()) }));
app.use(express.json({ limit: '32kb' }));
const fields = ['owner_name','project_title','description','skill','status','project_year'];
function validate(req, res, next) {
  const b = req.body;
  if (!b || typeof b !== 'object' || Array.isArray(b)) return res.status(400).json({error:'Send a JSON object.'});
  const errors = {};
  for (const [key, max] of Object.entries({owner_name:120,project_title:150,description:2000,skill:100})) {
    if (typeof b[key] !== 'string' || !b[key].trim() || b[key].trim().length > max) errors[key] = `Required text, maximum ${max} characters.`;
  }
  if (!['Planned','In progress','Completed'].includes(b.status)) errors.status = 'Choose Planned, In progress, or Completed.';
  if (!Number.isInteger(b.project_year) || b.project_year < 2000 || b.project_year > 2100) errors.project_year = 'Enter an integer from 2000 to 2100.';
  if (Object.keys(errors).length) return res.status(400).json({error:'Validation failed.',fields:errors});
  req.values = fields.map(k => typeof b[k] === 'string' ? b[k].trim() : b[k]);
  next();
}
app.param('id', (req,res,next,value) => {
  if (!/^[1-9]\d*$/.test(value) || !Number.isSafeInteger(Number(value))) return res.status(400).json({error:'ID must be a positive integer.'});
  req.recordId = Number(value); next();
});
const one = id => db.prepare('SELECT * FROM portfolio WHERE id = ?').get(id);
app.get('/api/health', (req,res) => { db.prepare('SELECT 1').get(); res.json({status:'ok',database:'SQLite',resource:'portfolio'}); });
app.get('/api/portfolio', (req,res) => res.json(db.prepare('SELECT * FROM portfolio ORDER BY id DESC').all()));
app.get('/api/portfolio/:id', (req,res) => {
  const row = one(req.recordId);
  if (!row) return res.status(404).json({error:'Portfolio record not found.'});
  res.json(row);
});
app.post('/api/portfolio', validate, (req,res) => {
  const result = db.prepare(`INSERT INTO portfolio (${fields.join(',')}) VALUES (?,?,?,?,?,?)`).run(...req.values);
  const row = one(Number(result.lastInsertRowid));
  res.location(`/api/portfolio/${row.id}`).status(201).json(row);
});
app.put('/api/portfolio/:id', validate, (req,res) => {
  const result = db.prepare(`UPDATE portfolio SET ${fields.map(k => `${k}=?`).join(',')}, updated_at=strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id=?`).run(...req.values,req.recordId);
  if (!result.changes) return res.status(404).json({error:'Portfolio record not found.'});
  res.json(one(req.recordId));
});
app.delete('/api/portfolio/:id', (req,res) => {
  const result = db.prepare('DELETE FROM portfolio WHERE id=?').run(req.recordId);
  if (!result.changes) return res.status(404).json({error:'Portfolio record not found.'});
  res.json({message:'Portfolio record deleted.',id:req.recordId});
});
app.use('/api', (req,res) => res.status(404).json({error:'API endpoint not found.'}));
// Serve selected public files only; never expose .env, source code or database files.
const root = path.resolve(__dirname, '..');
app.use('/frontend', express.static(path.join(root,'frontend')));
for (const folder of ['css','js','images','videos','audios']) app.use(`/${folder}`,express.static(path.join(root,folder)));
app.get('/', (req,res) => res.sendFile(path.join(root,'index.html')));
app.get('/index.html', (req,res) => res.sendFile(path.join(root,'index.html')));
app.use((req,res) => res.status(404).json({error:'Page not found.'}));
app.use((err,req,res,next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({error:'Malformed JSON body.'});
  if (err.type === 'entity.too.large') return res.status(413).json({error:'Request body is too large.'});
  console.error(err.message);
  res.status(500).json({error:'Internal server error.'});
});
if (require.main === module) {
  const server = app.listen(process.env.PORT || 3000, '0.0.0.0', () => console.log(`Portfolio: http://localhost:${server.address().port}\nCRUD page: http://localhost:${server.address().port}/frontend/`));
  for (const signal of ['SIGINT','SIGTERM']) process.on(signal, () => server.close(() => { db.close(); process.exit(0); }));
}
module.exports = app;
