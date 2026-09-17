# Lernuhr

Lernuhr består av to interaktive klokker for tyskundervisning. Analoguhr trener muntlige uttrykk med *nach*, *vor*, *halb* og *Viertel*. Digitaluhr trener direkte opplesning av 24-timers klokkeslett.

Versjon 2.0 samler klokkene i samme visuelle profil som Gloseøving og Flashcards. Hovedadressen åpner Analoguhr, og bryteren i toppfeltet bytter til Digitaluhr uten en separat forside.

## Funksjoner

- Systemtid med sekunder på begge klokker.
- Tilfeldig klokkeslett.
- Skjul og vis tysk tekst for egenkontroll.
- Dra time- og minuttviseren på Analoguhr.
- Juster timer og minutter separat på Digitaluhr.
- Lyst og mørkt tema med samme nettleservalg som Gloseøving og Flashcards.
- Responsivt grensesnitt uten eksterne avhengigheter.

## Lokal kjøring

Åpne `index.html` direkte, eller kjør:

```sh
npm start
```

Forhåndsvisningen åpnes på http://127.0.0.1:5174. Tester kjøres med `npm test`.

## Offentlige filer

Disse filene kopieres til servermappen:

```text
index.html
analoguhr.html
digitaluhr.html
styles.css
theme.js
clock-core.js
analog.js
digital.js
lernuhr-symbol.svg
```

`analoguhr.html` videresender eldre bokmerker til hovedsiden. De opprinnelige PNG-bildene og faviconet er bevart i Git-historikken og brukes ikke av 2.0-grensesnittet.

## Struktur

- `clock-core.js`: tallord, normalisering og tyske tidsuttrykk.
- `analog.js`: systemtid, visere, drahåndtering og analog visning.
- `digital.js`: systemtid, justeringsknapper og digital visning.
- `theme.js`: lyst/mørkt tema delt med de andre øvingsappene.
- `styles.css`: felles layout og visuell profil.

Utviklet av Daniel Herman Lillegård og frigitt under CC0.
