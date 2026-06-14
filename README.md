# webodai.cz

Generátor jednoduchých one-page webů pro živnostníky a malé firmy.

## Architektura

- Frontend: React + Vite, staticky nasazený na GitHub Pages.
- API: samostatný Cloudflare Worker v `cloudflare/worker.js`.
- AI: Anthropic Messages API přes worker, nikdy přímo z prohlížeče.
- Výstup: jeden HTML soubor, který si zákazník stáhne a nahraje na hosting.

## Lokální spuštění

```bash
npm install
npm run dev
```

Volitelně lze změnit endpoint workeru přes:

```bash
VITE_WORKER_URL=https://example.workers.dev npm run dev
```

## Cloudflare Worker

Worker potřebuje secret:

```bash
ANTHROPIC_API_KEY=...
```

Volitelné proměnné:

```bash
ALLOWED_ORIGINS=https://webodai.cz,https://www.webodai.cz,http://localhost:5173
```

## Nasazení

GitHub Actions buildí Vite aplikaci a publikuje `dist` na GitHub Pages s CNAME `webodai.cz`.

## Zatím demo části

- Platba přes SimpleShop ještě není napojená.
- Limit 3 generování je zatím jen ve frontendu, ne serverově.
- Odeslání hotového webu emailem zatím není napojené.
- Obchodní podmínky a ochrana osobních údajů pro webodai.cz je potřeba doplnit před ostrým prodejem.

## Testovací checklist před spuštěním

- Vyplnit minimální formulář bez fotek a ověřit, že vznikne kompletní HTML.
- Vyplnit formulář s hero fotkou, logem a galerií a ověřit velikost i náhled.
- Ověřit, že worker vrací srozumitelnou chybu při špatném nebo chybějícím `ANTHROPIC_API_KEY`.
- Ověřit CORS jen z povolených domén.
- Ověřit stažení HTML a ruční nahrání na běžný hosting.
- Otestovat výsledek na mobilu, tabletu a desktopu.
- Před ostrým provozem napojit SimpleShop a serverově hlídat počet generování.
