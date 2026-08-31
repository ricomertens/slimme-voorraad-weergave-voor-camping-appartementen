# Onderzoek naar e-ink

## Stroomverbruik

E Ink noemt zijn schermtechniek bistabiel: het scherm gebruikt energie bij een beeldwijziging, maar niet om een stilstaand beeld vast te houden. Dat is gunstig voor een voorraadscherm dat maar één keer per minuut hoeft te veranderen. Een compleet apparaat gebruikt nog wel stroom voor wifi, processor en eventuele verlichting. Bron: [E Ink - Benefits](https://www.eink.com/tech/detail/Benefits).

## Refresh rate en ghosting

Een e-inkscherm ververst langzamer dan een LCD- of OLED-scherm. Een volledige refresh kan kort zwart-wit knipperen. Resten van het vorige beeld kunnen soms zwak zichtbaar blijven; dit heet ghosting. Kobo adviseert bij zulke restbeelden een volledige pagina-refresh. Bron: [Kobo - Refresh your eReader's screen](https://help.kobo.com/hc/en-us/articles/360062226733-Use-your-Kobo-eReader-as-a-notebook).

Voor deze app zijn animaties daarom ongeschikt. De voorraad verandert hoogstens iedere 60 seconden. De kaartindeling blijft zo veel mogelijk op dezelfde plaats, waardoor het scherm niet onnodig onrustig wordt.

## Kleuren en leesbaarheid

Veel e-inkschermen zijn zwart-wit of hebben een beperkt kleurenpalet. De techniek reflecteert omgevingslicht in plaats van een sterke achtergrondverlichting te gebruiken. Hierdoor is e-ink juist in daglicht goed leesbaar. De app gebruikt zwarte tekst, witte vlakken, dikke randen en grijze arcering. Status wordt altijd als tekst getoond, dus kleur is niet nodig. Bron: [E Ink - Benefits](https://www.eink.com/tech/detail/Benefits).

## Browserondersteuning

Een gewone browser kan HTML, CSS, JavaScript en `fetch` uitvoeren. Een e-readerbrowser is minder zeker: Kobo noemt de webbrowser officieel een bètafunctie. Dat betekent dat permanent automatisch openen, JavaScript-ondersteuning, schermbeveiliging en updates per model getest moeten worden. Bron: [Kobo - About Beta Features](https://help.kobo.com/hc/en-us/articles/360017763733-About-Beta-Features).

De app gebruikt daarom geen frontend-framework, animaties, webfonts of ingewikkelde browser-API's. Gewone HTML/CSS/JavaScript vergroot de kans dat een eenvoudige browser de pagina goed weergeeft.

## Wifi en offline gedrag

De actuele voorraad komt via wifi uit de API. Zonder verbinding kan het laatst getoonde e-inkbeeld zichtbaar blijven, omdat het scherm bistabiel is. Dat is tegelijk een risico: de informatie kan oud lijken. Daarom toont de pagina een duidelijk tijdstip van de laatste geslaagde update en een foutmelding wanneer verversen mislukt. Professionele e-paper-signage combineert e-paper ook met wifi voor informatievoorziening. Bron: [E Ink - Papercast and E Ink Digital Paper](https://blog.eink.com/papercast-and-e-ink-digital-paper).

## Schermresolutie en permanent gebruik

De precieze resolutie verschilt per apparaat. De CSS gebruikt een flexibel rooster en schaalbare letters. Daardoor werken grote landschapsdisplays en kleinere schermen zonder vaste pixelmaten. Voor een permanent scherm moeten wifi-herstel, automatisch opnieuw openen na een herstart, schermbeveiliging, voeding en kioskmodus op de gekozen hardware apart worden getest.

## Automatische refresh

De browser haalt direct en daarna iedere 60 seconden opnieuw voorraad op. Alleen de productlijst en het tijdstip worden bijgewerkt. Een minuut is actueel genoeg voor deze opdracht en beperkt het aantal beeldwisselingen.

## Is een e-reader geschikt?

Een e-reader kan als goedkoop prototype werken als zijn bètabrowser JavaScript, `fetch`, wifi en langdurig openblijven goed ondersteunt. Voor betrouwbaar dagelijks gebruik is hij niet de beste eerste keuze: de browser is vooral voor incidenteel gebruik en niet als beheerde kiosk ontworpen.

Een speciaal e-paper-signagescherm met kiosksoftware of een e-inkmonitor aan een kleine computer is geschikter. Zo kunnen automatisch starten, netwerkherstel, schermrefresh en centraal beheer beter worden ingesteld. De webapp blijft bij beide opties hetzelfde.

## Gevolgen voor het gebouwde ontwerp

- grote productnamen en zeer grote voorraadaantallen;
- geen animaties, schaduwen of kleurafhankelijke informatie;
- tekststatus voor beschikbaar en uitverkocht;
- vaste zwart-witte kaarten met sterke contrasten;
- zichtbaar tijdstip van de laatste geslaagde update;
- eenvoudige webtechniek zonder framework of externe lettertypen.
