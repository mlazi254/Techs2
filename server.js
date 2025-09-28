// Install first: npm install express ejs
const express = require("express");
const app = express();

// Set view engine as EJS for dynamic HTML
app.set("view engine", "ejs");

// Serve static CSS and JS directly from code using middleware
app.get("/style.css", (req, res) => {
  res.type("text/css");
  res.send(`
    body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background: #000;
        color: #fff;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        background: radial-gradient(circle, #111 0%, #000 100%);
    }
    .container {
        padding: 20px;
        border-radius: 15px;
        background: rgba(255, 255, 255, 0.05);
        box-shadow: 0 0 20px #0ff;
    }
    h1 {
        color: #0ff;
        font-size: 2.5em;
        margin-bottom: 10px;
    }
    .contact-buttons {
        margin-top: 20px;
    }
    .btn {
        display: inline-block;
        margin: 10px;
        padding: 12px 25px;
        border: none;
        background: #0ff;
        color: #000;
        font-weight: bold;
        border-radius: 8px;
        text-decoration: none;
        box-shadow: 0 0 10px #0ff;
        transition: 0.3s;
    }
    .btn:hover {
        background: #00ffaa;
        box-shadow: 0 0 20px #00ffaa;
    }
  `);
});

app.get("/script.js", (req, res) => {
  res.type("application/javascript");
  res.send(`console.log("SYMOH Tech website loaded successfully!");`);
});

// Home route
app.get("/", (req, res) => {
  const contacts = [
    { name: "WhatsApp", link: "https://wa.me/254115490569" },
    { name: "Email", link: "mailto:chege2218@gmail.com" },
    { name: "Call", link: "tel:+254115490569" }
  ];

  // Inline HTML template
  const template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SYMOH Tech Contacts</title>
      <link rel="stylesheet" href="/style.css">
  </head>
  <body>
      <div class="container">
          <h1>SYMOH Tech</h1>
          <h2>Connect with us</h2>
          <div class="contact-buttons">
              ${contacts.map(c => `<a href="${c.link}" class="btn" target="_blank">${c.name}</a>`).join('')}
          </div>
      </div>
      <script src="/script.js"></script>
  </body>
  </html>
  `;
  res.send(template);
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`SYMOH Tech running on http://localhost:${PORT}`);
});