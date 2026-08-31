# Probleemanalyse

## Huidige situatie

Zonder centraal systeem kan een voorraadlijst verouderd raken. Een papieren lijst moet handmatig worden aangepast. Gasten weten dan niet zeker of iets beschikbaar is. Medewerkers kunnen tegelijk verschillende aantallen gebruiken.

## Gewenste situatie

Er is één database als bron van waarheid. De openbare pagina leest alleen uit deze database. De medewerkerpagina mag na een geldige login wijzigingen opslaan. Iedere volgende bezoeker ziet daardoor hetzelfde actuele aantal.

## Eisen uit de bronopdracht

- Publiek: productnaam, actuele voorraad en duidelijke beschikbaarheidsstatus.
- Leesbaar: grote letters, hoog contrast, weinig afleiding en geschikt voor e-ink.
- Beheer: telefoonvriendelijk, login, meerdere producten, verhogen, verlagen en instellen.
- Accounts: minimaal twee medewerkers kunnen bestaan.
- Techniek: publieke lees-API, beveiligde wijzigings-API, validatie en foutafhandeling.
- Opslag: voorraad blijft bestaan na een serverherstart.
- Actualiteit: de publieke pagina ververst iedere 60 seconden.
- Oplevering: tests, documentatie, AI-verantwoording, AI-logboek en presentatie.

## Gebruikers

### Publieke gebruiker

De publieke gebruiker wil snel zien:

- welke producten bestaan;
- hoeveel er op voorraad is;
- of een product beschikbaar, niet beschikbaar of uitverkocht is.

Deze gebruiker mag niets aanpassen.

### Medewerker

Een medewerker wil op een telefoon inloggen, een product toevoegen, een aantal verhogen of verlagen, een exact aantal invullen en de beschikbaarheid wijzigen.

## Belangrijkste risico's

- Een onbevoegde gebruiker probeert de API direct aan te roepen.
- Een medewerker voert negatieve, te grote of ongeldige aantallen in.
- Een wachtwoord komt als gewone tekst in de database.
- Voorraad verdwijnt na het stoppen van de server.
- De openbare pagina is slecht leesbaar op e-ink.

De oplossing gebruikt sessiecontrole, servervalidatie, bcrypt-hashes, een bestand-gebaseerde SQLite-database en een zwart-wit ontwerp met grote tekst.

De situaties uit hoofdstuk 8 van de bronopdracht zijn apart uitgewerkt in `docs/foutanalyse.md`.
