# Securityanalyse

## Te beschermen gegevens

De voorraad mag openbaar gelezen worden. Medewerkeraccounts, wachtwoord-hashes en wijzigingsrechten moeten beschermd blijven.

## Maatregelen

### Wachtwoorden

Het aanmaakscript verbergt de wachtwoordinvoer en hasht ieder wachtwoord met bcrypt en cost factor 12. Gewone wachtwoorden worden niet in de database, broncode of configuratie opgeslagen.

### Sessies

Na login wordt de sessie opnieuw aangemaakt. Dit helpt tegen het overnemen van een bestaande sessie-id. De cookie is `httpOnly` en `sameSite=strict`. In productie wordt de cookie alleen via HTTPS verstuurd.

### Autorisatie

Alle routes die producten wijzigen gebruiken `requireLogin`. De browserinterface alleen verbergen is niet genoeg; de server controleert iedere aanvraag opnieuw.

### Invoervalidatie

De server accepteert alleen gehele voorraden van 0 tot en met 1.000.000. Namen worden begrensd en lege namen worden geweigerd. SQLite heeft daarnaast een `CHECK`-regel waardoor voorraad ook op databaseniveau nooit negatief kan zijn.

### SQL en browser

SQL gebruikt placeholders. Productnamen worden in de browser met `textContent` geplaatst. De server stuurt daarnaast CSP, `nosniff`, een referrerbeleid en een verbod op framing mee.

### Foutmeldingen

Een mislukte login vertelt niet of de gebruikersnaam of het wachtwoord fout was. Onverwachte interne informatie wordt niet naar de gebruiker gestuurd.

## Resterende risico's

De standaard sessieopslag staat in het geheugen. Na een serverherstart moeten medewerkers opnieuw inloggen. Voor een productieomgeving met meerdere servers is een blijvende sessiestore nodig. Ook zijn HTTPS, back-ups, logbeheer en login-rate-limiting taken van de productieomgeving. Voor deze lokale schooldemonstratie blijven de onderdelen bewust eenvoudig.
