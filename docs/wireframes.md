# Wireframes

De bronopdracht vraagt om eenvoudige wireframes voor de interface. De echte PDF kwam pas beschikbaar nadat de eerste versie van de app al was gebouwd. Daarom zijn deze wireframes daarna alsnog vastgelegd en is de bestaande interface er stap voor stap mee vergeleken. De uiteindelijke pagina's volgen deze indeling.

## Publieke voorraadpagina - groot scherm en e-ink

```text
┌─────────────────────────────────────────────────────────────┐
│ CAMPINGAPPARTEMENTEN                 Bijgewerkt: 14:32      │
│ ACTUELE VOORRAAD                                            │
├──────────────────┬──────────────────┬───────────────────────┤
│ VERSE MELK       │ YOGHURT          │ IJSJES                │
│                  │                  │                       │
│       6          │       3          │       0               │
│   op voorraad    │   op voorraad    │   op voorraad         │
│──────────────────│──────────────────│───────────────────────│
│ BESCHIKBAAR      │ BESCHIKBAAR      │ UITVERKOCHT           │
└──────────────────┴──────────────────┴───────────────────────┘
```

Ontwerpregels:

- de productnaam, het aantal en de tekststatus zijn direct zichtbaar;
- grote cijfers zijn vanaf enkele meters leesbaar;
- er zijn geen knoppen of links om voorraad te wijzigen;
- zwart, wit, grijs en dikke lijnen werken op een monochroom scherm;
- de kaarten schuiven automatisch onder elkaar op een smaller scherm.

## Medewerkerpagina - telefoon

```text
┌──────────────────────────────┐
│ VOORRAADBEHEER               │
│ Ingelogd als medewerker1     │
│ [ Uitloggen ]                │
├──────────────────────────────┤
│ PRODUCT TOEVOEGEN            │
│ Naam        [____________]   │
│ Begin       [0___________]   │
│ [ Toevoegen ]                │
├──────────────────────────────┤
│ Verse melk                   │
│ Voorraad: 6   BESCHIKBAAR    │
│ [ -1 ] [ +1 ]                │
│ [ +10 ] [ Niet beschikbaar ] │
│ [6________] [ Instellen ]    │
├──────────────────────────────┤
│ Yoghurt                      │
│ ...                          │
└──────────────────────────────┘
```

Ontwerpregels:

- knoppen zijn minimaal 46 pixels hoog en geschikt voor aanraken;
- `-1` en `+1` voeren de meest voorkomende handeling direct uit;
- exact instellen is apart beschikbaar;
- de statusknop gebruikt ook tekst en niet alleen kleur;
- fout- en succesmeldingen verschijnen boven het beheer.

## Vergelijking met de gebouwde interface

De bestanden `public/index.html`, `public/admin.html` en `public/styles.css` voeren deze wireframes uit. De beheerpagina schakelt bij 650 pixels over naar één kolom. De publieke pagina gebruikt een flexibel kaartrooster.
