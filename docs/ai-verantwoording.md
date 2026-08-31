# AI-verantwoording

## Gebruikte AI-tool

OpenAI Codex is gebruikt als programmeerpartner. AI hielp bij het opdelen van de opdracht, de projectstructuur, API-routes, SQLite-tabellen, browsercode, tests, foutanalyse en documentatie.

## Belangrijke adviezen van AI

- Gebruik één centrale SQLite-database in plaats van browseropslag.
- Scheid `src/app.js` en `src/server.js`, zodat Supertest de Express-app zonder echte poort kan testen.
- Controleer login niet alleen in de pagina, maar op iedere beveiligde API-route.
- Bescherm voorraad dubbel: validatie in Express en `CHECK (stock >= 0)` in SQLite.
- Gebruik gewone HTML/CSS/JavaScript voor een eenvoudige e-readerbrowser.
- Toon een tekststatus en een update-tijdstip, zodat kleur en een perfecte verbinding niet nodig zijn.

## Zelf beoordeelde keuzes

Browseropslag is afgewezen, omdat twee telefoons en het publieke scherm anders verschillende gegevens zouden hebben. SQLite past bij één kleine server en blijft bestaan na een herstart. PostgreSQL is pas nodig als meerdere serverprocessen dezelfde database moeten delen.

Een frontend-framework is ook afgewezen. Twee kleine pagina's zijn met gewone JavaScript overzichtelijker en hebben minder onderdelen die op een eenvoudige e-readerbrowser kunnen mislukken.

## Foute of onvolledige AI-uitvoer

### Bron-PDF ontbrak eerst

AI meldde dat `opdracht.pdf` leeg was. Dat was technisch correct voor het bestand in de werkmap, maar daardoor waren extra eisen zoals wireframes, uitgebreid foutonderzoek en de presentatie nog niet verwerkt. Nadat de echte PDF was aangeleverd, zijn alle 11 pagina's opnieuw tekstueel en visueel gecontroleerd en zijn de ontbrekende onderdelen toegevoegd.

### Wachtwoordinvoer was eerst zichtbaar

Het eerste accountscript hasht het wachtwoord veilig, maar de tekst was tijdens het typen nog zichtbaar in de terminal. Dit werd tijdens de handmatige demonstratiecontrole ontdekt. Het script is aangepast en opnieuw getest; wachtwoordinvoer blijft nu verborgen.

### Eerste oplossing voor verborgen invoer werkte niet

De eerste correctie gebruikte een interne functie die niet bestond op de Promise-variant van `readline`. De fout verscheen direct tijdens een echte accountaanmaak. Daarna is de gewone `readline`-interface met een eigen Promise-helper gebruikt en opnieuw handmatig getest.

### E-inkonderzoek was te algemeen

De eerste documentatie noemde vooral hoog contrast en weinig stroom. Na vergelijking met de PDF ontbraken ghosting, browserondersteuning, wifi, resolutie, permanent gebruik en de geschiktheid van een e-reader. Die onderwerpen zijn daarna gecontroleerd bij primaire bronnen van E Ink en Kobo.

## Hoe de uitvoer is gecontroleerd

- De API- en databasetests zijn meerdere keren uitgevoerd en na de PDF-controle uitgebreid.
- `node --check` controleert JavaScript-syntax.
- `npm audit` controleert bekende kwetsbaarheden in geïnstalleerde packages.
- Een tijdelijke server is echt gestart.
- Twee medewerkers zijn via het accountscript aangemaakt.
- Login, product toevoegen, verhogen, verlagen, instellen, beschikbaarheid en logout zijn via HTTP gecontroleerd.
- Na een serverherstart is gecontroleerd dat voorraad 4 nog bestond.
- De bron-PDF is als 11 pagina's gerenderd en iedere pagina is visueel bekeken.

## Eigen verantwoordelijkheid

De student moet de code en keuzes kunnen uitleggen. Voor de demonstratie zijn vooral belangrijk:

- `requireLogin` blokkeert wijzigingen zonder sessie;
- bcrypt vergelijkt een wachtwoord met een hash en slaat geen gewoon wachtwoord op;
- voorbereide SQL-statements voorkomen dat invoer SQL-code wordt;
- `CHECK (stock >= 0)` beschermt ook als API-validatie ooit een fout bevat;
- `setInterval(loadProducts, 60_000)` haalt iedere minuut actuele voorraad op;
- SQLite is eenvoudig en persistent, maar bedoeld voor deze ene server.
