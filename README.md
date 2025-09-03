# Prospetto di Cassa — Vite + React + TS + Tailwind

## Sviluppo locale
```bash
npm ci
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Deploy su GitHub Pages
1) Crea un repository su GitHub (es. `prospetto-cassa`).  
2) In questa cartella:
```bash
git init
git add .
git commit -m "init"
git branch -M main
git remote add origin https://github.com/<TUO-UTENTE>/<REPO>.git
git push -u origin main
```
3) In **Settings → Pages**, scegli **GitHub Actions**.  
   Il workflow pubblicherà su `https://<TUO-UTENTE>.github.io/<REPO>/`.
