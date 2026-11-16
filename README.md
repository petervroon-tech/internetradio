# 📻 PeterVroon Radio Wereldwijd

> **Live online applicatie:** [https://petervroon-tech.github.io/internetradio/](https://petervroon-tech.github.io/internetradio/)

**PeterVroon Radio** is een moderne, vloeiende en donkere webapplicatie om wereldwijd naar duizenden internetradiostations te luisteren per continent, live audio te visualiseren in 60 FPS, en met één klik live muziek of gepraat direct op te nemen en te downloaden als **MP3** (`.mp3`).

Ontworpen en gebouwd volgens de strikte Antigravity richtlijnen in `AGENTS.md` ("Smooth, Donker & Nooit Lomp of Wit Vierkant").

---

## ✨ Belangrijkste Mogelijkheden

### 🌍 1. Radiostations per Continent & Land
- **Continentenkiezer:** Blader direct door radiostations in **Europa**, **Noord-Amerika**, **Zuid-Amerika**, **Azië**, **Afrika** en **Oceanië**.
- **Land- & Genrefilters:** Filter op land of kies uit populaire genres zoals Pop, Rock, Nieuws & Praat, Jazz, Klassiek, Electronic, Ambient/Chillout en meer.
- **Hybride Station Engine:** Vooraf uitgerust met meer dan 40 populaire, direct werkende zenders wereldwijd, plus live integratie met de open wereldwijde Radio-Browser directory (>40.000 live streams).

### 🎙️ 2. Live MP3 Opname Studio
- **Direct Live Opnemen:** Hoor je een mooi liedje, een interessant interview of gepraat op de radio? Klik op **🔴 Start MP3 Opname** (of sneltoets `R`).
- **Ingebouwde Pure JS LAME MP3 Encoder:** Zet de ruwe PCM audiostream in real-time om naar een authentiek **MP3** audiobestand (`audio/mp3`).
- **Instelbare Kwaliteit:** Keuze tussen 128 kbps (compact), 192 kbps (standaard hoge kwaliteit) of 320 kbps (studio MP3).
- **Direct Downloaden & Sessie-Opnames:** Download het bestand direct automatisch naar je computer of smartphone en beluister opnames direct terug in de sessielijst.

### 📊 3. 60 FPS Audio Visualizer & Telemetrie
- **Realtime Spectrum & Golfvorm:** Vloeiende hardware-versnelde visualizer met frequentiebalken en neon oscilloscoop-modus.
- **Stereo VU Piekmeters:** Realtime piek- en RMS-meting voor het linker- en rechterkanaal in decibels (dB).
- **Live Telemetrie:** Toont samplerate (44.1 / 48 kHz), audiocodec, stream-bitrate en bufferstatus.

### 📱 4. Responsief Glassmorphism Design
- **Dark Glass Esthetiek:** Donkere achtergronden (`rgba(9, 14, 26, 0.92)`), afgeronde pillen (`border-radius: 999px`) en neon accenten.
- **Desktop & iPad:** Optimale split-screen indeling (links station-explorer, rechts speler, visualizer en opnamestudio).
- **Smartphones:** Touch-vriendelijke 1-tap weergave met snelle wisselknop tussen radiozenders en opnamestudio.

### 💡 5. Dynamische Help & Handleiding
- Direct toegankelijke Help-modal (`💡 Help`) met de `✓ Altijd Actueel` badge, automatisch gesynchroniseerd met `version.json` bij elke build.

---

## ⌨️ Sneltoetsen

| Toets | Actie |
| :--- | :--- |
| <kbd>Spatie</kbd> | Afspelen / Pauzeren |
| <kbd>R</kbd> | Start / Stop MP3 Opname |
| <kbd>M</kbd> | Dempen (Mute / Unmute) |
| <kbd>F</kbd> | Huidig station toevoegen aan / verwijderen uit Favorieten |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Volume verhogen / verlagen |
| <kbd>?</kbd> of <kbd>H</kbd> | Help & Handleiding openen |
| <kbd>Esc</kbd> | Help- of Favorieten-venster sluiten |

---

## 🚀 Automatische Deployment

Elke commit op de `main` branch bouwt en publiceert de app direct automatisch naar GitHub Pages via GitHub Actions:
- **Build Script:** `build.py --ci`
- **Workflow:** `.github/workflows/deploy.yml`
- **Online URL:** [https://petervroon-tech.github.io/internetradio/](https://petervroon-tech.github.io/internetradio/)
