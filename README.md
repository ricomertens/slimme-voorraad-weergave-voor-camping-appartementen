# Slimme voorraadweergave

Dit is een eenvoudige voorraadapp voor campingappartementen. Bezoekers zien op een openbare, zwart-witte pagina welke producten op voorraad zijn. Medewerkers kunnen na het inloggen producten toevoegen en de voorraad beheren. Producten en medewerkers worden blijvend opgeslagen in SQLite.

## Techniek

- Node.js en Express
- SQLite met `better-sqlite3`
- HTML, CSS en gewone JavaScript
- `bcrypt` voor wachtwoord-hashes
- `express-session` voor login-sessies
- Jest en Supertest voor de tests

## Installeren

Installeer eerst Node.js 20 of hoger. Open daarna een terminal in deze projectmap en voer uit:

```powershell
npm install
```

Kopieer voor normaal gebruik `.env.example` naar `.env` en vul een lang, willekeurig `SESSION_SECRET` in. Node leest een `.env`-bestand vanaf versie 20 met de volgende startopdracht:

```powershell
node --env-file=.env src/server.js
```

Voor een snelle lokale demonstratie kan ook gewoon `npm start` worden gebruikt. De applicatie gebruikt dan een ingebouwde ontwikkelwaarde voor het sessiegeheim. Gebruik die werkwijze niet op een publieke server.

## Medewerkeraccounts maken

Maak minimaal twee accounts. De opdracht vraagt gebruikersnaam en wachtwoord interactief. De wachtwoordinvoer blijft verborgen en het wachtwoord wordt met bcrypt gehasht voordat het in SQLite wordt opgeslagen.

```powershell
npm run create-user
npm run create-user
```

Een gebruikersnaam heeft 3 tot en met 50 tekens. Een wachtwoord heeft minimaal 8 tekens. Kies voor iedere medewerker een eigen, sterk wachtwoord. Wachtwoorden worden niet in de broncode of `.env` gezet.

## Starten

```powershell
npm start
```

Open daarna:

- Publieke voorraadpagina: http://localhost:3000
- Medewerkerbeheer: http://localhost:3000/medewerker

De publieke pagina ververst automatisch iedere 60 seconden. Stop de server met `Ctrl+C`.

## Tests uitvoeren

```powershell
npm test
```

De tests maken tijdelijke SQLite-databases aan en verwijderen die na afloop. De normale database in `data/voorraad.db` wordt niet gebruikt door de tests.

## Configuratie

De volgende omgevingsvariabelen zijn mogelijk:

| Variabele | Standaard | Betekenis |
| --- | --- | --- |
| `PORT` | `3000` | Poort van de webserver |
| `DATABASE_PATH` | `./data/voorraad.db` | Pad van het SQLite-bestand |
| `SESSION_SECRET` | ontwikkelwaarde | Geheim waarmee sessiecookies worden ondertekend |
| `NODE_ENV` | `development` | Gebruik `production` achter een HTTPS-verbinding |

## Projectstructuur

```text
public/             HTML, CSS en browser-JavaScript
scripts/            Script om medewerkeraccounts te maken
src/                Express-app, server en SQLite-laag
tests/              Jest- en Supertest-tests
docs/               Projectdocumentatie
data/                Plaats van de lokale SQLite-database
```

Databasebestanden, `.env`, `node_modules`, logs en testbestanden staan in `.gitignore` en horen niet in Git.

## API in het kort

| Methode en pad | Login | Functie |
| --- | --- | --- |
| `GET /api/products` | Nee | Voorraad bekijken |
| `POST /api/auth/login` | Nee | Inloggen |
| `GET /api/auth/status` | Ja | Huidige sessie bekijken |
| `POST /api/auth/logout` | Ja | Uitloggen |
| `POST /api/products` | Ja | Product toevoegen |
| `PATCH /api/products/:id/stock` | Ja | Voorraad verhogen, verlagen of instellen |
| `PATCH /api/products/:id/availability` | Ja | Beschikbaarheid aanpassen |

Meer uitleg staat in de map `docs`. Begin voor de beoordeling bij `docs/eisencheck.md`. Voor de presentatie en live demo is `docs/presentatie.md` direct bruikbaar.
