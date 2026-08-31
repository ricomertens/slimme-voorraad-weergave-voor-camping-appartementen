# Persoonlijk AI-logboek

Dit logboek beschrijft de relevante AI-interacties van 31 augustus 2026. De code en documenten in deze repository zijn het uiteindelijke resultaat. Technische uitvoer zoals complete patches en testlogs is samengevat waar die rechtstreeks terug te vinden is in de genoemde bestanden.

## Interactie 1 - volledige applicatie bouwen

**Datum:** 31 augustus 2026  
**AI-tool:** OpenAI Codex

### Volledige prompt

```text
Lees opdracht.pdf volledig.

Ik wil dat je deze volledige schoolopdracht voor mij opbouwt.

Maak een complete werkende applicatie die voldoet aan alle minimale eisen uit de PDF.

Gebruik een zo simpel mogelijke technische stack:
- Node.js
- Express
- SQLite
- HTML
- CSS
- JavaScript
- bcrypt voor wachtwoorden
- sessions voor login
- Jest/Supertest voor tests

Maak het project niet onnodig ingewikkeld.

BOUW:

1. Publieke voorraadpagina
- productnaam tonen
- actuele voorraad tonen
- beschikbaar / uitverkocht tonen
- geschikt voor e-ink
- grote tekst
- hoog contrast
- simpele zwart-wit vormgeving
- automatisch iedere 60 seconden verversen
- publieke gebruiker mag niets wijzigen

2. Medewerker beheerpagina
- geschikt voor telefoon
- login
- producten bekijken
- product toevoegen
- voorraad verhogen
- voorraad verlagen
- voorraad direct instellen
- product beschikbaar/niet beschikbaar zetten
- uitloggen
- voorraad mag nooit onder 0

3. Backend/API
- publieke API voor voorraad bekijken
- beveiligde API voor wijzigingen
- inputvalidatie
- correcte foutmeldingen
- beveiliging tegen onbevoegde wijzigingen

4. Database
- SQLite
- producten persistent opslaan
- gebruikers persistent opslaan
- voorraad moet na server restart behouden blijven

5. Accounts
Maak een systeem waarmee minimaal twee medewerkers kunnen bestaan.
Gebruik veilige password hashing met bcrypt.
Zet geen gewone wachtwoorden in de database.

6. Tests
Maak minimaal 20 tests.
Test onder andere:
- voorraad bekijken
- voorraad verhogen
- voorraad verlagen
- voorraad 0
- negatieve voorraad weigeren
- product toevoegen
- login
- verkeerde login
- niet-ingelogde gebruiker wijzigen
- database persistentie
- verkeerde invoer
- onbekend product
- beveiligde endpoints

Voer de tests zelf uit en los fouten op totdat alles werkt.

7. Documentatie
Maak een docs map en maak:
docs/projectplan.md
docs/probleemanalyse.md
docs/architectuur.md
docs/technische-keuzes.md
docs/datamodel.md
docs/eink-onderzoek.md
docs/securityanalyse.md
docs/testplan.md
docs/testresultaten.md
docs/ai-verantwoording.md
docs/ai-logboek.md

Gebruik simpele Nederlandse taal op MBO 4 niveau.
Baseer de documentatie op wat daadwerkelijk gebouwd is.

8. README
Maak een README.md met:
- wat het project doet
- hoe ik het installeer
- hoe ik het start
- hoe ik de tests uitvoer
- hoe ik medewerkeraccounts kan maken

9. Projectstructuur
Maak zelf een nette mappenstructuur.

10. Git
Maak een goede .gitignore.
Commit geen:
- node_modules
- .env
- wachtwoorden
- secrets
- tijdelijke databasebestanden als dat niet nodig is

BELANGRIJK:
Werk zelfstandig door het hele project heen.
Stop niet na ieder klein onderdeel om mij vragen te stellen.
Als je een logische technische keuze zelf kunt maken, maak die keuze dan zelf.
Installeer benodigde packages.
Maak bestanden.
Voer commands uit.
Voer tests uit.
Los fouten zelf op.

Ik wil uiteindelijk alleen een project dat ik kan starten en demonstreren.

Als alles klaar is:
1. voer alle tests uit;
2. controleer of de app start;
3. controleer of login werkt;
4. controleer of voorraad wijzigen werkt;
5. controleer of de publieke pagina werkt;
6. geef mij daarna kort aan hoe ik het project start en test.
```

### Antwoord van AI

Codex meldde dat het PDF-bestand in de werkmap 0 bytes was en bouwde daarna de volledige applicatie op basis van bovenstaande eisen. Het eindantwoord meldde 35 geslaagde tests, een werkende login, voorraadbeheer, publieke pagina, documentatie en startinstructies. De volledige technische uitwerking staat in `src`, `public`, `scripts`, `tests` en `docs`.

### Wat heb ik ermee gedaan?

De voorgestelde eenvoudige architectuur is gebruikt. De code is niet als los voorbeeld bewaard, maar als complete werkende projectbestanden. Er zijn geen bonusfuncties toegevoegd die de minimale oplossing onnodig ingewikkeld maken.

### Controle

Alle tests zijn uitgevoerd. Daarna is met een tijdelijke database een echte server gestart. Login, toevoegen, voorraad verhogen/verlagen/instellen, beschikbaarheid, publieke API, logout en persistentie na herstart zijn gecontroleerd.

### Probleem en kritische vervolgstap

Tijdens de accountcontrole bleek de wachtwoordinvoer zichtbaar. AI heeft het script aangepast. De eerste aanpassing gaf een `readline`-fout; een tweede oplossing is opnieuw getest en werkte met verborgen invoer. Dit laat zien waarom code uitvoeren belangrijker is dan een voorstel alleen lezen.

### Uiteindelijk gebruikt

De tweede `readline`-oplossing, bcrypt cost factor 12, sessiecontrole, servervalidatie, SQLite-beperkingen en alle geteste pagina's/API-routes.

## Interactie 2 - echte PDF verwerken

**Datum:** 31 augustus 2026  
**AI-tool:** OpenAI Codex

### Volledige prompt

```text
dit is de opracht pdf, zet dit in die file en doe alles wat je nog niet hebt gedaan en gewoon wat je moet doen precies hoe de prompt gegeven was
```

Bij de prompt is `projectopdracht_voorraad_eink_camping.pdf` uit de map Downloads aangewezen als de echte opdracht.

### Antwoord van AI

Codex verving het lege `opdracht.pdf` door de aangeleverde PDF, controleerde de SHA-256-hash, las alle 11 pagina's, renderde iedere pagina en vergeleek de volledige opdracht met de repository. Als ontbrekend werden onder andere gevonden: wireframes, uitgebreider foutonderzoek, compleet e-inkonderzoek, een uitgebreider AI-logboek en presentatievoorbereiding.

### Wat heb ik ermee gedaan?

- De echte PDF is nu onderdeel van de werkmap.
- `docs/wireframes.md` is toegevoegd.
- `docs/foutanalyse.md` is toegevoegd.
- Het e-inkonderzoek is uitgebreid en onderbouwd met primaire bronnen.
- AI-verantwoording en dit logboek zijn uitgebreid.
- Een presentatie- en demonstratiescript is toegevoegd.
- De eisencheck is per hoofdstuk vastgelegd.

### Controle

De bron en kopie hebben dezelfde SHA-256-hash. Alle 11 gerenderde pagina's zijn visueel bekeken. Daarna zijn syntaxcontrole en 38 tests uitgevoerd; alle tests slaagden. `npm audit` vond 0 kwetsbaarheden.

### Kritische vervolgvraag

De praktische vervolgvraag was: welke PDF-eisen zijn echte minimumonderdelen en welke zijn bonus? Dit is opgelost door hoofdstuk 7, 17, 18 en 21 als verplichte oplevering te behandelen en hoofdstuk 22 expliciet als niet-verplichte bonus af te bakenen.

### Uiteindelijk gebruikt

Alle minimale eisen uit de PDF en de strengere eis van 20 tests uit de eerste prompt. De bonusopdrachten zijn niet nodig voor een volledige minimale oplevering en staan daarom alleen als mogelijke uitbreiding genoemd.
