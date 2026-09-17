# Arbeidsregler for Lernuhr

## Versjon og endringslogg

- Hvert ferdig endringssett dokumenteres i `changelog.txt` og får oppdatert versjon i `package.json` og sidefoten på begge hovedsidene.
- Bruk `MAJOR.MINOR.PATCH`: PATCH for feilretting og mindre justeringer, MINOR for ny funksjonalitet og MAJOR for inkompatible endringer.
- Sidefoten utelater siste ledd når det er null, slik at `2.0.0` vises som `Versjon 2.0`.
- Nyeste utgave står øverst i endringsloggen med dato, konkrete endringer og faktisk utført kontroll.
- Commit kilde, versjon og logg sammen. Ferdige utgivelser får en annotert Git-tag. Ikke flytt tagger, push eller publiser uten autorisasjon.

## Pedagogisk kjerne

- Analoguhr viser systemtid, kan stoppes, kan få tilfeldig tid og lar eleven dra time- og minuttviseren. Sekundviseren vises bare med systemtid.
- Den analoge teksten bruker muntlige uttrykk med `nach`, `vor`, `halb` og `Viertel`, og kan skjules eller vises.
- Digitaluhr viser systemtid i 24-timersformat, kan stoppes, kan få tilfeldig tid og lar timer og minutter justeres separat med omløp innen henholdsvis 0–23 og 0–59.
- Den digitale teksten leser time og minutt direkte med tyske tallord og kan skjules eller vises.
- Bevar disse reglene med mindre brukeren uttrykkelig ber om å endre dem.

## Teknisk struktur

- Behold vanlig HTML, CSS og JavaScript uten nødvendige eksterne avhengigheter eller byggeprosess.
- Siden skal fungere via webserver og ved direkte åpning av `index.html` og `digitaluhr.html`.
- Hold tidsuttrykk og tallord i `clock-core.js`, analog interaksjon i `analog.js`, digital interaksjon i `digital.js` og tema i `theme.js`.
- Bevar den relative navigasjonen mellom klokkene og den felles temalagringen under `dlillegard:theme`.
- Bevar mobiltilpasning, tastaturbetjening, tilgjengelige etiketter og tilbakemeldinger som ikke bare formidles med farge.
- Kjør `npm test`, kontroller relevante grensesnittendringer i nettleseren og kjør `git diff --check` før commit.
- Produksjonsmappen skal bare motta filene som README lister som offentlige.
