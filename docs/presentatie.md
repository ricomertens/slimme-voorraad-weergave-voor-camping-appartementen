# Eindpresentatie - ongeveer 10 minuten

Deze opzet kan direct worden gebruikt voor de presentatie en live demonstratie. Zet vóór de les de server aan en maak twee medewerkeraccounts. Gebruik geen echt wachtwoord op een zichtbare dia.

## Dia 1 - Slimme voorraadweergave (45 seconden)

**Op de dia:** Slimme voorraadweergave voor camping en appartementen; publiek e-inkscherm plus mobiel medewerkerbeheer; Node.js, Express en SQLite.

**Vertel:** Gasten willen in enkele seconden zien wat nog beschikbaar is. Medewerkers moeten na een verkoop met één druk op de knop de voorraad kunnen aanpassen.

## Dia 2 - Het probleem en de gebruikers (60 seconden)

**Op de dia:** Gast leest op afstand en wijzigt niets. Medewerker wijzigt snel op een telefoon. Iedereen gebruikt één gedeelde en blijvende voorraad.

**Vertel:** Browseropslag is niet geschikt, omdat ieder apparaat dan zijn eigen lijst heeft. Daarom is SQLite de centrale bron voor de telefoon en het publieke scherm.

## Dia 3 - De oplossing (60 seconden)

```text
Publieke pagina ── GET ──┐
                         ▼
                    Express API ── SQLite
                         ▲
Medewerkerpagina ─ sessie + wijzigingen
```

**Vertel:** De publieke route mag alleen lezen. De beheerroute controleert bij iedere wijziging de ingelogde sessie. Voorraad blijft in een databasebestand staan.

## Dia 4 - Publieke e-inkweergave (60 seconden)

**Op de dia:** Grote productnamen en aantallen; zwart-wit met tekststatus; automatisch verversen na 60 seconden; laatste update zichtbaar.

**Vertel:** E-ink ververst langzaam en kan ghosting hebben. Daarom zijn er geen animaties of kleurafhankelijke signalen. Een e-readerbrowser is vaak een bètafunctie; eenvoudige webtechniek is veiliger.

## Dia 5 - Mobiel voorraadbeheer (60 seconden)

**Op de dia:** Inloggen; product toevoegen; `-1`, `+1` en `+10`; exact instellen; tijdelijk niet beschikbaar; uitloggen.

**Vertel:** De meest voorkomende actie is één verkocht product. Daarom staat `-1` direct bij ieder product en zijn knoppen groot genoeg voor aanraken.

## Dia 6 - Security en foutafhandeling (75 seconden)

**Op de dia:** bcrypt-hashes; sessiecontrole; voorbereide SQL; validatie plus `CHECK (stock >= 0)`; HTTP 400, 401, 404 en 409.

**Vertel:** Alleen een verborgen beheerpagina is geen beveiliging. De API zelf weigert een wijziging zonder geldige sessie. Negatieve voorraad wordt op twee niveaus tegengehouden.

## Dia 7 - Testen en bewijs (60 seconden)

**Op de dia:** Meer dan 20 tests; login goed/fout; voorraadbewerkingen; twee accounts; SQLite-herstart; handmatige HTTP-demonstratie.

**Vertel:** Supertest gebruikt voor iedere test een tijdelijke database. Persistentie is bewezen door het databasebestand te sluiten en opnieuw te openen.

## Dia 8 - Kritisch AI-gebruik (75 seconden)

**Op de dia:** AI stelde code voor; zelf uitgevoerd; zichtbaar wachtwoord gevonden; eerste reparatie faalde; tweede reparatie getest.

**Vertel:** Hashing was goed, maar de gebruikerservaring lekte het wachtwoord op het scherm. Alleen een echte test maakte dat zichtbaar. Ook de eerste AI-correctie werkte niet, dus opnieuw beoordelen en testen was nodig.

## Dia 9 - Live demonstratie (2 minuten)

1. Open `http://localhost:3000` en toon de publieke voorraad.
2. Open `/medewerker` op een smal browservenster.
3. Log in met een vooraf aangemaakt demonstratieaccount.
4. Voeg `Verse melk` toe met voorraad 6, of gebruik een bestaand product.
5. Druk op `-1` en laat voorraad 5 zien.
6. Zet het product kort op `Niet beschikbaar` en daarna terug.
7. Ververs de publieke pagina en laat dezelfde wijziging zien.
8. Log uit en leg uit dat wijzigingsroutes nu HTTP 401 geven.

## Dia 10 - Conclusie (45 seconden)

**Op de dia:** Alle minimale eisen werken; eenvoudig voor twee medewerkers; persistent, getest en beveiligd; volgende stap is echte e-paper-hardware.

**Vertel:** De oplossing is bewust klein gehouden. Voor echt gebruik zijn HTTPS, back-ups, monitoring en een beheerd e-paper-kioskscherm logische vervolgstappen.

## Voorbereidingscheck

```powershell
npm install
npm run create-user
npm run create-user
npm test
npm start
```

- Gebruik herkenbare demo-producten zoals verse melk, yoghurt en ijsjes.
- Controleer vóór de presentatie of poort 3000 vrij is.
- Zet browserzoom op 100% en test zowel breed als smal venster.
- Bewaar geen demonstratiewachtwoord in de presentatie of repository.
