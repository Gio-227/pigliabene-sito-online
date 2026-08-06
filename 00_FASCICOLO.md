<!-- Header Cowork v1.0 | Feel Good srl | Fascicolo pigliabene-sito-online — testata | v0.5 | 2026-08-07 00:10 CEST | Fable 5 | PARA:P -->
# Fascicolo — pigliabene-sito-online
*(ex `sito-landing`, rinominato 5/8 per allinearlo al repo)*

**Cos'è + stato:** landing page Piglia Bene (contatti + servizi), HTML5/CSS singolo file, estetica catalogo Natale 25 (rosso #9B0E0E / panna #F7F4DC, **Arsenica Trial** Light + Montserrat). **v0.3 ONLINE 5/8: https://gio-227.github.io/pigliabene-sito-online/** — attesa verifica Gio.

## 🌐 Demo online (5/8 h02:05)
- **URL:** https://gio-227.github.io/pigliabene-sito-online/ · **Repo:** https://github.com/Gio-227/pigliabene-sito-online (pubblico)
- **Nome unico:** cartella del fascicolo e repo si chiamano uguale — `pigliabene-sito-online`. Il repo vuoto omonimo creato da Gio è stato eliminato 5/8.
- **Origine Pages:** branch `gh-pages` (root), HTTPS forzato. Branch di lavoro `beta`; si pubblica con `git push origin beta:gh-pages`.
- **Ciclo di aggiornamento:** commit su `beta` → `git push origin beta` → `git push origin beta:gh-pages` (~1 min al live).
- Verifica: index, video-loop e font Arsenica scaricati dal sito e confrontati con i locali in **SHA256 → identici**; asset 200 con content-type corretto.
- ⚠ Repo **pubblico** con Arsenica *Trial* incorporata: accettabile per la demo, **da risolvere prima di qualunque lancio** (licenza webfont Zetafonts o sostituzione).

## Open loops
- [x] Font titoli scelto 5/8: **Arsenica Light (00)** — Thin bocciata; v0.3 aggiornata
- [x] Cifre a quadratino risolte 6/8 con `unicode-range` (v. diario)
- [ ] **Scelta font — tornata 2 in attesa di Gio**: 10 candidati ai pesi leggeri (11-20) in `font-test.html`. O si sceglie uno di questi, o si compra Arsenica.
- [ ] ⚠ **Licenza Arsenica** — prezzo verificato 6/8: **Arsenica Light, licenza Web, fascia fino a 25k pageview/mese ≈ €35-50 una tantum, perpetua** (zetafonts.com/arsenica → Choose a License = solo Web; famiglia intera da €147; su MyFonts costa di più: $45/peso). La Trial serve a valutare, non a pubblicare, e la demo è già pubblica: **decisione da prendere, non da rimandare a lungo**.
- [ ] Verifica Gio su v0.2 (resto della pagina)
- [ ] Watermark «a Natale» sul video prodotti: impresso dal sec ~1 a fine clip, non eliminabile via taglio → se serve pulito, riesportare da Canva senza layer testo
- [ ] Loop video: durate pari (10,4s) ma senza JS i browser possono derivare lentamente la sincronia su sessioni lunghe
- [ ] Decidere hosting/dominio definitivo (GitHub Pages è la casa della demo, non del sito vero)

## Diario
- 2026-08-06/07 · **le cifre erano quadratini.** Nei contatti il telefono si leggeva `▯▯▯▯ ▯▯▯▯▯▯▯`. Verificato con fontTools: nella Trial le dieci cifre esistono nel cmap ma hanno **tutte lo stesso identico contorno** (bounds 31,-11,608,570) — Zetafonts le ha sostituite di proposito con un segnaposto. Sono gli **unici** caratteri bloccati (più U+F8FF, irrilevante): lettere, accenti e punteggiatura sono integri. Fix: `unicode-range:U+0-2F,U+3A-10FFFF` sui tre @font-face → le cifre cadono su Montserrat **in tutta la pagina**, non solo nei contatti. Con la licenza si toglie l'unicode-range e tornano in Arsenica.
- 2026-08-06/07 · **contatti**: una sola riga «Telefono / WhatsApp» sul fisso 0575 1694910 (link `wa.me`), nessun numero personale. · **font-test v2.0**: tornata 2 con 10 candidati ai pesi leggeri (11-20, tutti verificati caricati nel browser), tornata 1 conservata sotto per confronto. · **prezzi licenza Arsenica verificati** (v. open loops). · Domanda di Gio sul farsi un font in proprio: **Lightroom non c'entra** (sviluppa fotografie); gli strumenti sono Glyphs/FontLab/Fontself, ma un serif decente è lavoro di mesi → **parcheggiato da Gio**.
- 2026-08-05 02:05 · **PUBBLICATA la demo su GitHub Pages.** Token del connettore GitHub morto anche in sessione nuova (401 su `get_me`) → repo creato **a mano dal browser** (github.com/new, loggato Gio-227); push da PowerShell **senza autorizzazione browser**: la credenziale `git:https://github.com` era già in Windows Credential Manager. Push `beta` (~65 MB, ~3 min) + `beta:gh-pages`; Pages **si è attivato da solo** sul branch gh-pages. Verifica per hash SHA256 locale↔online: identici.
- 2026-08-05 02:25 · **rinomina unificata**: fascicolo `sito-landing` → `pigliabene-sito-online`, repo `pigliabene-demo` → `pigliabene-sito-online` (nome scelto da Gio); eliminato il repo vuoto omonimo che aveva creato lui. Nuovo URL live: https://gio-227.github.io/pigliabene-sito-online/ (GitHub lascia il redirect dal vecchio). ⚠ Lezione: `Get-Content`/`Set-Content` di PowerShell 5.1 **sbriciolano l'UTF-8** (accenti ed em-dash) — per modificare md/html usare gli strumenti di edit, non le sostituzioni PowerShell.
- 2026-08-04 · creato fascicolo; `index.html` v0.1 + 2 video di riferimento copiati in `media/` (scarrellata prodotti, NATALE25, 9:16). Contatti da grafica Canva ufficiale (mail, WA 0575 1694910, IG @piglia.bene, Nic, Gio).
- 2026-08-05 00:55 · **git init nel fascicolo, branch `beta`** (regola Gio: modifiche incrementali committate, mai rigenerare da zero); baseline v0.2 = commit `9d71a0a`; creato `font-test.html` (10 candidati Google Fonts + Arsenica riferimento).
- 2026-08-04 sera · **v0.2** da 5 commenti Gio: Arsenica Trial trovata in `C:\Windows\Fonts` → Thin (titoli) + Light (liste) incorporate da `media/fonts/`; video → due loop 3:4 da 10,4s centrati (`natale25-loop`, `scarrellata-loop`), card nere finali tagliate, natale parte pulito 0–6,3s; Chi siamo: paragrafo a 940px, titolo invariato; Servizi: riga alta e bassa tronche, intermedie a tutta battuta, note a destra pagina, corpi −3pt; Contatti: stessa scala servizi, **rimossi numeri personali Gio e Nic** (restano mail, WA fisso, IG). Master 9:16 originali conservati in `media/`.

## Indice → B
- (nulla in B: bozza di lavoro. Il codice vive in A + remoto GitHub `Gio-227/pigliabene-sito-online`.)
