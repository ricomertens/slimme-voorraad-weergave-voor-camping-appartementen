const path = require('node:path');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const { openDatabase, productForApi } = require('./db');

function validUsername(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9._-]{3,50}$/.test(value);
}

function validProductName(value) {
  return typeof value === 'string' && value.trim().length >= 1 && value.trim().length <= 100;
}

function integerInRange(value, min = 0, max = 1_000_000) {
  return Number.isInteger(value) && value >= min && value <= max;
}

function createApp(options = {}) {
  const databasePath = options.databasePath || process.env.DATABASE_PATH || path.join(__dirname, '..', 'data', 'voorraad.db');
  const db = options.db || openDatabase(databasePath);
  const app = express();

  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.set({
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'",
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    });
    next();
  });
  app.use(express.json({ limit: '20kb' }));
  app.use(express.urlencoded({ extended: false }));
  app.use(session({
    name: 'voorraad.sid',
    secret: options.sessionSecret || process.env.SESSION_SECRET || 'alleen-voor-lokaal-ontwikkelen-wijzig-dit',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 8 * 60 * 60 * 1000,
    },
  }));

  function requireLogin(req, res, next) {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Je moet ingelogd zijn.' });
    }
    next();
  }

  app.get('/api/products', (req, res) => {
    const products = db.prepare('SELECT * FROM products ORDER BY name').all().map(productForApi);
    res.set('Cache-Control', 'no-store');
    res.json({ products });
  });

  app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body || {};
    if (!validUsername(username) || typeof password !== 'string' || password.length < 1 || password.length > 200) {
      return res.status(400).json({ error: 'Vul een geldige gebruikersnaam en wachtwoord in.' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
    const correct = user ? await bcrypt.compare(password, user.password_hash) : false;
    if (!correct) {
      return res.status(401).json({ error: 'Gebruikersnaam of wachtwoord is onjuist.' });
    }

    req.session.regenerate((error) => {
      if (error) return res.status(500).json({ error: 'Inloggen is tijdelijk niet mogelijk.' });
      req.session.userId = user.id;
      req.session.username = user.username;
      res.json({ user: { id: user.id, username: user.username } });
    });
  });

  app.get('/api/auth/status', (req, res) => {
    if (!req.session.userId) return res.status(401).json({ error: 'Je bent niet ingelogd.' });
    res.json({ user: { id: req.session.userId, username: req.session.username } });
  });

  app.post('/api/auth/logout', requireLogin, (req, res) => {
    req.session.destroy((error) => {
      if (error) return res.status(500).json({ error: 'Uitloggen is tijdelijk niet mogelijk.' });
      res.clearCookie('voorraad.sid');
      res.status(204).end();
    });
  });

  app.post('/api/products', requireLogin, (req, res) => {
    const { name, stock = 0, available = true } = req.body || {};
    if (!validProductName(name)) return res.status(400).json({ error: 'Productnaam moet 1 tot en met 100 tekens bevatten.' });
    if (!integerInRange(stock)) return res.status(400).json({ error: 'Voorraad moet een geheel getal tussen 0 en 1.000.000 zijn.' });
    if (typeof available !== 'boolean') return res.status(400).json({ error: 'Beschikbaarheid moet waar of onwaar zijn.' });

    try {
      const result = db.prepare('INSERT INTO products (name, stock, available) VALUES (?, ?, ?)')
        .run(name.trim(), stock, available ? 1 : 0);
      const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
      res.status(201).json({ product: productForApi(product) });
    } catch (error) {
      if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') return res.status(409).json({ error: 'Dit product bestaat al.' });
      throw error;
    }
  });

  app.patch('/api/products/:id/stock', requireLogin, (req, res) => {
    const id = Number(req.params.id);
    const { operation, amount } = req.body || {};
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'Ongeldig productnummer.' });
    if (!['increase', 'decrease', 'set'].includes(operation)) return res.status(400).json({ error: 'Kies increase, decrease of set.' });
    if (!integerInRange(amount)) return res.status(400).json({ error: 'Aantal moet een geheel getal tussen 0 en 1.000.000 zijn.' });

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!product) return res.status(404).json({ error: 'Product niet gevonden.' });

    let newStock = amount;
    if (operation === 'increase') newStock = product.stock + amount;
    if (operation === 'decrease') newStock = product.stock - amount;
    if (newStock < 0) return res.status(400).json({ error: 'Voorraad mag niet onder 0 komen.' });
    if (newStock > 1_000_000) return res.status(400).json({ error: 'Voorraad mag niet hoger zijn dan 1.000.000.' });

    db.prepare("UPDATE products SET stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(newStock, id);
    res.json({ product: productForApi(db.prepare('SELECT * FROM products WHERE id = ?').get(id)) });
  });

  app.patch('/api/products/:id/availability', requireLogin, (req, res) => {
    const id = Number(req.params.id);
    const { available } = req.body || {};
    if (!Number.isInteger(id) || id < 1) return res.status(400).json({ error: 'Ongeldig productnummer.' });
    if (typeof available !== 'boolean') return res.status(400).json({ error: 'Beschikbaarheid moet waar of onwaar zijn.' });
    const result = db.prepare("UPDATE products SET available = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
      .run(available ? 1 : 0, id);
    if (result.changes === 0) return res.status(404).json({ error: 'Product niet gevonden.' });
    res.json({ product: productForApi(db.prepare('SELECT * FROM products WHERE id = ?').get(id)) });
  });

  const publicDirectory = path.join(__dirname, '..', 'public');
  app.use(express.static(publicDirectory, { extensions: ['html'] }));
  app.get('/medewerker', (req, res) => res.sendFile(path.join(publicDirectory, 'admin.html')));

  app.use('/api', (req, res) => res.status(404).json({ error: 'API-endpoint niet gevonden.' }));
  app.use((error, req, res, next) => {
    if (error instanceof SyntaxError && 'body' in error) return res.status(400).json({ error: 'Ongeldige JSON.' });
    console.error(error);
    res.status(500).json({ error: 'Er ging iets mis op de server.' });
  });

  app.locals.db = db;
  return app;
}

module.exports = { createApp };
