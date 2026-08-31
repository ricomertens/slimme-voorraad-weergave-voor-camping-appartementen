# Testresultaten

## Automatische testuitvoering

De tests zijn uitgevoerd met:

```powershell
npm test
```

Laatste resultaat op 31 augustus 2026, na vergelijking met de echte PDF:

```text
Test Suites: 1 passed, 1 total
Tests:       38 passed, 38 total
Snapshots:   0 total
```

## Bevestigde onderdelen

De testuitvoering bevestigt dat:

- de voorraad publiek bekeken kan worden;
- correcte en verkeerde logins verschillend worden afgehandeld;
- een niet-ingelogde gebruiker geen wijzigingen kan uitvoeren;
- producten toegevoegd kunnen worden;
- voorraad verhoogd, verlaagd en direct ingesteld kan worden;
- voorraad 0 mogelijk is en negatieve voorraad wordt geweigerd;
- beschikbaarheid aangepast kan worden;
- verkeerde invoer en onbekende producten nette foutcodes geven;
- twee medewerkeraccounts naast elkaar kunnen bestaan;
- bcrypt-hashes in plaats van gewone wachtwoorden worden opgeslagen;
- producten na sluiten en opnieuw openen van SQLite blijven bestaan.
- twee bijna gelijktijdige verkopen allebei verwerkt worden;
- SQLite zelf negatieve voorraad weigert;
- de publieke browsercode iedere 60 seconden vernieuwt.

## Handmatige eindcontrole

De server is apart gestart met een tijdelijke database en twee via het accountscript aangemaakte medewerkers. Met echte HTTP-aanvragen zijn de volgende resultaten gecontroleerd:

| Controle | Resultaat |
| --- | --- |
| Publieke pagina | HTTP 200 en juiste titel |
| Medewerkerpagina | HTTP 200 en loginformulier |
| Correcte login | HTTP 200 |
| Product toevoegen | HTTP 201 |
| Voorraad verhogen | 5 naar 8 |
| Voorraad verlagen | 8 naar 6 |
| Voorraad direct instellen | 6 naar 4 |
| Niet beschikbaar zetten | `false` en status `Niet beschikbaar` |
| Publieke API na wijziging | voorraad 4 en juiste status |
| Uitloggen | HTTP 204 |
| Serverherstart | product en voorraad 4 bleven bestaan |

De tijdelijke server is daarna gestopt en de tijdelijke controledatabase is verwijderd.
