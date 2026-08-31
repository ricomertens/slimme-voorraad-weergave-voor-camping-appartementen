# Technische keuzes

## Node.js en Express

Express past bij een kleine REST-API en heeft weinig opstartcode. De app gebruikt CommonJS, zodat de structuur voor een MBO-project herkenbaar blijft.

## SQLite en better-sqlite3

SQLite bewaart alles in één bestand en heeft geen losse databaseserver nodig. `better-sqlite3` biedt korte, voorbereide statements en transactieve databasebewerkingen. De database wordt automatisch aangemaakt in `data/voorraad.db`.

## HTML, CSS en JavaScript

Er is geen framework zoals React nodig. Twee kleine pagina's kunnen rechtstreeks met browser-JavaScript worden opgebouwd. Dat vermindert afhankelijkheden en maakt de werking makkelijker uit te leggen.

## bcrypt

Wachtwoorden worden met bcrypt en cost factor 12 opgeslagen. De tests gebruiken een lagere cost factor om snel te blijven. Alleen de hash gaat naar de tabel `users`.

## express-session

Na login krijgt de browser een cookie met alleen een sessie-id. De cookie is `httpOnly` en `sameSite=strict`. De standaard MemoryStore is bewust gekozen voor deze eenvoudige demonstratie met één server. Bij meerdere servers of een echte productieomgeving hoort een blijvende sessiestore, bijvoorbeeld SQLite of Redis.

## Jest en Supertest

Jest voert de verwachtingen uit. Supertest roept Express-routes aan zonder een apart serverproces. Iedere API-test krijgt een eigen tijdelijke SQLite-database.

## Hostingkeuze

Voor het prototype draait de app lokaal met `npm start`. Daardoor kan de demonstratie zonder cloudaccount of extra kosten worden uitgevoerd. In echt gebruik kan dezelfde Node-app achter HTTPS op één kleine VPS of lokale receptiecomputer draaien. De SQLite-database past bij één server. Bij meerdere servers hoort een centrale database zoals PostgreSQL en een gedeelde sessiestore.

## Afgewogen alternatieven

- Browseropslag is afgewezen, omdat telefoons en het e-inkscherm dan niet dezelfde voorraad delen.
- React of Vue is niet nodig voor twee kleine schermen en zou meer bouwstappen toevoegen.
- PostgreSQL is sterker bij meerdere servers, maar vraagt voor dit prototype onnodig extra beheer.
- Een gewone LCD-monitor ververst sneller, maar gebruikt continu stroom en sluit minder goed aan op de e-inkonderzoeksvraag.
