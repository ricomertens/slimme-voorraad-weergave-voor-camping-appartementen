# Foutanalyse

De bronopdracht noemt situaties die mis kunnen gaan. Niet iedere storing hoeft volledig opgelost te worden, maar er moet wel bewust over nagedacht zijn.

| Situatie | Huidig gedrag | Waarom / mogelijke verbetering |
| --- | --- | --- |
| Twee medewerkers verkopen tegelijk | Express verwerkt iedere synchrone SQLite-wijziging volledig voordat de volgende wijziging wordt uitgevoerd. Twee keer `-1` geeft daardoor samen `-2`. | Bij meerdere Node-servers is een atomair SQL-statement of transactie nodig. |
| Iemand voert `-1` in | De API geeft HTTP 400. SQLite heeft ook `CHECK (stock >= 0)`. | De dubbele controle beschermt zowel API als database. |
| Een medewerker voert tekst of decimalen in | De browser gebruikt een numeriek veld en de server accepteert alleen gehele getallen. | Servervalidatie blijft nodig omdat browservalidatie omzeild kan worden. |
| Onbekende gebruiker wijzigt voorraad | `requireLogin` geeft HTTP 401 en voert geen SQL-wijziging uit. | Login-rate-limiting kan later worden toegevoegd. |
| Product bestaat niet | De API geeft HTTP 404 met `Product niet gevonden.` | De beheerpagina toont de melding aan de medewerker. |
| Internet valt weg op de telefoon | De aanvraag mislukt en de pagina toont een fout. Een vorige productlijst blijft staan. | Een offline wachtrij is bewust geen minimale eis, omdat dubbele wijzigingen risico geven. |
| E-inkscherm heeft geen verbinding | De laatst geladen voorraad blijft zichtbaar en er verschijnt een foutmelding met `Bijwerken mislukt`. | Een opvallend `laatst bijgewerkt`-tijdstip maakt verouderde gegevens herkenbaar. |
| Publieke pagina opent terwijl server offline is | De pagina kan niet vanaf deze server worden geladen. Als de HTML al open stond, mislukt alleen de API-aanvraag. | Voor hogere beschikbaarheid zijn hosting, monitoring en caching nodig. |
| Databasebestand is niet bereikbaar | De server start niet of een databasefout wordt intern gelogd. De gebruiker krijgt geen technische details. | Productiehosting hoort schrijfrechten, vrije schijfruimte, monitoring en back-ups te controleren. |
| Server stopt tijdens gebruik | Producten, gebruikers en voorraad staan in SQLite en blijven behouden. Sessies uit MemoryStore verdwijnen. | Opnieuw inloggen is acceptabel voor het prototype; productie gebruikt een blijvende sessiestore. |
| Ongeldige of kapotte JSON | De API geeft HTTP 400 met `Ongeldige JSON.` | De server stopt niet door deze gebruikersfout. |

## Bewuste keuze bij offline wijzigingen

Een telefoon zou wijzigingen lokaal kunnen bewaren, maar dan kunnen twee telefoons later tegenstrijdige aantallen doorsturen. Voor deze voorraad is een duidelijke foutmelding veiliger dan stilletjes een mogelijk verkeerde wijziging bewaren. De medewerker probeert de actie opnieuw zodra de verbinding terug is.

## Bewuste keuze bij gelijktijdigheid

`better-sqlite3` werkt synchroon en de voorraadroute bevat geen `await` tussen lezen en schrijven. Binnen deze ene Node-server kan een andere aanvraag daar dus niet tussendoor komen. Voor schaalvergroting naar meerdere serverprocessen moet de bewerking veranderen naar een SQL-update met een voorwaarde, bijvoorbeeld alleen verlagen als `stock >= amount`.
