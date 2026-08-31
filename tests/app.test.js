const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const request = require('supertest');
const bcrypt = require('bcrypt');
const { createApp } = require('../src/app');
const { openDatabase } = require('../src/db');

describe('Voorraadapp API', () => {
  let tempDirectory;
  let databasePath;
  let app;
  let agent;

  beforeEach(() => {
    tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'voorraadapp-'));
    databasePath = path.join(tempDirectory, 'test.db');
    app = createApp({ databasePath, sessionSecret: 'test-geheim-dat-lang-genoeg-is' });
    app.locals.db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
      .run('medewerker1', bcrypt.hashSync('VeiligWachtwoord1!', 4));
    app.locals.db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')
      .run('medewerker2', bcrypt.hashSync('VeiligWachtwoord2!', 4));
    agent = request.agent(app);
  });

  afterEach(() => {
    app.locals.db.close();
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  });

  async function login() {
    return agent.post('/api/auth/login').send({ username: 'medewerker1', password: 'VeiligWachtwoord1!' });
  }

  function insertProduct(name = 'Toiletpapier', stock = 5, available = 1) {
    const result = app.locals.db.prepare('INSERT INTO products (name, stock, available) VALUES (?, ?, ?)')
      .run(name, stock, available);
    return Number(result.lastInsertRowid);
  }

  test('publieke voorraad is zonder login te bekijken', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body.products).toEqual([]);
  });

  test('publieke voorraad toont naam, aantal en status', async () => {
    insertProduct('Handdoek', 3);
    const response = await request(app).get('/api/products');
    expect(response.body.products[0]).toMatchObject({ name: 'Handdoek', stock: 3, available: true, status: 'Beschikbaar' });
  });

  test('voorraad nul geeft status Uitverkocht', async () => {
    insertProduct('Zeep', 0);
    const response = await request(app).get('/api/products');
    expect(response.body.products[0].status).toBe('Uitverkocht');
  });

  test('uitgeschakeld product geeft status Niet beschikbaar', async () => {
    insertProduct('Koffie', 9, 0);
    const response = await request(app).get('/api/products');
    expect(response.body.products[0].status).toBe('Niet beschikbaar');
  });

  test('correcte login werkt', async () => {
    const response = await login();
    expect(response.status).toBe(200);
    expect(response.body.user.username).toBe('medewerker1');
  });

  test('verkeerd wachtwoord wordt geweigerd', async () => {
    const response = await agent.post('/api/auth/login').send({ username: 'medewerker1', password: 'verkeerd' });
    expect(response.status).toBe(401);
  });

  test('onbekende gebruiker wordt geweigerd', async () => {
    const response = await agent.post('/api/auth/login').send({ username: 'niemand', password: 'wachtwoord' });
    expect(response.status).toBe(401);
  });

  test('ongeldige logininvoer geeft 400', async () => {
    const response = await agent.post('/api/auth/login').send({ username: 'x', password: '' });
    expect(response.status).toBe(400);
  });

  test('ingelogde sessiestatus bevat de gebruiker', async () => {
    await login();
    const response = await agent.get('/api/auth/status');
    expect(response.status).toBe(200);
    expect(response.body.user.username).toBe('medewerker1');
  });

  test('niet-ingelogde sessiestatus wordt geweigerd', async () => {
    expect((await request(app).get('/api/auth/status')).status).toBe(401);
  });

  test('uitloggen beëindigt de sessie', async () => {
    await login();
    expect((await agent.post('/api/auth/logout')).status).toBe(204);
    expect((await agent.get('/api/auth/status')).status).toBe(401);
  });

  test('niet-ingelogde gebruiker mag geen product toevoegen', async () => {
    const response = await request(app).post('/api/products').send({ name: 'Thee', stock: 2, available: true });
    expect(response.status).toBe(401);
  });

  test('niet-ingelogde gebruiker mag voorraad niet wijzigen', async () => {
    const id = insertProduct();
    const response = await request(app).patch(`/api/products/${id}/stock`).send({ operation: 'increase', amount: 1 });
    expect(response.status).toBe(401);
  });

  test('niet-ingelogde gebruiker mag beschikbaarheid niet wijzigen', async () => {
    const id = insertProduct();
    const response = await request(app).patch(`/api/products/${id}/availability`).send({ available: false });
    expect(response.status).toBe(401);
  });

  test('ingelogde medewerker kan product toevoegen', async () => {
    await login();
    const response = await agent.post('/api/products').send({ name: 'Afwasmiddel', stock: 4, available: true });
    expect(response.status).toBe(201);
    expect(response.body.product).toMatchObject({ name: 'Afwasmiddel', stock: 4 });
  });

  test('nieuw product krijgt standaard voorraad nul', async () => {
    await login();
    const response = await agent.post('/api/products').send({ name: 'Spons' });
    expect(response.status).toBe(201);
    expect(response.body.product.stock).toBe(0);
  });

  test('dubbele productnaam wordt geweigerd', async () => {
    insertProduct('Melk');
    await login();
    const response = await agent.post('/api/products').send({ name: 'melk', stock: 1, available: true });
    expect(response.status).toBe(409);
  });

  test('lege productnaam wordt geweigerd', async () => {
    await login();
    expect((await agent.post('/api/products').send({ name: '   ', stock: 1, available: true })).status).toBe(400);
  });

  test('negatieve beginvoorraad wordt geweigerd', async () => {
    await login();
    expect((await agent.post('/api/products').send({ name: 'Emmer', stock: -1, available: true })).status).toBe(400);
  });

  test('voorraad met decimalen wordt geweigerd', async () => {
    await login();
    expect((await agent.post('/api/products').send({ name: 'Emmer', stock: 1.5, available: true })).status).toBe(400);
  });

  test('beschikbaarheid als tekst wordt geweigerd', async () => {
    await login();
    expect((await agent.post('/api/products').send({ name: 'Emmer', stock: 1, available: 'ja' })).status).toBe(400);
  });

  test('voorraad verhogen werkt', async () => {
    const id = insertProduct('Water', 5);
    await login();
    const response = await agent.patch(`/api/products/${id}/stock`).send({ operation: 'increase', amount: 3 });
    expect(response.body.product.stock).toBe(8);
  });

  test('voorraad verlagen werkt', async () => {
    const id = insertProduct('Water', 5);
    await login();
    const response = await agent.patch(`/api/products/${id}/stock`).send({ operation: 'decrease', amount: 2 });
    expect(response.body.product.stock).toBe(3);
  });

  test('voorraad direct op nul instellen werkt', async () => {
    const id = insertProduct('Water', 5);
    await login();
    const response = await agent.patch(`/api/products/${id}/stock`).send({ operation: 'set', amount: 0 });
    expect(response.body.product).toMatchObject({ stock: 0, status: 'Uitverkocht' });
  });

  test('voorraad onder nul wordt geweigerd en blijft gelijk', async () => {
    const id = insertProduct('Water', 2);
    await login();
    const response = await agent.patch(`/api/products/${id}/stock`).send({ operation: 'decrease', amount: 3 });
    expect(response.status).toBe(400);
    expect(app.locals.db.prepare('SELECT stock FROM products WHERE id = ?').get(id).stock).toBe(2);
  });

  test('twee bijna gelijktijdige verkopen worden allebei verwerkt', async () => {
    const id = insertProduct('Water', 2);
    await login();
    const [first, second] = await Promise.all([
      agent.patch(`/api/products/${id}/stock`).send({ operation: 'decrease', amount: 1 }),
      agent.patch(`/api/products/${id}/stock`).send({ operation: 'decrease', amount: 1 }),
    ]);
    expect([first.status, second.status]).toEqual([200, 200]);
    expect(app.locals.db.prepare('SELECT stock FROM products WHERE id = ?').get(id).stock).toBe(0);
  });

  test('SQLite weigert negatieve voorraad ook buiten de API', () => {
    expect(() => insertProduct('Onmogelijk', -1)).toThrow();
  });

  test('onbekend product wijzigen geeft 404', async () => {
    await login();
    expect((await agent.patch('/api/products/99999/stock').send({ operation: 'set', amount: 1 })).status).toBe(404);
  });

  test('onbekende voorraadbewerking wordt geweigerd', async () => {
    const id = insertProduct();
    await login();
    expect((await agent.patch(`/api/products/${id}/stock`).send({ operation: 'multiply', amount: 2 })).status).toBe(400);
  });

  test('negatief aantal bij voorraadbewerking wordt geweigerd', async () => {
    const id = insertProduct();
    await login();
    expect((await agent.patch(`/api/products/${id}/stock`).send({ operation: 'increase', amount: -1 })).status).toBe(400);
  });

  test('medewerker kan product niet beschikbaar zetten', async () => {
    const id = insertProduct();
    await login();
    const response = await agent.patch(`/api/products/${id}/availability`).send({ available: false });
    expect(response.body.product).toMatchObject({ available: false, status: 'Niet beschikbaar' });
  });

  test('onbekend product bij beschikbaarheid geeft 404', async () => {
    await login();
    expect((await agent.patch('/api/products/99999/availability').send({ available: false })).status).toBe(404);
  });

  test('ongeldige JSON geeft correcte foutmelding', async () => {
    const response = await request(app).post('/api/auth/login').set('Content-Type', 'application/json').send('{ kapot');
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Ongeldige JSON.');
  });

  test('onbekend API-endpoint geeft JSON 404', async () => {
    const response = await request(app).get('/api/bestaat-niet');
    expect(response.status).toBe(404);
    expect(response.body.error).toBe('API-endpoint niet gevonden.');
  });

  test('publieke pagina en medewerkerpagina worden geleverd', async () => {
    expect((await request(app).get('/')).status).toBe(200);
    expect((await request(app).get('/medewerker')).status).toBe(200);
  });

  test('publieke browsercode vernieuwt iedere 60 seconden', () => {
    const browserCode = fs.readFileSync(path.join(__dirname, '..', 'public', 'public.js'), 'utf8');
    expect(browserCode).toContain('setInterval(loadProducts, 60_000)');
  });

  test('er kunnen minimaal twee medewerkeraccounts bestaan zonder platte wachtwoorden', () => {
    const users = app.locals.db.prepare('SELECT * FROM users ORDER BY username').all();
    expect(users).toHaveLength(2);
    expect(users.every((user) => user.password_hash.startsWith('$2'))).toBe(true);
    expect(users.some((user) => user.password_hash.includes('VeiligWachtwoord'))).toBe(false);
  });
});

describe('Databasepersistentie', () => {
  test('producten en voorraad blijven behouden na opnieuw openen', () => {
    const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), 'voorraad-persistentie-'));
    const databasePath = path.join(tempDirectory, 'persistent.db');
    const first = openDatabase(databasePath);
    first.prepare('INSERT INTO products (name, stock, available) VALUES (?, ?, ?)').run('Dekbed', 17, 1);
    first.close();

    const second = openDatabase(databasePath);
    const product = second.prepare('SELECT name, stock FROM products').get();
    expect(product).toEqual({ name: 'Dekbed', stock: 17 });
    second.close();
    fs.rmSync(tempDirectory, { recursive: true, force: true });
  });
});
