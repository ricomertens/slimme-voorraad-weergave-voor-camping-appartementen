# Testplan

## Doel

De tests moeten aantonen dat de belangrijkste functies en beveiligingsregels werken. Ze worden automatisch uitgevoerd met Jest en Supertest.

## Testomgeving

Iedere test start een Express-app met een nieuw tijdelijk SQLite-bestand. Er worden twee medewerkers met bcrypt-hashes toegevoegd. Een Supertest-agent bewaart cookies voor sessietests. Na iedere test worden database en tijdelijke map gesloten en verwijderd.

## Testonderdelen

### Publieke voorraad

- bekijken zonder login;
- productvelden en status bekijken;
- voorraad 0;
- niet beschikbaar product;
- publieke HTML-pagina.

### Login en accounts

- correcte login;
- verkeerd wachtwoord;
- onbekende gebruiker;
- verkeerde invoer;
- sessiestatus;
- uitloggen;
- twee accounts en geen gewone wachtwoorden.

### Productbeheer

- product toevoegen en standaardvoorraad;
- dubbele of lege naam;
- negatieve of decimale voorraad;
- verhogen, verlagen en exact instellen;
- nooit onder nul;
- beschikbaarheid wijzigen;
- onbekende producten en bewerkingen.

### Beveiliging en fouten

- drie soorten wijzigingen zonder login;
- ongeldige JSON;
- onbekend API-endpoint;
- duidelijke HTTP-statuscodes.

### Persistentie

- database sluiten, opnieuw openen en opgeslagen product controleren.

### Gelijktijdigheid en dubbele bescherming

- twee bijna gelijktijdige `-1`-aanvragen verwerken;
- SQLite zelf een negatieve voorraad laten weigeren;
- controleren dat de browsercode precies 60 seconden gebruikt.

## Slagingsregel

Alle tests moeten slagen. Eén mislukte test betekent dat de eindcontrole nog niet klaar is.
