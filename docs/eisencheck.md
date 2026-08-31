# Eisencheck bronopdracht

Deze lijst koppelt de echte PDF aan het opgeleverde project.

| PDF-onderdeel | Status | Bewijs |
| --- | --- | --- |
| Publiek: naam, voorraad, status | Gereed | `public/index.html`, `public/public.js` |
| Op afstand en e-inkvriendelijk | Gereed | `public/styles.css`, `docs/eink-onderzoek.md` |
| Mobiel verhogen/verlagen/instellen | Gereed | `public/admin.html`, `public/admin.js` |
| Producten aanmaken en meerdere beheren | Gereed | `POST /api/products` en beheerpagina |
| Tijdelijk niet beschikbaar | Gereed | availability-endpoint en statusknop |
| Minimaal twee medewerkers | Gereed | accountscript en accounttests |
| Login en beveiligde toegang | Gereed | bcrypt, sessie en `requireLogin` |
| Iedere 60 seconden vernieuwen | Gereed | `setInterval(loadProducts, 60_000)` |
| Publiek mag niets wijzigen | Gereed | alleen publieke GET-route; mutaties geven zonder login 401 |
| API ophalen en wijzigen | Gereed | Express-routes in `src/app.js` |
| Fouten en invoervalidatie | Gereed | API-foutcodes, tests en `docs/foutanalyse.md` |
| Persistente database | Gereed | SQLite-bestand en herstarttest |
| Securityonderzoek | Gereed | `docs/securityanalyse.md` |
| Wireframes | Gereed | `docs/wireframes.md` |
| E-inkonderzoek alle onderwerpen | Gereed | `docs/eink-onderzoek.md` |
| Minimaal 15 tests + 10 zelf | Gereed | meer dan 25 tests in `tests/app.test.js` |
| Technische documentatie | Gereed | volledige map `docs` |
| Persoonlijk AI-logboek | Gereed | `docs/ai-logboek.md` |
| Kritisch AI-gebruik | Gereed | `docs/ai-verantwoording.md` en presentatie |
| Presentatie en demonstratie | Gereed als draaiboek | `docs/presentatie.md` |

## Bonusopdrachten

Hoofdstuk 22 noemt voorraadmutaties, automatische voorraadniveaus, meerdere locaties, uitgebreid offlinegedrag, echte hardware en wijzigingsgeschiedenis als bonus. Deze onderdelen zijn niet nodig voor de minimale oplevering en zijn bewust niet toegevoegd. Zo blijft de technische stack eenvoudig zoals gevraagd.
