# Coordonare agenți (Trae)

Acest repo folosește un „owner agent” care coordonează execuția în paralel astfel încât modificările să nu se calce și verificările să fie coerente.

## Reguli rapide

- Un singur responsabil pe fișiere: evită editarea simultană a acelorași fișiere/directoare.
- Separă pe ownership: `app/` (UI), `app/api/` (API), `app/db/` (schema), `scripts/` (tooling), `docs/` (documentație).
- Nu introduce schimbări „latente” (fișiere noi, endpoints, pagini) dacă nu rezolvă un blocant concret.
- Orice modificare trebuie închisă cu verificare: `npm run build --workspace=app` și `npm run test --workspace=app`.

## Handoff minim între agenți

- Ce fișiere au fost atinse.
- Ce erori au fost observate (1–3 linii relevante).
- Fix propus (1–2 propoziții) + cum se verifică.

## Convenție pentru patch-uri

- Preferă patch-uri mici, localizate.
- Evită modificări în masă fără motiv (de ex. schimbări de stil/format necerute).
- Dacă un test e fragil, fixează testul (mock/async) sau comportamentul observabil, nu ambele simultan.
