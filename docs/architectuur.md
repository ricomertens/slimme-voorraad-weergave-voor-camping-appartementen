# Architectuur

## Overzicht

De applicatie heeft drie eenvoudige lagen:

```text
Browser
  |-- publieke pagina -------- GET /api/products
  |-- medewerkerpagina ------- login en beveiligde wijzigingen
                                  |
                              Express-app
                                  |
                              SQLite-bestand
```

## Browserlaag

De map `public` bevat twee HTML-pagina's, één CSS-bestand en twee JavaScript-bestanden. Er wordt geen frontend-framework gebruikt. De browser vraagt JSON aan de API en bouwt daarmee de productkaarten.

De publieke pagina roept `GET /api/products` direct aan en daarna iedere 60 seconden opnieuw. De medewerkerpagina controleert eerst de sessiestatus.

## Serverlaag

`src/app.js` maakt de Express-app. Hier staan routes, validatie, sessiecontrole en foutafhandeling. `src/server.js` start de HTTP-server. Door deze scheiding kan Supertest de app testen zonder steeds een echte poort te openen.

## Datalaag

`src/db.js` opent SQLite, maakt ontbrekende tabellen aan en zet databaserijen om naar duidelijke API-objecten. De applicatie gebruikt voorbereide SQL-statements. Hierdoor worden waarden niet aan SQL-tekst vastgeplakt.

## Beveiligde route

Bij login vergelijkt bcrypt het ingevoerde wachtwoord met de hash. Na een geldige login bevat de serversessie het gebruikersnummer. De middleware `requireLogin` controleert dat nummer voordat een wijzigingsroute wordt uitgevoerd.

## Gelijktijdige wijzigingen

De SQLite-aanroepen en voorraadroute zijn synchroon. Binnen één Node-proces wordt een voorraadwijziging daardoor afgemaakt voordat de volgende wijziging wordt uitgevoerd. Voor meerdere serverprocessen is later een atomische SQL-update of transactie nodig. De volledige afweging staat in `docs/foutanalyse.md`.
