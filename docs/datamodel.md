# Datamodel

## Tabel products

| Veld | Type | Regel |
| --- | --- | --- |
| `id` | INTEGER | Primaire sleutel, automatisch nummer |
| `name` | TEXT | Verplicht, uniek zonder verschil tussen hoofdletters |
| `stock` | INTEGER | Verplicht, standaard 0, nooit lager dan 0 |
| `available` | INTEGER | Alleen 0 of 1 |
| `created_at` | TEXT | Tijdstip van aanmaken |
| `updated_at` | TEXT | Tijdstip van laatste wijziging |

De API zet `available` om naar `true` of `false`. De zichtbare status wordt berekend:

- voorraad 0: `Uitverkocht`;
- voorraad hoger dan 0 en beschikbaar: `Beschikbaar`;
- voorraad hoger dan 0 en handmatig uitgeschakeld: `Niet beschikbaar`.

## Tabel users

| Veld | Type | Regel |
| --- | --- | --- |
| `id` | INTEGER | Primaire sleutel, automatisch nummer |
| `username` | TEXT | Verplicht en uniek zonder verschil tussen hoofdletters |
| `password_hash` | TEXT | Verplichte bcrypt-hash |
| `created_at` | TEXT | Tijdstip van aanmaken |

Er is geen kolom voor een gewoon wachtwoord. Producten en gebruikers hebben geen directe relatie. Iedere medewerker mag alle producten beheren.
