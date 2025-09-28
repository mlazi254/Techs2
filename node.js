// SYMOH Portfolio — Full site (photos + ideas)

// Project structure (folder: symoh-portfolio) // // symoh-portfolio/ // ├─ package.json // ├─ server.js // ├─ README.md // ├─ data/ // │  └─ ideas.json // ├─ public/ // │  ├─ css/ // │  │  └─ styles.css // │  ├─ uploads/ // │  └─ images/ // └─ views/ //    ├─ partials/ //    │  ├─ header.ejs //    │  └─ footer.ejs //    ├─ index.ejs //    ├─ gallery.ejs //    ├─ upload.ejs //    ├─ ideas.ejs //    └─ new-idea.ejs

/* -------------------- package.json -------------------- */ { "name": "symoh-portfolio", "version": "1.0.0", "description": "SYMOH portfolio for sharing photos and ideas", "main": "server.js", "scripts": { "start": "node server.js", "dev": "nodemon server.js" }, "author": "SYMOH", "license": "MIT", "dependencies": { "express": "^4.18.2", "ejs": "^3.1.9", "multer": "^1.4.5-lts.1", "body-parser": "^1.20.2", "shortid": "^2.2.16" }, "devDependencies": { "nodemon": "^2.0.22" } }

/* -------------------- server.js -------------------- */ const express = require('express'); const path = require('path'); const fs = require('fs'); const multer = require('multer'); const bodyParser = require('body-parser'); const shortid = require('shortid');

const app = express(); const PORT = process.env.PORT || 3000;

// Views app.set('view engine', 'ejs'); app.set('views', path.join(__dirname, 'views'));

// Static app.use('/public', express.static(path.join(__dirname, 'public'))); app.use(express.urlencoded({ extended: true })); app.use(bodyParser.json());

// Site data const site = { name: 'SYMOH', title: 'SYMOH — Photos & Ideas', tagline: 'Sharing photos, thoughts and small projects', description: "Welcome — I'm SYMOH. This is my space to share photos and ideas." };

const contact = { email: 'you@example.com', whatsapp: 'https://wa.me/254115490569' };

// Data paths const DATA_DIR = path.join(__dirname, 'data'); const IDEAS_FILE = path.join(DATA_DIR, 'ideas.json'); const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR); if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR); if (!fs.existsSync(IDEAS_FILE)) fs.writeFileSync(IDEAS_FILE, '[]');

// Multer setup for image uploads const storage = multer.diskStorage({ destination: function (req, file, cb) { cb(null, UPLOADS_DIR); }, filename: function (req, file, cb) { const id = shortid.generate(); const ext = path.extname(file.originalname); cb(null, ${id}${ext}); } }); const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit fileFilter: function (req, file, cb) { const allowed = /jpeg|jpg|png|gif/; const ext = allowed.test(path.extname(file.originalname).toLowerCase()); const mime = allowed.test(file.mimetype); if (ext && mime) return cb(null, true); cb(new Error('Only images are allowed (jpg, png, gif).')); } });

// Helpers function readIdeas() { try { const raw = fs.readFileSync(IDEAS_FILE, 'utf8'); return JSON.parse(raw); } catch (e) { return []; } } function writeIdeas(ideas) { fs.writeFileSync(IDEAS_FILE, JSON.stringify(ideas, null, 2)); }

// Routes app.get('/', (req, res) => { const uploads = fs.readdirSync(UPLOADS_DIR).filter(f => !f.startsWith('.')); const ideas = readIdeas(); res.render('index', { site, contact, uploads, ideas }); });

app.get('/gallery', (req, res) => { const uploads = fs.readdirSync(UPLOADS_DIR).filter(f => !f.startsWith('.')); res.render('gallery', { site, contact, uploads }); });

app.get('/upload', (req, res) => { res.render('upload', { site, contact, error: null }); });

app.post('/upload', upload.single('photo'), (req, res) => { if (!req.file) return res.render('upload', { site, contact, error: 'No file uploaded.' }); res.redirect('/gallery'); });

app.get('/ideas', (req, res) => { const ideas = readIdeas().sort((a,b)=> new Date(b.date)-new Date(a.date)); res.render('ideas', { site, contact, ideas }); });

app.get('/ideas/new', (req, res) => { res.render('new-idea', { site, contact, error: null, data: {} }); });

app.post('/ideas', (req, res) => { const { title, body, author } = req.body; if (!title || !body) return res.render('new-idea', { site, contact, error: 'Title and content required.', data: req.body }); const ideas = readIdeas(); const idea = { id: shortid.generate(), title, body, author: author || 'SYMOH', date: new Date().toISOString() }; ideas.push(idea); writeIdeas(ideas); res.redirect('/ideas'); });

app.get('/idea/:id', (req, res) => { const ideas = readIdeas(); const idea = ideas.find(i => i.id === req.params.id); if (!idea) return res.status(404).send('Not found'); res.render('idea', { site, contact, idea }); });

// API endpoints app.get('/api/ideas', (req,res)=>{ res.json(readIdeas()); });

app.listen(PORT, () => { console.log(${site.name} running on http://localhost:${PORT}); });

/* -------------------- views/partials/header.ejs -------------------- */

<!DOCTYPE html><html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title><%= site.title %></title>
  <link rel="stylesheet" href="/public/css/styles.css" />
  <meta name="description" content="<%= site.description %>" />
</head>
<body>
  <header class="site-header">
    <div class="container nav-row">
      <h1 class="logo"><a href="/"> <span class="logo-mark">SY</span>MOH</a></h1>
      <nav class="nav">
        <a href="/">Home</a>
        <a href="/gallery">Gallery</a>
        <a href="/ideas">Ideas</a>
        <a href="/upload">Upload</a>
      </nav>
      <a class="whatsapp-circle" href="<%= contact.whatsapp %>" target="_blank" title="Chat on WhatsApp">WA</a>
    </div>
  </header>/* -------------------- views/partials/footer.ejs -------------------- */

  <footer class="site-footer">
    <div class="container">
      <p>&copy; <%= new Date().getFullYear() %> <strong><%= site.name %></strong>. Built with ❤️.</p>
      <p class="small">Contact: <a href="mailto:<%= contact.email %>"><%= contact.email || 'you@example.com' %></a> • <a href="<%= contact.whatsapp %>">WhatsApp</a></p>
    </div>
  </footer>
</body>
</html>/* -------------------- views/index.ejs -------------------- */ <%- include('partials/header') %>

<main class="container">
  <section class="hero">
    <h2><%= site.tagline %></h2>
    <p class="lead"><%= site.description %></p>
    <p>
      <a class="btn" href="/gallery">View Gallery</a>
      <a class="btn btn-ghost" href="/ideas">Read Ideas</a>
    </p>
  </section>  <section class="preview grid">
    <div>
      <h3>Latest photos</h3>
      <div class="thumbs">
        <% uploads.slice(-6).reverse().forEach(function(f){ %>
          <a class="thumb" href="/public/uploads/<%= f %>" target="_blank"><img src="/public/uploads/<%= f %>" alt="photo"></a>
        <% }) %>
      </div>
      <p><a href="/gallery">See all photos</a></p>
    </div><div>
  <h3>Latest ideas</h3>
  <ul class="ideas-list">
    <% ideas.slice(0,5).forEach(function(i){ %>
      <li><a href="/idea/<%= i.id %>"><%= i.title %></a> <span class="small muted">— <%= i.author %></span></li>
    <% }) %>
  </ul>
  <p><a href="/ideas">Read all ideas</a></p>
</div>

  </section>
</main>
<%- include('partials/footer') %>/* -------------------- views/gallery.ejs -------------------- */ <%- include('partials/header') %>

<main class="container">
  <h2>Gallery</h2>
  <p class="muted">Click an image to view full size.</p>
  <div class="gallery-grid">
    <% uploads.reverse().forEach(function(f){ %>
      <a class="gallery-item" href="/public/uploads/<%= f %>" target="_blank"><img src="/public/uploads/<%= f %>" alt="photo"></a>
    <% }) %>
  </div>
</main>
<%- include('partials/footer') %>/* -------------------- views/upload.ejs -------------------- */ <%- include('partials/header') %>

<main class="container">
  <h2>Upload Photo</h2>
  <% if (error) { %>
    <p class="error"><%= error %></p>
  <% } %>
  <form action="/upload" method="post" enctype="multipart/form-data" class="form">
    <label>Choose photo (jpg, png, gif) — max 5MB</label>
    <input type="file" name="photo" accept="image/*" required />
    <button class="btn" type="submit">Upload</button>
  </form>
  <p class="muted">Photos are saved to <code>/public/uploads</code>.</p>
</main>
<%- include('partials/footer') %>/* -------------------- views/ideas.ejs -------------------- */ <%- include('partials/header') %>

<main class="container">
  <h2>Ideas & Notes</h2>
  <p><a class="btn" href="/ideas/new">Share a new idea</a></p>
  <% if (ideas.length===0) { %>
    <p class="muted">No ideas yet — share the first one!</p>
  <% } %>
  <ul class="idea-feed">
    <% ideas.forEach(function(i){ %>
      <li>
        <h4><a href="/idea/<%= i.id %>"><%= i.title %></a></h4>
        <p class="small muted">By <%= i.author %> • <%= new Date(i.date).toLocaleString() %></p>
        <p><%= i.body.length>200 ? i.body.substring(0,200)+'...' : i.body %></p>
      </li>
    <% }) %>
  </ul>
</main>
<%- include('partials/footer') %>/* -------------------- views/new-idea.ejs -------------------- */ <%- include('partials/header') %>

<main class="container">
  <h2>Share a new idea</h2>
  <% if (error) { %>
    <p class="error"><%= error %></p>
  <% } %>
  <form action="/ideas" method="post" class="form">
    <label>Title</label>
    <input type="text" name="title" value="<%= data.title||'' %>" required /><label>Your name (optional)</label>
<input type="text" name="author" value="<%= data.author||'' %>" />

<label>Content</label>
<textarea name="body" rows="8" required><%= data.body||'' %></textarea>

<button class="btn" type="submit">Publish</button>

  </form>
</main>
<%- include('partials/footer') %>/* -------------------- views/idea.ejs -------------------- */ <%- include('partials/header') %>

<main class="container">
  <article>
    <h2><%= idea.title %></h2>
    <p class="small muted">By <%= idea.author %> • <%= new Date(idea.date).toLocaleString() %></p>
    <div class="idea-body"><%= idea.body.replace(/
/g,'<br>') %></div>
  </article>
</main>
<%- include('partials/footer') %>/* -------------------- public/css/styles.css -------------------- */ :root{--bg:#0b0b0f;--card:#0f1720;--muted:#9aa4b2;--accent:#00bcd4} *{box-sizing:border-box} body{margin:0;font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial;background:var(--bg);color:#e6eef6} .container{max-width:1000px;margin:0 auto;padding:2rem} .site-header{border-bottom:1px solid rgba(255,255,255,0.03);padding:0.75rem 0} .nav-row{display:flex;align-items:center;gap:1rem} .logo a{color:#fff;text-decoration:none;font-weight:700} .logo-mark{background:var(--accent);color:#071018;padding:0.15rem 0.35rem;border-radius:4px;margin-right:6px} .nav{margin-left:auto} .nav a{color:var(--muted);text-decoration:none;margin-left:1rem} .whatsapp-circle{display:inline-block;padding:0.5rem 0.6rem;border-radius:999px;background:#25D366;color:#071018;font-weight:700;text-decoration:none;margin-left:1rem} .hero{padding:2rem 0} .lead{color:var(--muted);max-width:70ch} .btn{display:inline-block;padding:0.6rem 1rem;border-radius:8px;background:var(--accent);color:#071018;text-decoration:none;margin-right:0.5rem} .btn-ghost{background:transparent;border:1px solid rgba(255,255,255,0.06);color:var(--muted)} .grid{display:grid;grid-template-columns:1fr 1fr;gap:2rem} .thumbs{display:flex;flex-wrap:wrap;gap:0.5rem} .thumb img{width:120px;height:80px;object-fit:cover;border-radius:8px} .gallery-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1rem} .gallery-item img{width:100%;height:200px;object-fit:cover;border-radius:8px} .form{display:flex;flex-direction:column;gap:0.6rem;max-width:600px} input[type=file]{padding:0.3rem} label{font-weight:600} .muted{color:var(--muted)} .small{font-size:0.9rem;color:var(--muted)} .idea-feed{list-style:none;padding:0} .idea-feed li{background:var(--card);padding:1rem;border-radius:10px;margin-bottom:0.8rem} .error{color:#ff6b6b} .idea-body{background:var(--card);padding:1rem;border-radius:8px}

@media (max-width:900px){.grid{grid-template-columns:1fr}.logo-mark{display:inline-block}}

/* -------------------- data/ideas.json -------------------- */ []

/* -------------------- README.md -------------------- */

SYMOH Portfolio — Photos & Ideas

A simple Node.js + Express + EJS portfolio where you can share photos and short ideas/notes.

Features

Photo gallery with upload (stored in public/uploads).

Ideas/notes blog stored in data/ideas.json (simple, file-based).

Simple pages: Home, Gallery, Upload, Ideas, New Idea.

WhatsApp quick chat button linked to your number.


Quick start

1. Clone or create the folder and add these files.


2. Run npm install.


3. Start with npm start and open http://localhost:3000.



Notes

This starter uses the filesystem to store images and ideas. For production use, consider S3 (images) and a proper database for ideas.

Limit uploads to friendly sizes and add authentication if you don't want public uploads.


Enjoy!

