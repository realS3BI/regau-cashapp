# Regau Cash App

Eine moderne Einkaufs-App für Teams mit PWA-Unterstützung, entwickelt mit React, Vite, Convex und shadcn/ui.

## Features

- 🛒 **Warenkorb-System**: Einfaches Hinzufügen und Verwalten von Artikeln
- 👥 **Team-basiert**: Mehrere Teams mit eigenen Produkten und Kategorien
- 📱 **PWA**: Installierbar auf mobilen Geräten und Tablets
- 🎨 **Moderne UI**: Responsive Design mit shadcn/ui Komponenten
- 🔐 **Admin-Panel**: Verwaltung von Produkten, Kategorien und Einkäufen
- 🇩🇪 **Deutsche Sprache**: Vollständig auf Deutsch lokalisiert

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Convex (Real-time Database)
- **UI**: shadcn/ui + Tailwind CSS (New York Style, CSS Variables)
- **Routing**: React Router v6
- **PWA**: vite-plugin-pwa

## Setup

### Voraussetzungen

- Node.js 18+ und npm/pnpm
- Convex Account (kostenlos auf [convex.dev](https://convex.dev))

### Installation

1. **Dependencies installieren:**

   ```bash
   npm install
   # oder
   pnpm install
   ```

2. **Convex Setup:**

   ```bash
   npx convex dev
   ```

   Folgen Sie den Anweisungen, um Ihr Convex-Projekt zu initialisieren.

3. **Umgebungsvariablen:**
   Erstellen Sie eine `.env` Datei im Root-Verzeichnis:

   ```env
   VITE_CONVEX_URL=https://your-project.convex.cloud
   ADMIN_PASSWORD=your-secure-password-here
   ```

4. **Shadcn/ui – weitere Komponenten:**
   Die Konfiguration liegt in `components.json`. Neue Komponenten hinzufügen:

   ```bash
   pnpm dlx shadcn@latest add <komponente>
   ```

   Beispiel: `pnpm dlx shadcn@latest add dropdown-menu`

5. **PWA Icons:**
   Ersetzen Sie die Platzhalter-Icons in `public/`:
   - `pwa-192x192.png` (192x192 Pixel)
   - `pwa-512x512.png` (512x512 Pixel)
   - `favicon.ico`

### Entwicklung

```bash
# Frontend und Convex gleichzeitig starten (Convex startet Vite automatisch)
npm run dev

# Oder nur Vite (wenn Convex bereits läuft):
npx vite

# Convex separat:
npm run convex:dev
```

Die App läuft dann auf `http://localhost:5173`

### Build

```bash
npm run build
```

## Projektstruktur

```
regau-cashapp/
├── src/
│   ├── components/         # UI Komponenten
│   ├── pages/              # Seiten
│   ├── hooks/              # Custom Hooks
│   └── lib/                # Utilities
├── public/                 # Statische Assets
├── convex/                 # Convex Backend
│   ├── schema.ts           # Datenbank Schema
│   ├── teams.ts            # Team Funktionen
│   ├── categories.ts       # Kategorie Funktionen
│   ├── products.ts         # Produkt Funktionen
│   ├── purchases.ts        # Kauf Funktionen
│   └── auth.ts             # Admin Authentifizierung
├── index.html
├── vite.config.ts
└── package.json
```

## Verwendung

### Als Benutzer

1. Öffnen Sie die App im Browser
2. Wählen Sie ein Team aus
3. Durchsuchen Sie Kategorien und Produkte
4. Fügen Sie Artikel zum Warenkorb hinzu
5. Bezahlen Sie über den "Bezahlen" Button

### Als Admin

1. Navigieren Sie zu `/admin/login`
2. Geben Sie das Admin-Passwort ein (aus `.env`)
3. Verwalten Sie Teams, Kategorien und Produkte
4. Sehen Sie die Kaufhistorie ein

## Mobile Installation (PWA)

1. Öffnen Sie die App auf Ihrem mobilen Gerät
2. Tippen Sie auf "Zum Startbildschirm hinzufügen" (Browser-Menü)
3. Die App wird wie eine native App installiert

## Lizenz

MIT
