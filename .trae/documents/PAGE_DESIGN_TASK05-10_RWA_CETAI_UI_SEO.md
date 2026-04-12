# Specificație design pagini (desktop-first)

## Global Styles (Design System)
### Layout
- Grid: 12 coloane (container max 1200–1280px), gutters 24px, secțiuni cu padding vertical 72–96px.
- Spacing: multipli de 4px (4/8/12/16/24/32/48/64).
- Responsive: desktop-first; la <1024px devine 8 coloane; la <640px stacked (1 col), paddings reduse.

### Meta (global)
- Title template: "{Page} | Solaris CET"
- OG: og:title, og:description, og:image (1200x630), og:type=website
- Canonical pe fiecare rută publică.

### Tipografie
- Font: sans modern (ex: Inter) cu fallback system.
- Scale: H1 48/56, H2 36/44, H3 28/36, Body 16/24, Small 14/20, Caption 12/16.
- Reguli: max-width text 72–80 caractere/linie; headings cu spacing consistent.

### Culori
- Neutrals: background/surface/border/text-primary/text-secondary.
- Brand: primary (CTA), secondary (accent), accent (highlight pe hartă/timeline).
- Semantic: success/warning/danger/info pentru status chips.
- Stări: hover (darken), focus (outline 2px), disabled (opacitate + cursor).

### Componente globale
- Header: logo + nav (/rwa, /cet-ai) + CTA.
- Buttons: Primary / Secondary / Ghost; dimensiuni M/L; focus ring vizibil.
- Cards: documente, repere timeline, highlight stats.
- Skeleton: shimmer subtil; păstrează dimensiunile finale (fără layout shift).
- Footer (trust + lead capture):
  - Trust: logo-uri parteneri/afilieri (monocrom), insigne + link-uri.
  - Lead capture: form email (required) + nume (optional) + mesaj de consimțământ (copy), stări success/error.

---

## Pagina principală (/)
### Meta
- Title: "Acasă | Solaris CET"
- Description: 1–2 propoziții despre RWA + CET AI.

### Page Structure
- Stacked sections: Hero → RWA preview → CET AI teaser → Footer.

### Secțiuni & componente
1. Hero RWA (vizual foto/parallax)
   - Layout: 2 coloane (stânga text, dreapta imagine).
   - Parallax: subtil pe imagine (translateY), dezactivat la `prefers-reduced-motion`.
   - Elemente: H1, subheadline, CTA către /rwa, CTA secundar către /rwa#documente.
2. Preview hartă + timeline
   - Layout: split 60/40 (hartă / timeline scurt).
   - Hartă: pan/zoom minimal; click marker → popover + link către /rwa.
   - Timeline: 3–5 itemi, fiecare cu dată + titlu + 1 linie; ultimul item evidențiat.
3. CET AI teaser (preview)
   - Card mare cu mockup chat:
     - 2–3 mesaje exemplu + un răspuns demo cu „typing” (dezactivat la reduced-motion).
     - quick prompts: 3–6 chips (click: pre-populează inputul; opțional pornește animația).
   - CTA primar către /cet-ai.
4. Footer (trust + lead capture)
   - Trust signals: grid logo-uri + link-uri.
   - Lead capture: input email + buton submit; confirmare inline; eroare validare clară.
   - No-JS fallback: în `<noscript>` afișează un mesaj + link `mailto:`/contact.

---

## Pagina RWA (/rwa)
### Meta
- Title: "RWA | Solaris CET"
- Description: sumar despre hartă, timeline și documente.

### Page Structure
- Dashboard-like: top summary → hartă (principal) → timeline → documente → media.

### Secțiuni & componente
1. Summary strip
   - 3–4 metrici/claim-uri în carduri mici.
2. Hartă interactivă
   - Layout: hartă pe container, înălțime 520–640px.
   - Side panel/drawer pentru detalii selecție: titlu, descriere, tag-uri, buton „Documente asociate”.
   - Filtre: 2–3 controale max (chips/select) + „Reset”.
   - Stări: loading skeleton, empty, error (mesaj + retry).
3. Timeline complet
   - Desktop: vertical cu ancore; Mobile: accordion.
   - Interacțiuni: expand/collapse, deep-link (#milestone-xyz), highlight „astăzi”.
4. Documente
   - Grid/tabel: categorie, titlu, dată, acțiuni.
   - Căutare simplă + filtrare categorie.
   - Preview: modal (PDF/image) când e disponibil; altfel download.
5. Media/galerie
   - Masonry/grid cu imagini optimizate; captions + alt text.
6. Fallback fără JS (obligatoriu)
   - În `<noscript>`: listă proiecte + link-uri documente + timeline în HTML static; mesaj pentru activare JS.

---

## Pagina CET AI (/cet-ai)
### Meta
- Title: "CET AI Demo | Solaris CET"
- Description: demo live prin endpoint securizat, cu stări UX și privacy notice.

### Page Structure
- 2 coloane: stânga demo UI, dreapta explicații/FAQ scurt.

### Secțiuni & componente
1. Demo UI (live)
   - Input:
     - textarea cu contor caractere + dropdown „Scenariu” (preset) + buton „Rulează”.
     - link mic „Nu introduce date personale” (tooltip/modal cu privacy).
   - Output:
     - panel rezultat cu stilizare pentru secțiuni RAV.
     - butoane: „Copiază”, „Resetează”, „Stop” (abort), „Retry”.
   - Integrare endpoint:
     - trimite exclusiv către `POST /api/chat`.
     - erori:
       - `429`: mesaj „Rate limit” + retry (și opțional countdown).
       - `5xx`/network: „Serviciu indisponibil” + retry.
2. Explicații, limite și confidențialitate
   - Bullets: ce face / ce nu face; mențiune despre context on-chain (DeDust) când e disponibil.
   - Privacy notice (vizibil): nu introduce date personale; conversația nu este salvată server-side.
   - CTA: contact.

---

## Ghid performanță/SEO (aplicat UI)
- Imagini & media:
  - responsive `srcset`/`sizes`, lazy-load sub fold, placeholder blur/inline SVG, `alt` obligatoriu.
  - fallback vizual (gradient) dacă asset-ul lipsește.
- Animații:
  - dezactivate pentru `prefers-reduced-motion`; throttling pe scroll (parallax) și pe typing.
- Script-uri:
  - code-splitting pe rute; încarcă librăria de hartă doar pe `/rwa`.
- API /api/chat:
  - timeout/abort pe request; buton „Stop”; retry.
- SEO:
  - H1 unic/pagină; OG image consistent; canonical pe fiecare rută; internal linking `/` ↔ `/rwa` ↔ `/cet-ai`.
