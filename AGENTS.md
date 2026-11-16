# Antigravity Project Richtlijnen & UI Voorkeuren - Internet Radio

Deze richtlijnen gelden voor alle huidige en toekomstige aanpassingen en updates van de Internet Radio applicatie.

## 1. UI & Design Standaard: "Smooth, Donker & Nooit Lomp of Wit Vierkant"
- **Geen grote witte of vierkante blokken:** Gebruik nooit standaard witte vierkante tooltips, popups of lompe kaders die de interface of visualizer blokkeren.
- **Altijd "smooth" en afgerond:**
  - Badges, labels en tooltips hebben altijd afgeronde pil-vormen (`border-radius: 999px` of subtiel afgeronde hoeken `10px - 16px`).
  - Gebruik donkere glas-esthetiek (glassmorphism met `rgba(9, 14, 26, 0.88)` tot `0.94`, `backdrop-filter: blur(16px)`, subtiele borders `rgba(255, 255, 255, 0.08)`).
- **Smartphone-optimalisatie:**
  - Op mobiel (schermen $\le$ 680px) moeten labels en knoppen compact, strak en subtiel zijn (`0.64rem - 0.72rem`).
  - Geen enkele horizontale overflow of afgekipte popups; knoppen en lettergroottes schalen strak mee.
  - Eenvoudige 1-tap wisselknop tussen radio-zenderoverzicht en actieve audiospeler / opnamestudio.

## 2. Real-time Audio, Visualizer & Telemetrie
- Live spectrum analyzer en golfvorm (oscilloscope) renderen vloeiend op 60 FPS met hardware-versnelde canvas rendering.
- Vloeiende VU-piekmeters (Stereo L/R in dB) en live telemetrie (bitrate, audiocodec, latency, buffergezondheid).
- Geen schokken of vertragingen tijdens het afspelen of schakelen tussen radiostations.
- MP3 live-opnamestudio: Direct met één klik opnemen van live muziek of gepraat en direct downloaden als echt MP3-bestand (`.mp3`).

## 3. Helpfile & Documentatie Standaard
- Bouw altijd een direct toegankelijke Help-modal (`💡 Help`).
- De featurelijst in de Help-modal moet dynamisch gesynchroniseerd zijn met `version.json` via het build-script (`build.py`), zodat de documentatie na elke build automatisch 100% actueel is met een `✓ Altijd Actueel` badge.

## 4. Deployment & GitHub Online Standaard: Alleen Online via GitHub
- **Niet meer lokaal, alleen online via GitHub:** Alle huidige en nieuw te bouwen apps worden direct en exclusief online gepubliceerd via GitHub (GitHub Pages en GitHub Actions CI/CD).
- **Directe automatische uitrol:** Elke wijziging wordt direct vastgelegd in Git en gepusht naar de `main` branch op GitHub, waarna de online build-pipeline (`.github/workflows/deploy.yml`) de nieuwste versie direct live zet op `https://petervroon-tech.github.io/internetradio/`.
- **Automatische live update:** De app controleert via `version.json` periodiek of er online op GitHub een nieuwere build beschikbaar is en toont subtiel een directe update-mogelijkheid.

## 5. Volledige Responsiviteit & Proporties (Laptops, iPads & Smartphones)
- **Laptops & Desktops ($\ge$ 1024px):** Standaard optimale side-by-side (split) indeling: links zenders & continentenkiezer, rechts actieve speler, visualizer en MP3-opnamestudio.
- **iPads & Tablets (681px - 1023px):** Optimale verhoudingen in zowel portrait als landscape met flexibele knoppenbalk en touch-vriendelijke bediening.
- **Smartphones ($\le$ 680px):** Schermvullende 1-tap weergave met veilige marges (`env(safe-area-inset-bottom)`).
