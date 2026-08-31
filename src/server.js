const { createApp } = require('./app');

const port = Number(process.env.PORT) || 3000;
const app = createApp();

const server = app.listen(port, () => {
  console.log(`Voorraadapp draait op http://localhost:${port}`);
  console.log(`Medewerkerbeheer: http://localhost:${port}/medewerker`);
});

function shutdown() {
  server.close(() => {
    app.locals.db.close();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

