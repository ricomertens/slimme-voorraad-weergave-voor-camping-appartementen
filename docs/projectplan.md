# Projectplan

## Aanleiding

De campingappartementen hebben producten voor gasten en medewerkers. De actuele voorraad moet duidelijk zichtbaar zijn. Medewerkers moeten de aantallen snel met een telefoon kunnen aanpassen.

## Doel

Het doel is een kleine webapp die de actuele voorraad vanuit één SQLite-database toont. De openbare pagina is geschikt voor een e-inkscherm. Alleen ingelogde medewerkers mogen iets wijzigen.

## Resultaat

Het project levert:

- een openbare voorraadpagina;
- een mobiele beheerpagina;
- een Express-API met publieke en beveiligde routes;
- blijvende opslag van producten en gebruikers in SQLite;
- veilige wachtwoord-hashes en sessielogin;
- minimaal 20 automatische tests;
- technische en functionele documentatie.

## Werkvolgorde

1. Eisen verzamelen en eenvoudig datamodel kiezen.
2. Wireframes maken voor het publieke scherm en de telefoon.
3. SQLite-tabellen, API en sessielogin bouwen.
4. Openbare pagina en medewerkerpagina maken en met de wireframes vergelijken.
5. Automatische tests schrijven en uitvoeren.
6. Documentatie laten aansluiten op de werkende code.
7. De volledige demonstratiestroom en presentatie controleren.

## Afbakening

Er is geen productverwijdering, wachtwoordherstel, uitgebreide rollenstructuur of cloudhosting. Dat is niet nodig voor de minimale opdracht. Iedere medewerker heeft dezelfde beheerrechten.

## Acceptatiecriteria

Het project is klaar als de server start, twee medewerkers kunnen bestaan, login werkt, wijzigingen zonder login worden geweigerd, voorraad nooit negatief wordt, gegevens na een herstart blijven bestaan en alle tests slagen.
