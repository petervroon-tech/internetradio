/**
 * PeterVroon Radio - Core Application Engine
 * ==========================================
 * - Radiostations per continent & live zoekfunctie (Radio-Browser API + Curated Fallback)
 * - 60 FPS Audio Visualizer (Spectrum & Golfvorm) & Stereo VU Piekmeters
 * - Live MP3 Opname Studio met ingebouwde pure-JS LAME MP3-encoder (128, 192, 320 kbps)
 * - Dynamische version.json Help-synchronisatie conform AGENTS.md
 */

// ==========================================================================
// 1. Continenten & Landen Configuratie
// ==========================================================================
const CONTINENTS = {
  europe: {
    name: "Europa",
    flag: "🇪🇺",
    countries: {
      NL: "Nederland", BE: "België", DE: "Duitsland", GB: "Verenigd Koninkrijk",
      FR: "Frankrijk", ES: "Spanje", IT: "Italië", CH: "Zwitserland",
      AT: "Oostenrijk", SE: "Zweden", NO: "Noorwegen", DK: "Denemarken",
      FI: "Finland", PL: "Polen", IE: "Ierland", PT: "Portugal",
      GR: "Griekenland", CZ: "Tsjechië", RO: "Roemenië", UA: "Oekraïne"
    }
  },
  north_america: {
    name: "Noord-Amerika",
    flag: "🇺🇸",
    countries: {
      US: "Verenigde Staten", CA: "Canada", MX: "Mexico", JM: "Jamaica",
      CU: "Cuba", DO: "Dominicaanse Rep.", CR: "Costa Rica", PA: "Panama"
    }
  },
  south_america: {
    name: "Zuid-Amerika",
    flag: "🇧🇷",
    countries: {
      BR: "Brazilië", AR: "Argentinië", CL: "Chili", CO: "Colombia",
      PE: "Peru", VE: "Venezuela", UY: "Uruguay", EC: "Ecuador"
    }
  },
  asia: {
    name: "Azië",
    flag: "🇯🇵",
    countries: {
      JP: "Japan", KR: "Zuid-Korea", IN: "India", CN: "China",
      TW: "Taiwan", ID: "Indonesië", TH: "Thailand", SG: "Singapore",
      TR: "Turkije", IL: "Israël", AE: "Verenigde Arabische Emiraten", SA: "Saoedi-Arabië"
    }
  },
  africa: {
    name: "Afrika",
    flag: "🇿🇦",
    countries: {
      ZA: "Zuid-Afrika", EG: "Egypte", NG: "Nigeria", KE: "Kenia",
      GH: "Ghana", MA: "Marokko", TN: "Tunesië", SN: "Senegal"
    }
  },
  oceania: {
    name: "Oceanië",
    flag: "🇦🇺",
    countries: {
      AU: "Australië", NZ: "Nieuw-Zeeland", FJ: "Fiji", PG: "Papoea-Nieuw-Guinea"
    }
  }
};

// Snelkoppeling countrycode -> continent
const COUNTRY_TO_CONTINENT = {};
Object.entries(CONTINENTS).forEach(([contKey, contData]) => {
  Object.keys(contData.countries).forEach(code => {
    COUNTRY_TO_CONTINENT[code] = contKey;
  });
});

// ==========================================================================
// 2. Curated Stations (Direct speelklaar binnen 50ms)
// ==========================================================================
const CURATED_STATIONS = [
  // Europa - Nederland & België
  {
    id: "npo-radio-1",
    name: "NPO Radio 1",
    country: "Nederland",
    countrycode: "NL",
    continent: "europe",
    tags: "news,talk,public,sport",
    codec: "MP3",
    bitrate: 192,
    url: "https://icecast.omroep.nl/radio1-bb-mp3",
    favicon: "https://www.nporadio1.nl/images/favicons/favicon.ico",
    votes: 9500
  },
  {
    id: "npo-radio-2",
    name: "NPO Radio 2",
    country: "Nederland",
    countrycode: "NL",
    continent: "europe",
    tags: "pop,rock,top2000,classic",
    codec: "MP3",
    bitrate: 192,
    url: "https://icecast.omroep.nl/radio2-bb-mp3",
    favicon: "https://www.nporadio2.nl/images/favicons/favicon.ico",
    votes: 9800
  },
  {
    id: "npo-3fm",
    name: "NPO 3FM",
    country: "Nederland",
    countrycode: "NL",
    continent: "europe",
    tags: "pop,indie,rock,alternative",
    codec: "MP3",
    bitrate: 192,
    url: "https://icecast.omroep.nl/3fm-bb-mp3",
    favicon: "https://www.npo3fm.nl/images/favicons/favicon.ico",
    votes: 8900
  },
  {
    id: "qmusic-nl",
    name: "Qmusic Nederland",
    country: "Nederland",
    countrycode: "NL",
    continent: "europe",
    tags: "pop,hits,top40",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.qmusic.nl/qmusic/mp3",
    favicon: "https://qmusic.nl/favicon.ico",
    votes: 9100
  },
  {
    id: "studio-brussel",
    name: "Studio Brussel",
    country: "België",
    countrycode: "BE",
    continent: "europe",
    tags: "rock,indie,alternative,dance",
    codec: "MP3",
    bitrate: 128,
    url: "https://icecast.vrtcdn.be/stubru-high.mp3",
    favicon: "https://stubru.be/favicon.ico",
    votes: 8700
  },
  {
    id: "mnm-be",
    name: "VRT MNM",
    country: "België",
    countrycode: "BE",
    continent: "europe",
    tags: "hits,pop,dance",
    codec: "MP3",
    bitrate: 128,
    url: "https://icecast.vrtcdn.be/mnm-high.mp3",
    favicon: "https://mnm.be/favicon.ico",
    votes: 7500
  },

  // Europa - Verenigd Koninkrijk & Duitsland & Frankrijk
  {
    id: "bbc-radio-1",
    name: "BBC Radio 1",
    country: "Verenigd Koninkrijk",
    countrycode: "GB",
    continent: "europe",
    tags: "pop,dance,chart,electronic",
    codec: "AAC",
    bitrate: 128,
    url: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one",
    favicon: "https://www.bbc.co.uk/favicon.ico",
    votes: 14500
  },
  {
    id: "bbc-radio-4",
    name: "BBC Radio 4",
    country: "Verenigd Koninkrijk",
    countrycode: "GB",
    continent: "europe",
    tags: "news,talk,culture,drama",
    codec: "AAC",
    bitrate: 128,
    url: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm",
    favicon: "https://www.bbc.co.uk/favicon.ico",
    votes: 11200
  },
  {
    id: "1live-de",
    name: "1LIVE WDR",
    country: "Duitsland",
    countrycode: "DE",
    continent: "europe",
    tags: "pop,dance,hits",
    codec: "MP3",
    bitrate: 128,
    url: "https://wdr-1live-live.icecast.wdr.de/wdr/1live/live/mp3/128/stream.mp3",
    favicon: "https://www.wdr.de/favicon.ico",
    votes: 12100
  },
  {
    id: "radio-eins-de",
    name: "Radio Eins rbb",
    country: "Duitsland",
    countrycode: "DE",
    continent: "europe",
    tags: "rock,indie,culture,talk",
    codec: "MP3",
    bitrate: 192,
    url: "https://rbb-radioeins-live.icecast.rbb-online.de/rbb/radioeins/live/mp3/192/stream.mp3",
    favicon: "https://www.radioeins.de/favicon.ico",
    votes: 9400
  },
  {
    id: "fip-paris",
    name: "FIP Radio Paris",
    country: "Frankrijk",
    countrycode: "FR",
    continent: "europe",
    tags: "jazz,eclectic,world,chillout",
    codec: "MP3",
    bitrate: 192,
    url: "https://icecast.radiofrance.fr/fip-midfi.mp3",
    favicon: "https://www.radiofrance.fr/fip/favicon.ico",
    votes: 13800
  },
  {
    id: "swiss-classic",
    name: "Radio Swiss Classic",
    country: "Zwitserland",
    countrycode: "CH",
    continent: "europe",
    tags: "classical,relaxing,symphony",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.srg-ssr.ch/m/rsc_de/mp3_128",
    favicon: "https://www.radioswissclassic.ch/favicon.ico",
    votes: 9200
  },

  // Noord-Amerika
  {
    id: "kexp-seattle",
    name: "KEXP 90.3 FM Seattle",
    country: "Verenigde Staten",
    countrycode: "US",
    continent: "north_america",
    tags: "indie,alternative,rock,eclectic",
    codec: "MP3",
    bitrate: 160,
    url: "https://kexp.streamguys1.com/kexp160.mp3",
    favicon: "https://kexp.org/favicon.ico",
    votes: 21500
  },
  {
    id: "wnyc-fm",
    name: "WNYC 93.9 FM New York",
    country: "Verenigde Staten",
    countrycode: "US",
    continent: "north_america",
    tags: "news,talk,npr,culture",
    codec: "MP3",
    bitrate: 128,
    url: "https://fm939.wnyc.org/wnycfm",
    favicon: "https://www.wnyc.org/favicon.ico",
    votes: 16400
  },
  {
    id: "somafm-groove",
    name: "SomaFM: Groove Salad",
    country: "Verenigde Staten",
    countrycode: "US",
    continent: "north_america",
    tags: "ambient,downtempo,chillout,electronic",
    codec: "MP3",
    bitrate: 128,
    url: "https://ice1.somafm.com/groovesalad-128-mp3",
    favicon: "https://somafm.com/favicon.ico",
    votes: 26800
  },
  {
    id: "somafm-secret",
    name: "SomaFM: Secret Agent",
    country: "Verenigde Staten",
    countrycode: "US",
    continent: "north_america",
    tags: "lounge,spy,soundtrack,vintage",
    codec: "MP3",
    bitrate: 128,
    url: "https://ice1.somafm.com/secretagent-128-mp3",
    favicon: "https://somafm.com/favicon.ico",
    votes: 18200
  },
  {
    id: "defcon-radio",
    name: "SomaFM: DEF CON Radio",
    country: "Verenigde Staten",
    countrycode: "US",
    continent: "north_america",
    tags: "electronic,chiptune,hacker,dance",
    codec: "MP3",
    bitrate: 128,
    url: "https://ice1.somafm.com/defcon-128-mp3",
    favicon: "https://somafm.com/favicon.ico",
    votes: 15100
  },
  {
    id: "cbc-radio-one",
    name: "CBC Radio One Toronto",
    country: "Canada",
    countrycode: "CA",
    continent: "north_america",
    tags: "news,talk,canadian,current",
    codec: "MP3",
    bitrate: 128,
    url: "https://cbcliveradio.akamaized.net/hls/live/2041054/ES_R1EST/master.m3u8",
    favicon: "https://www.cbc.ca/favicon.ico",
    votes: 8400
  },

  // Zuid-Amerika
  {
    id: "jovem-pan-br",
    name: "Jovem Pan FM São Paulo",
    country: "Brazilië",
    countrycode: "BR",
    continent: "south_america",
    tags: "pop,hits,dance,brazilian",
    codec: "MP3",
    bitrate: 128,
    url: "https://27153.live.streamtheworld.com/JP_SP_FMAAC.aac",
    favicon: "https://jovempan.com.br/favicon.ico",
    votes: 13200
  },
  {
    id: "radio-mitre-ar",
    name: "Radio Mitre 790 AM",
    country: "Argentinië",
    countrycode: "AR",
    continent: "south_america",
    tags: "news,talk,tango,politics",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.cienradios.com/MitreAM790.mp3",
    favicon: "https://radiomitre.cienradios.com/favicon.ico",
    votes: 11400
  },
  {
    id: "adn-radio-cl",
    name: "ADN Radio Chile",
    country: "Chili",
    countrycode: "CL",
    continent: "south_america",
    tags: "news,sports,chile,talk",
    codec: "MP3",
    bitrate: 128,
    url: "https://23873.live.streamtheworld.com/ADN_SC",
    favicon: "https://www.adnradio.cl/favicon.ico",
    votes: 7900
  },
  {
    id: "caracol-radio-co",
    name: "Caracol Radio Bogotá",
    country: "Colombia",
    countrycode: "CO",
    continent: "south_america",
    tags: "news,colombia,talk,latin",
    codec: "MP3",
    bitrate: 128,
    url: "https://23873.live.streamtheworld.com/CARACOL_RADIO_SC",
    favicon: "https://caracol.com.co/favicon.ico",
    votes: 8300
  },

  // Azië
  {
    id: "tokyo-fm-jp",
    name: "Tokyo FM 80.0",
    country: "Japan",
    countrycode: "JP",
    continent: "asia",
    tags: "jpop,japanese,pop,culture",
    codec: "AAC",
    bitrate: 128,
    url: "https://stream.j-pop.su/listen/j-pop/radio.mp3",
    favicon: "https://www.tfm.co.jp/favicon.ico",
    votes: 16900
  },
  {
    id: "big-fm-india",
    name: "Big FM 92.7 Bollywood",
    country: "India",
    countrycode: "IN",
    continent: "asia",
    tags: "bollywood,hindi,indian,hits",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.zeno.fm/f3wvbbqmdg8uv",
    favicon: "https://bigfmindia.com/favicon.ico",
    votes: 14700
  },
  {
    id: "kbs-world-korea",
    name: "KBS World Radio",
    country: "Zuid-Korea",
    countrycode: "KR",
    continent: "asia",
    tags: "kpop,korean,news,talk",
    codec: "MP3",
    bitrate: 128,
    url: "https://world.kbs.co.kr/live/ch1.mp3",
    favicon: "https://world.kbs.co.kr/favicon.ico",
    votes: 11800
  },
  {
    id: "asia-dream-radio",
    name: "Asia DREAM Radio Japan Hits",
    country: "Japan",
    countrycode: "JP",
    continent: "asia",
    tags: "jpop,anime,soundtrack,hits",
    codec: "MP3",
    bitrate: 128,
    url: "https://igor.torontocast.com:1025/stream",
    favicon: "https://asiadreamradio.com/favicon.ico",
    votes: 9800
  },

  // Afrika
  {
    id: "jacaranda-fm-za",
    name: "Jacaranda FM 94.2",
    country: "Zuid-Afrika",
    countrycode: "ZA",
    continent: "africa",
    tags: "pop,hits,adultcontemporary",
    codec: "MP3",
    bitrate: 128,
    url: "https://edge.iono.fm/xice/19_med.mp3",
    favicon: "https://www.jacarandafm.com/favicon.ico",
    votes: 9200
  },
  {
    id: "metro-fm-za",
    name: "SABC Metro FM",
    country: "Zuid-Afrika",
    countrycode: "ZA",
    continent: "africa",
    tags: "urban,rnb,hiphop,afrobeats",
    codec: "MP3",
    bitrate: 128,
    url: "https://edge.iono.fm/xice/28_med.mp3",
    favicon: "https://www.metrofm.co.za/favicon.ico",
    votes: 8600
  },
  {
    id: "classic-fm-ng",
    name: "Classic FM 97.3 Lagos",
    country: "Nigeria",
    countrycode: "NG",
    continent: "africa",
    tags: "classic,pop,afrobeats,lagos",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.zeno.fm/43gug972n8quv",
    favicon: "https://classic97.net/favicon.ico",
    votes: 6800
  },

  // Oceanië
  {
    id: "triple-j-au",
    name: "ABC Triple J",
    country: "Australië",
    countrycode: "AU",
    continent: "oceania",
    tags: "indie,alternative,australian,rock",
    codec: "AAC",
    bitrate: 128,
    url: "https://live-radio01.mediahubaustralia.com/2TJW/aac/",
    favicon: "https://www.abc.net.au/triplej/favicon.ico",
    votes: 18900
  },
  {
    id: "abc-news-au",
    name: "ABC News Radio",
    country: "Australië",
    countrycode: "AU",
    continent: "oceania",
    tags: "news,talk,currentaffairs,australia",
    codec: "AAC",
    bitrate: 128,
    url: "https://live-radio01.mediahubaustralia.com/PBW/aac/",
    favicon: "https://www.abc.net.au/news/favicon.ico",
    votes: 9700
  },
  {
    id: "rnz-national-nz",
    name: "RNZ National 101 FM",
    country: "Nieuw-Zeeland",
    countrycode: "NZ",
    continent: "oceania",
    tags: "news,talk,stories,newzealand",
    codec: "MP3",
    bitrate: 128,
    url: "https://radionz-ice.streamguys.com/national.mp3",
    favicon: "https://www.rnz.co.nz/favicon.ico",
    votes: 8100
  }
];

// ==========================================================================
// 3. Applicatie Staat & Initialisatie
// ==========================================================================
const State = {
  // Filters & Weergave
  activeContinent: "all",
  activeCountry: "",
  activeGenre: "",
  activeSort: "votes",
  searchQuery: "",
  
  // Zenderdata
  stations: [...CURATED_STATIONS],
  favorites: [],
  currentStation: null,
  isPlaying: false,
  isBuffering: false,

  // Audio Context & Nodes
  audioCtx: null,
  sourceNode: null,
  analyserNode: null,
  visMode: "bars", // 'bars' | 'wave'

  // MP3 Opnamestudio
  isRecording: false,
  recorderNode: null,
  mp3Encoder: null,
  mp3DataChunks: [],
  recordingStartTime: 0,
  recordingTimerInterval: null,
  recordedSamplesCount: 0,
  recordedBytesEstimate: 0,
  savedRecordings: [],

  // Mobile split toggle
  mobileView: "stations" // 'stations' | 'player'
};

// DOM Referenties
const DOM = {
  audio: document.getElementById("audioPlayer"),
  stationList: document.getElementById("stationList"),
  stationCountText: document.getElementById("stationCountText"),
  countrySelect: document.getElementById("countrySelect"),
  sortSelect: document.getElementById("sortSelect"),
  stationSearch: document.getElementById("stationSearch"),
  btnClearSearch: document.getElementById("btnClearSearch"),
  loadingIndicator: document.getElementById("loadingIndicator"),
  emptyState: document.getElementById("emptyState"),
  
  // Player
  btnMainPlay: document.getElementById("btnMainPlay"),
  playIconSvg: document.getElementById("playIconSvg"),
  vinylDisc: document.getElementById("vinylDisc"),
  stationLogo: document.getElementById("stationLogo"),
  liveStreamBadge: document.getElementById("liveStreamBadge"),
  liveStatusText: document.getElementById("liveStatusText"),
  nowPlayingTitle: document.getElementById("nowPlayingTitle"),
  nowPlayingCountry: document.getElementById("nowPlayingCountry"),
  nowPlayingFlag: document.getElementById("nowPlayingFlag"),
  nowPlayingTrack: document.getElementById("nowPlayingTrack"),
  nowPlayingCodec: document.getElementById("nowPlayingCodec"),
  nowPlayingBitrate: document.getElementById("nowPlayingBitrate"),
  btnMainFav: document.getElementById("btnMainFav"),
  mainFavIcon: document.getElementById("mainFavIcon"),
  btnPrevRandom: document.getElementById("btnPrevRandom"),
  btnNextRandom: document.getElementById("btnNextRandom"),
  btnMute: document.getElementById("btnMute"),
  volIcon: document.getElementById("volIcon"),
  volumeSlider: document.getElementById("volumeSlider"),
  volumePercent: document.getElementById("volumePercent"),

  // Visualizer & Telemetrie
  canvas: document.getElementById("visualizerCanvas"),
  visModeBars: document.getElementById("visModeBars"),
  visModeWave: document.getElementById("visModeWave"),
  vuLeftBar: document.getElementById("vuLeftBar"),
  vuRightBar: document.getElementById("vuRightBar"),
  vuLeftDb: document.getElementById("vuLeftDb"),
  vuRightDb: document.getElementById("vuRightDb"),
  telRate: document.getElementById("telRate"),
  telBuffer: document.getElementById("telBuffer"),
  telFps: document.getElementById("telFps"),

  // Opnamestudio
  btnRecordToggle: document.getElementById("btnRecordToggle"),
  recBtnIcon: document.getElementById("recBtnIcon"),
  recBtnText: document.getElementById("recBtnText"),
  recDot: document.getElementById("recDot"),
  recTimer: document.getElementById("recTimer"),
  recSizeEstimate: document.getElementById("recSizeEstimate"),
  recBitrate: document.getElementById("recBitrate"),
  chkAutoDownload: document.getElementById("chkAutoDownload"),
  recordingsList: document.getElementById("recordingsList"),
  noRecordingsState: document.getElementById("noRecordingsState"),
  recCountBadge: document.getElementById("recCountBadge"),

  // Modals & Bovenbalk
  btnFavorites: document.getElementById("btnFavorites"),
  favCountBadge: document.getElementById("favCountBadge"),
  btnRandom: document.getElementById("btnRandom"),
  btnHelp: document.getElementById("btnHelp"),
  helpModal: document.getElementById("helpModal"),
  btnCloseHelp: document.getElementById("btnCloseHelp"),
  btnModalCloseDone: document.getElementById("btnModalCloseDone"),
  helpVersionBadge: document.getElementById("helpVersionBadge"),
  helpGitHash: document.getElementById("helpGitHash"),
  helpFeaturesList: document.getElementById("helpFeaturesList"),
  favoritesModal: document.getElementById("favoritesModal"),
  btnCloseFavs: document.getElementById("btnCloseFavs"),
  btnCloseFavsDone: document.getElementById("btnCloseFavsDone"),
  favList: document.getElementById("favList"),
  emptyFavsState: document.getElementById("emptyFavsState"),
  btnClearAllFavs: document.getElementById("btnClearAllFavs"),
  toastContainer: document.getElementById("toastContainer"),

  // Mobiel
  btnMobileToggle: document.getElementById("btnMobileToggle"),
  mobileSwitchIcon: document.getElementById("mobileSwitchIcon"),
  mobileSwitchText: document.getElementById("mobileSwitchText"),
  mainContainer: document.querySelector(".main-container")
};

// ==========================================================================
// 4. Initialisatie & Event Listeners
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  loadSavedFavorites();
  populateCountrySelect();
  renderStationList();
  setupEventListeners();
  initVisualizer();
  fetchVersionData();
  startVersionPolling();

  // Stel standaard volume in
  DOM.audio.volume = 0.8;
});

function setupEventListeners() {
  // Continent pill knoppen
  document.querySelectorAll(".continent-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".continent-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      State.activeContinent = btn.dataset.continent;
      State.activeCountry = "";
      populateCountrySelect();
      filterStations();
    });
  });

  // Genre pill filters
  document.querySelectorAll(".genre-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".genre-pill").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      State.activeGenre = btn.dataset.genre.toLowerCase();
      filterStations();
    });
  });

  // Land & Sorteer dropdowns
  DOM.countrySelect.addEventListener("change", (e) => {
    State.activeCountry = e.target.value;
    filterStations();
  });
  DOM.sortSelect.addEventListener("change", (e) => {
    State.activeSort = e.target.value;
    filterStations();
  });

  // Zoeken
  DOM.stationSearch.addEventListener("input", (e) => {
    State.searchQuery = e.target.value.trim().toLowerCase();
    DOM.btnClearSearch.style.display = State.searchQuery ? "inline-block" : "none";
    filterStations();
  });
  DOM.btnClearSearch.addEventListener("click", () => {
    DOM.stationSearch.value = "";
    State.searchQuery = "";
    DOM.btnClearSearch.style.display = "none";
    filterStations();
  });

  // Reset knop in empty-state
  document.getElementById("btnResetFilters")?.addEventListener("click", () => {
    State.activeContinent = "all";
    State.activeCountry = "";
    State.activeGenre = "";
    State.searchQuery = "";
    DOM.stationSearch.value = "";
    document.querySelectorAll(".continent-btn").forEach(b => b.classList.toggle("active", b.dataset.continent === "all"));
    document.querySelectorAll(".genre-pill").forEach(b => b.classList.toggle("active", b.dataset.genre === ""));
    populateCountrySelect();
    filterStations();
  });

  // Refresh zenders knop
  document.getElementById("btnReloadStations")?.addEventListener("click", () => {
    queryRadioBrowserApi(true);
  });

  // Audio Player Knoppen
  DOM.btnMainPlay.addEventListener("click", togglePlayCurrent);
  DOM.btnPrevRandom.addEventListener("click", playRandomStation);
  DOM.btnNextRandom.addEventListener("click", playRandomStation);
  DOM.btnRandom.addEventListener("click", playRandomStation);
  DOM.btnMainFav.addEventListener("click", toggleFavoriteCurrent);

  // Volume & Mute
  DOM.volumeSlider.addEventListener("input", (e) => {
    const val = parseInt(e.target.value, 10);
    DOM.audio.volume = val / 100;
    DOM.volumePercent.textContent = `${val}%`;
    updateVolumeIcon(val);
  });
  DOM.btnMute.addEventListener("click", toggleMute);

  // Visualizer modus wisselen
  DOM.visModeBars.addEventListener("click", () => {
    State.visMode = "bars";
    DOM.visModeBars.classList.add("active");
    DOM.visModeWave.classList.remove("active");
  });
  DOM.visModeWave.addEventListener("click", () => {
    State.visMode = "wave";
    DOM.visModeWave.classList.add("active");
    DOM.visModeBars.classList.remove("active");
  });

  // 🎙️ MP3 Opnameknop
  DOM.btnRecordToggle.addEventListener("click", toggleRecording);

  // Modals & Navigation
  DOM.btnHelp.addEventListener("click", openHelpModal);
  DOM.btnCloseHelp.addEventListener("click", closeHelpModal);
  DOM.btnModalCloseDone.addEventListener("click", closeHelpModal);
  DOM.btnFavorites.addEventListener("click", openFavoritesModal);
  DOM.btnCloseFavs.addEventListener("click", closeFavoritesModal);
  DOM.btnCloseFavsDone.addEventListener("click", closeFavoritesModal);
  DOM.btnClearAllFavs.addEventListener("click", clearAllFavorites);

  // Help tabs
  document.querySelectorAll(".help-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".help-tab").forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".help-tab-pane").forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      const targetPane = document.getElementById(`helpTab${tab.dataset.tab.charAt(0).toUpperCase() + tab.dataset.tab.slice(1)}`);
      if (targetPane) targetPane.classList.add("active");
    });
  });

  // Mobiele schermwissel
  DOM.btnMobileToggle.addEventListener("click", () => {
    if (State.mobileView === "stations") {
      State.mobileView = "player";
      DOM.mainContainer.classList.add("show-player");
      DOM.mobileSwitchIcon.textContent = "📻";
      DOM.mobileSwitchText.textContent = "Zenders";
    } else {
      State.mobileView = "stations";
      DOM.mainContainer.classList.remove("show-player");
      DOM.mobileSwitchIcon.textContent = "🎛️";
      DOM.mobileSwitchText.textContent = "Speler";
    }
  });

  // Audio Element Events
  DOM.audio.addEventListener("playing", () => {
    State.isPlaying = true;
    State.isBuffering = false;
    updatePlayerUI();
  });
  DOM.audio.addEventListener("pause", () => {
    State.isPlaying = false;
    updatePlayerUI();
  });
  DOM.audio.addEventListener("waiting", () => {
    State.isBuffering = true;
    updatePlayerUI();
  });
  DOM.audio.addEventListener("error", (e) => {
    State.isPlaying = false;
    State.isBuffering = false;
    updatePlayerUI();
    console.warn("Audio stream error:", e);
    showToast("⚠️ Stream niet bereikbaar of offline. Probeer een andere zender.");
  });

  // Sneltoetsen
  window.addEventListener("keydown", handleKeydown);
}

// ==========================================================================
// 5. Landen & Filters
// ==========================================================================
function populateCountrySelect() {
  DOM.countrySelect.innerHTML = '<option value="">🗺️ Alle Landen</option>';
  
  if (State.activeContinent === "all") {
    Object.values(CONTINENTS).forEach(cont => {
      const optgroup = document.createElement("optgroup");
      optgroup.label = `${cont.flag} ${cont.name}`;
      Object.entries(cont.countries).forEach(([code, name]) => {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = name;
        optgroup.appendChild(opt);
      });
      DOM.countrySelect.appendChild(optgroup);
    });
  } else {
    const cont = CONTINENTS[State.activeContinent];
    if (cont) {
      Object.entries(cont.countries).forEach(([code, name]) => {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = `${cont.flag} ${name}`;
        DOM.countrySelect.appendChild(opt);
      });
    }
  }
}

function filterStations() {
  let list = [...State.stations];

  // Filter op continent
  if (State.activeContinent !== "all") {
    list = list.filter(st => {
      const cCont = st.continent || COUNTRY_TO_CONTINENT[st.countrycode];
      return cCont === State.activeContinent;
    });
  }

  // Filter op specifiek land
  if (State.activeCountry) {
    list = list.filter(st => st.countrycode === State.activeCountry);
  }

  // Filter op genre
  if (State.activeGenre) {
    list = list.filter(st => (st.tags || "").toLowerCase().includes(State.activeGenre));
  }

  // Filter op zoekopdracht
  if (State.searchQuery) {
    list = list.filter(st => 
      st.name.toLowerCase().includes(State.searchQuery) ||
      (st.tags || "").toLowerCase().includes(State.searchQuery) ||
      (st.country || "").toLowerCase().includes(State.searchQuery)
    );
  }

  // Sortering
  if (State.activeSort === "votes") {
    list.sort((a, b) => (b.votes || 0) - (a.votes || 0));
  } else if (State.activeSort === "name") {
    list.sort((a, b) => a.name.localeCompare(b.name));
  } else if (State.activeSort === "bitrate") {
    list.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0));
  }

  renderStationList(list);

  // Als de lijst klein is of zoekopdracht actief is, probeer ook de Radio Browser API
  if (list.length < 5 && State.searchQuery.length >= 2) {
    queryRadioBrowserApi(false);
  }
}

// ==========================================================================
// 6. Radio Browser API Integratie
// ==========================================================================
let apiQueryTimer = null;
async function queryRadioBrowserApi(forceRefresh = false) {
  if (apiQueryTimer) clearTimeout(apiQueryTimer);
  
  DOM.loadingIndicator.style.display = "flex";
  
  apiQueryTimer = setTimeout(async () => {
    const servers = [
      "https://de1.api.radio-browser.info",
      "https://nl1.api.radio-browser.info",
      "https://at1.api.radio-browser.info"
    ];
    const server = servers[Math.floor(Math.random() * servers.length)];
    
    let url = `${server}/json/stations/search?limit=60&order=votes&reverse=true&hidebroken=true`;
    if (State.searchQuery) {
      url += `&name=${encodeURIComponent(State.searchQuery)}`;
    } else if (State.activeCountry) {
      url += `&countrycode=${encodeURIComponent(State.activeCountry)}`;
    } else if (State.activeGenre) {
      url += `&tag=${encodeURIComponent(State.activeGenre)}`;
    }

    try {
      const resp = await fetch(url, { headers: { "User-Agent": "AntigravityInternetRadio/1.0" } });
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data) && data.length > 0) {
          const apiStations = data.map(item => ({
            id: item.stationuuid || Math.random().toString(36).substring(2),
            name: item.name.trim(),
            country: item.country || "Wereldwijd",
            countrycode: item.countrycode || "",
            continent: COUNTRY_TO_CONTINENT[item.countrycode] || "all",
            tags: item.tags || "",
            codec: item.codec || "MP3",
            bitrate: item.bitrate || 128,
            url: item.url_resolved || item.url,
            favicon: item.favicon || "favicon.svg",
            votes: item.votes || 0
          }));

          // Voeg unieke stations samen met huidige state
          const existingIds = new Set(State.stations.map(s => s.id));
          const newStations = apiStations.filter(s => !existingIds.has(s.id) && s.url && s.name);
          State.stations = [...State.stations, ...newStations];
          filterStations();
          showToast(`📻 ${newStations.length} extra stations live gevonden!`);
        }
      }
    } catch (err) {
      console.warn("Radio-browser API niet bereikbaar, curated fallback blijft actief:", err);
    } finally {
      DOM.loadingIndicator.style.display = "none";
    }
  }, 350);
}

// ==========================================================================
// 7. Zenderlijst Renderen
// ==========================================================================
function renderStationList(stationsToRender = State.stations) {
  DOM.stationList.innerHTML = "";
  DOM.stationCountText.textContent = `${stationsToRender.length} ${stationsToRender.length === 1 ? "zender" : "zenders"} gevonden`;

  if (stationsToRender.length === 0) {
    DOM.emptyState.style.display = "flex";
    return;
  }
  DOM.emptyState.style.display = "none";

  stationsToRender.forEach(station => {
    const isCurrent = State.currentStation && State.currentStation.id === station.id;
    const isFav = isStationFavorite(station.id);

    const card = document.createElement("div");
    card.className = `station-card ${isCurrent ? "active" : ""}`;
    card.setAttribute("role", "listitem");
    card.setAttribute("tabindex", "0");

    // Tags inkorten tot max 3
    const tagsArray = (station.tags || "").split(",").map(t => t.trim()).filter(Boolean).slice(0, 3);
    const tagsHtml = tagsArray.map(t => `<span class="tag-pill">${escapeHtml(t)}</span>`).join("");

    const flagEmoji = getFlagEmoji(station.countrycode);

    card.innerHTML = `
      <div class="card-logo-box">
        <img class="card-logo" src="${escapeHtml(station.favicon || 'favicon.svg')}" alt="${escapeHtml(station.name)}" onerror="this.src='favicon.svg'">
      </div>
      <div class="card-info">
        <div class="card-title-row">
          <span class="card-flag">${flagEmoji}</span>
          <span class="card-name">${escapeHtml(station.name)}</span>
        </div>
        <div class="card-subtext">${escapeHtml(station.country || 'Wereldwijd')} • ${station.bitrate ? station.bitrate + 'k' : '128k'} ${station.codec || 'MP3'}</div>
        <div class="card-tags">${tagsHtml}</div>
      </div>
      <div class="card-actions">
        <button class="card-btn btn-fav-card ${isFav ? 'is-fav' : ''}" title="${isFav ? 'Verwijder uit favorieten' : 'Toevoegen aan favorieten'}">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="${isFav ? '#f59e0b' : 'none'}" stroke="currentColor" stroke-width="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </button>
        <button class="card-btn btn-play-card" title="Speel deze zender">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            ${isCurrent && State.isPlaying ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' : '<path d="M8 5v14l11-7z"/>'}
          </svg>
        </button>
      </div>
    `;

    // Klik event op kaart
    card.addEventListener("click", (e) => {
      if (e.target.closest(".btn-fav-card")) {
        toggleFavorite(station);
        return;
      }
      playStation(station);
      // Op mobiel: schakel direct over naar de speler
      if (window.innerWidth <= 680) {
        State.mobileView = "player";
        DOM.mainContainer.classList.add("show-player");
        DOM.mobileSwitchIcon.textContent = "📻";
        DOM.mobileSwitchText.textContent = "Zenders";
      }
    });

    DOM.stationList.appendChild(card);
  });
}

// ==========================================================================
// 8. Afspelen & Audio Beheer
// ==========================================================================
function playStation(station) {
  if (!station || !station.url) return;

  // Initialiseer Web Audio Context bij eerste gebruikersinteractie
  ensureAudioContext();

  State.currentStation = station;
  State.isBuffering = true;
  updatePlayerUI();

  DOM.audio.src = station.url;
  DOM.audio.crossOrigin = "anonymous";
  
  DOM.audio.play().then(() => {
    State.isPlaying = true;
    State.isBuffering = false;
    updatePlayerUI();
    showToast(`▶️ Verbonden met ${station.name}`);
  }).catch(err => {
    console.warn("Direct play failed, retrying without anonymous CORS:", err);
    // Sommige streams weigeren crossOrigin headers; fallback naar direct HTML5 play
    DOM.audio.removeAttribute("crossorigin");
    DOM.audio.play().then(() => {
      State.isPlaying = true;
      State.isBuffering = false;
      updatePlayerUI();
      showToast(`▶️ Verbonden met ${station.name}`);
    }).catch(e => {
      State.isPlaying = false;
      State.isBuffering = false;
      updatePlayerUI();
      showToast(`⚠️ Kon geen verbinding maken met ${station.name}`);
    });
  });
}

function togglePlayCurrent() {
  if (!State.currentStation) {
    playRandomStation();
    return;
  }

  ensureAudioContext();

  if (State.isPlaying) {
    DOM.audio.pause();
    State.isPlaying = false;
  } else {
    DOM.audio.play().then(() => {
      State.isPlaying = true;
    }).catch(err => {
      console.warn("Hervatten mislukt:", err);
    });
  }
  updatePlayerUI();
}

function playRandomStation() {
  if (State.stations.length === 0) return;
  const randIdx = Math.floor(Math.random() * State.stations.length);
  playStation(State.stations[randIdx]);
}

function updatePlayerUI() {
  const st = State.currentStation;

  if (st) {
    DOM.nowPlayingTitle.textContent = st.name;
    DOM.nowPlayingCountry.textContent = st.country || "Wereldwijd";
    DOM.nowPlayingFlag.textContent = getFlagEmoji(st.countrycode);
    DOM.nowPlayingCodec.textContent = st.codec || "MP3";
    DOM.nowPlayingBitrate.textContent = st.bitrate ? `${st.bitrate} kbps` : "128 kbps";
    DOM.stationLogo.src = st.favicon || "favicon.svg";
    DOM.stationLogo.onerror = () => { DOM.stationLogo.src = "favicon.svg"; };
    DOM.nowPlayingTrack.textContent = State.isPlaying ? "Live audiostream wordt afgespeeld..." : "Gepauzeerd";

    const isFav = isStationFavorite(st.id);
    DOM.btnMainFav.classList.toggle("is-fav", isFav);
    DOM.mainFavIcon.setAttribute("fill", isFav ? "#f59e0b" : "none");
  }

  // Live Status Badge
  DOM.liveStreamBadge.className = "live-badge";
  if (State.isBuffering) {
    DOM.liveStreamBadge.classList.add("buffering");
    DOM.liveStatusText.textContent = "Verbinden...";
  } else if (State.isPlaying) {
    DOM.liveStreamBadge.classList.add("online");
    DOM.liveStatusText.textContent = "Live";
  } else {
    DOM.liveStreamBadge.classList.add("offline");
    DOM.liveStatusText.textContent = "Gereed";
  }

  // Draaiend vinyl wiel
  DOM.vinylDisc.classList.toggle("spinning", State.isPlaying);

  // Play / Pauze Icoon
  if (State.isPlaying) {
    DOM.playIconSvg.innerHTML = '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>';
    DOM.btnMainPlay.title = "Pauzeren (Spatie)";
  } else {
    DOM.playIconSvg.innerHTML = '<path d="M8 5v14l11-7z"/>';
    DOM.btnMainPlay.title = "Afspelen (Spatie)";
  }

  // Update actieve klasse in zenderlijst
  document.querySelectorAll(".station-card").forEach(c => {
    c.classList.remove("active");
  });
  if (st) {
    renderStationList(State.stations);
  }
}

function toggleMute() {
  DOM.audio.muted = !DOM.audio.muted;
  DOM.volIcon.textContent = DOM.audio.muted ? "🔇" : "🔊";
  showToast(DOM.audio.muted ? "Dempen ingeschakeld" : "Geluid hersteld");
}

function updateVolumeIcon(val) {
  if (val === 0) DOM.volIcon.textContent = "🔇";
  else if (val < 50) DOM.volIcon.textContent = "🔉";
  else DOM.volIcon.textContent = "🔊";
}

// ==========================================================================
// 9. Web Audio API, 60 FPS Visualizer & VU Meters
// ==========================================================================
function ensureAudioContext() {
  if (State.audioCtx) {
    if (State.audioCtx.state === "suspended") {
      State.audioCtx.resume();
    }
    return;
  }

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    State.audioCtx = new AudioContextClass();
    
    // Media Element Source
    State.sourceNode = State.audioCtx.createMediaElementSource(DOM.audio);
    
    // Analyser Node voor Visualizer
    State.analyserNode = State.audioCtx.createAnalyser();
    State.analyserNode.fftSize = 256;
    State.analyserNode.smoothingTimeConstant = 0.82;

    // Koppel audio graaf
    State.sourceNode.connect(State.analyserNode);
    State.analyserNode.connect(State.audioCtx.destination);

    DOM.telRate.textContent = `${(State.audioCtx.sampleRate / 1000).toFixed(1)} kHz`;
  } catch (err) {
    console.warn("Web Audio API Initialisatie opmerking:", err);
  }
}

function initVisualizer() {
  const canvas = DOM.canvas;
  const ctx = canvas.getContext("2d");
  
  // High-DPI Canvas scaling
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * (window.devicePixelRatio || 1);
    canvas.height = rect.height * (window.devicePixelRatio || 1);
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let lastFrameTime = performance.now();
  let frameCount = 0;
  let fpsTimer = performance.now();

  function draw() {
    requestAnimationFrame(draw);

    frameCount++;
    const now = performance.now();
    if (now - fpsTimer >= 1000) {
      DOM.telFps.textContent = `${frameCount} FPS`;
      frameCount = 0;
      fpsTimer = now;
    }

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    if (!State.analyserNode || !State.isPlaying) {
      // Subtiele rustpuls golflijn als er niets speelt
      drawIdleLine(ctx, w, h, now);
      updateVuMeter(0, 0);
      return;
    }

    const bufferLength = State.analyserNode.frequencyBinCount;
    const freqData = new Uint8Array(bufferLength);
    State.analyserNode.getByteFrequencyData(freqData);

    // Bereken Stereo RMS / Peak
    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += freqData[i];
    }
    const avg = sum / bufferLength;
    const normLevel = Math.min(1, avg / 128);
    updateVuMeter(normLevel * 0.95, normLevel * 1.05);

    if (State.visMode === "bars") {
      drawSpectrumBars(ctx, freqData, w, h);
    } else {
      const timeData = new Uint8Array(bufferLength);
      State.analyserNode.getByteTimeDomainData(timeData);
      drawWaveform(ctx, timeData, w, h);
    }
  }
  requestAnimationFrame(draw);
}

function drawSpectrumBars(ctx, data, w, h) {
  const barCount = 42;
  const barWidth = (w / barCount) * 0.72;
  const gap = (w / barCount) * 0.28;

  for (let i = 0; i < barCount; i++) {
    const dataIdx = Math.floor((i / barCount) * (data.length * 0.75));
    const value = data[dataIdx] || 0;
    const barHeight = (value / 255) * h * 0.88;
    const x = i * (barWidth + gap) + gap / 2;
    const y = h - barHeight;

    // Vloeiende neon gradiënt (Cyaan naar Paars)
    const grad = ctx.createLinearGradient(x, h, x, y);
    grad.addColorStop(0, "rgba(0, 242, 254, 0.2)");
    grad.addColorStop(0.6, "rgba(0, 242, 254, 0.85)");
    grad.addColorStop(1, "rgba(168, 85, 247, 0.95)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
    ctx.fill();

    // Piek dop
    if (barHeight > 4) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x, y - 2, barWidth, 1.5);
    }
  }
}

function drawWaveform(ctx, data, w, h) {
  ctx.lineWidth = 2.5 * (window.devicePixelRatio || 1);
  ctx.strokeStyle = "#00f2fe";
  ctx.shadowColor = "rgba(0, 242, 254, 0.8)";
  ctx.shadowBlur = 10;
  ctx.beginPath();

  const sliceWidth = w / data.length;
  let x = 0;
  for (let i = 0; i < data.length; i++) {
    const v = data[i] / 128.0;
    const y = (v * h) / 2;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
    x += sliceWidth;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
}

function drawIdleLine(ctx, w, h, time) {
  ctx.lineWidth = 1.5 * (window.devicePixelRatio || 1);
  ctx.strokeStyle = "rgba(0, 242, 254, 0.2)";
  ctx.beginPath();
  const midY = h / 2;
  ctx.moveTo(0, midY);
  for (let x = 0; x < w; x += 10) {
    const wave = Math.sin((x + time * 0.05) * 0.02) * 3;
    ctx.lineTo(x, midY + wave);
  }
  ctx.stroke();
}

function updateVuMeter(lNorm, rNorm) {
  const lPercent = Math.min(100, Math.round(lNorm * 100));
  const rPercent = Math.min(100, Math.round(rNorm * 100));
  DOM.vuLeftBar.style.width = `${lPercent}%`;
  DOM.vuRightBar.style.width = `${rPercent}%`;

  if (lNorm <= 0.01) {
    DOM.vuLeftDb.textContent = "-∞ dB";
    DOM.vuRightDb.textContent = "-∞ dB";
  } else {
    const lDb = Math.round(20 * Math.log10(lNorm));
    const rDb = Math.round(20 * Math.log10(rNorm));
    DOM.vuLeftDb.textContent = `${lDb} dB`;
    DOM.vuRightDb.textContent = `${rDb} dB`;
  }
}

// ==========================================================================
// 10. 🎙️ LIVE MP3 OPNAME STUDIO (Muziek & Gepraat Vastleggen)
// ==========================================================================
function toggleRecording() {
  if (State.isRecording) {
    stopRecording();
  } else {
    startRecording();
  }
}

function startRecording() {
  if (!State.isPlaying) {
    showToast("⚠️ Start eerst een radiostation om live audio op te nemen.");
    return;
  }

  ensureAudioContext();

  if (!window.lamejs) {
    showToast("❌ LAME MP3 encoder bibliotheek is niet geladen.");
    return;
  }

  const sampleRate = State.audioCtx.sampleRate || 44100;
  const kbps = parseInt(DOM.recBitrate.value, 10) || 192;
  
  // Maak MP3 Encoder instantie (Stereo 2-kanaals, sampleRate, bitrate)
  State.mp3Encoder = new lamejs.Mp3Encoder(2, sampleRate, kbps);
  State.mp3DataChunks = [];
  State.recordedSamplesCount = 0;
  State.recordedBytesEstimate = 0;
  State.recordingStartTime = Date.now();

  // Web Audio ScriptProcessorNode (Buffer 4096, 2 input channels, 2 output channels)
  const bufferSize = 4096;
  State.recorderNode = State.audioCtx.createScriptProcessor(bufferSize, 2, 2);

  State.recorderNode.onaudioprocess = (e) => {
    if (!State.isRecording) return;

    const leftF32 = e.inputBuffer.getChannelData(0);
    const rightF32 = e.inputBuffer.getChannelData(1);

    // Converteer Float32 [-1.0 .. 1.0] naar 16-bit PCM Signed Integer
    const left16 = floatTo16BitPCM(leftF32);
    const right16 = floatTo16BitPCM(rightF32);

    // Encodeer stereo buffer naar MP3 chunk
    const mp3buf = State.mp3Encoder.encodeBuffer(left16, right16);
    if (mp3buf.length > 0) {
      State.mp3DataChunks.push(mp3buf);
      State.recordedBytesEstimate += mp3buf.length;
    }

    State.recordedSamplesCount += leftF32.length;
    updateRecordingStats();
  };

  // Koppel recorder in de audiograaf
  State.sourceNode.connect(State.recorderNode);
  State.recorderNode.connect(State.audioCtx.destination);

  State.isRecording = true;
  updateRecordingUI(true);

  // Timer interval
  State.recordingTimerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - State.recordingStartTime) / 1000);
    const hrs = String(Math.floor(elapsed / 3600)).padStart(2, "0");
    const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
    const secs = String(elapsed % 60).padStart(2, "0");
    DOM.recTimer.textContent = `${hrs}:${mins}:${secs}`;
  }, 500);

  showToast(`🔴 MP3-opname gestart (${kbps} kbps)`);
}

function stopRecording() {
  if (!State.isRecording) return;
  State.isRecording = false;

  clearInterval(State.recordingTimerInterval);

  // Ontkoppel en ruim node op
  if (State.recorderNode) {
    State.recorderNode.disconnect();
    State.recorderNode.onaudioprocess = null;
    State.recorderNode = null;
  }

  // Sluit de MP3 encoder af en spoel de laatste buffer door
  if (State.mp3Encoder) {
    const endBuf = State.mp3Encoder.flush();
    if (endBuf.length > 0) {
      State.mp3DataChunks.push(endBuf);
      State.recordedBytesEstimate += endBuf.length;
    }
    State.mp3Encoder = null;
  }

  updateRecordingUI(false);

  // Maak officiële MP3 Blob
  const mp3Blob = new Blob(State.mp3DataChunks, { type: "audio/mp3" });
  const stationName = State.currentStation ? State.currentStation.name.replace(/[^a-zA-Z0-9_-]/g, "_") : "Radio";
  const dateStr = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const filename = `PeterVroonRadio_${stationName}_Opname_${dateStr}.mp3`;
  const durationSec = Math.floor((Date.now() - State.recordingStartTime) / 1000);
  const sizeMb = (mp3Blob.size / (1024 * 1024)).toFixed(2);

  // Sla opname op in sessie
  const recRecord = {
    id: "rec_" + Date.now(),
    filename: filename,
    station: State.currentStation ? State.currentStation.name : "PeterVroon Radio",
    blob: mp3Blob,
    url: URL.createObjectURL(mp3Blob),
    date: new Date().toLocaleTimeString(),
    duration: formatSeconds(durationSec),
    size: `${sizeMb} MB`
  };
  State.savedRecordings.unshift(recRecord);
  renderRecordingsList();

  showToast(`✅ Opname voltooid: ${filename} (${sizeMb} MB)`);

  // Direct downloaden als checkbox aan staat
  if (DOM.chkAutoDownload.checked) {
    triggerFileDownload(recRecord.url, filename);
  }
}

function updateRecordingUI(active) {
  const card = document.querySelector(".recording-studio-card");
  card.classList.toggle("recording-active", active);

  DOM.recDot.className = active ? "rec-dot-active" : "rec-dot-idle";
  DOM.btnRecordToggle.className = `pill-btn record-btn ${active ? "recording" : ""}`;

  if (active) {
    DOM.recBtnIcon.textContent = "⏹️";
    DOM.recBtnText.textContent = "Stop & Bewaar MP3";
    DOM.recSizeEstimate.textContent = "0.0 MB";
  } else {
    DOM.recBtnIcon.textContent = "🔴";
    DOM.recBtnText.textContent = "Start MP3 Opname";
    DOM.recTimer.textContent = "00:00:00";
    DOM.recSizeEstimate.textContent = "0.0 MB";
  }
}

function updateRecordingStats() {
  const mb = (State.recordedBytesEstimate / (1024 * 1024)).toFixed(2);
  DOM.recSizeEstimate.textContent = `${mb} MB`;
}

function floatTo16BitPCM(input) {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
  }
  return output;
}

function renderRecordingsList() {
  DOM.recordingsList.innerHTML = "";
  DOM.recCountBadge.textContent = `${State.savedRecordings.length} ${State.savedRecordings.length === 1 ? "opname" : "opnames"}`;

  if (State.savedRecordings.length === 0) {
    DOM.noRecordingsState.style.display = "block";
    return;
  }
  DOM.noRecordingsState.style.display = "none";

  State.savedRecordings.forEach((rec) => {
    const item = document.createElement("div");
    item.className = "recording-item";
    item.innerHTML = `
      <div class="rec-item-info">
        <span class="rec-item-name">🎵 ${escapeHtml(rec.filename)}</span>
        <span class="rec-item-meta">${escapeHtml(rec.station)} • ${rec.duration} • ${rec.size} • ${rec.date}</span>
      </div>
      <div class="rec-item-actions">
        <audio controls src="${rec.url}" style="height: 28px; width: 140px;"></audio>
        <button class="btn-download-rec" title="Download dit MP3-bestand">💾 Download</button>
        <button class="btn-delete-rec" title="Verwijder opname">🗑️</button>
      </div>
    `;

    item.querySelector(".btn-download-rec").addEventListener("click", () => {
      triggerFileDownload(rec.url, rec.filename);
    });

    item.querySelector(".btn-delete-rec").addEventListener("click", () => {
      State.savedRecordings = State.savedRecordings.filter(r => r.id !== rec.id);
      renderRecordingsList();
      showToast("Opname verwijderd.");
    });

    DOM.recordingsList.appendChild(item);
  });
}

function triggerFileDownload(blobUrl, filename) {
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ==========================================================================
// 11. Favorieten Beheer (LocalStorage)
// ==========================================================================
function loadSavedFavorites() {
  try {
    const saved = localStorage.getItem("radio_favorites_v1");
    if (saved) {
      State.favorites = JSON.parse(saved);
      updateFavoriteCounters();
    }
  } catch (err) {
    console.warn("Kon favorieten niet laden:", err);
  }
}

function saveFavorites() {
  try {
    localStorage.setItem("radio_favorites_v1", JSON.stringify(State.favorites));
    updateFavoriteCounters();
  } catch (err) {
    console.warn("Kon favorieten niet opslaan:", err);
  }
}

function isStationFavorite(id) {
  return State.favorites.some(f => f.id === id);
}

function toggleFavorite(station) {
  if (isStationFavorite(station.id)) {
    State.favorites = State.favorites.filter(f => f.id !== station.id);
    showToast(`⭐ Verwijderd uit favorieten: ${station.name}`);
  } else {
    State.favorites.push(station);
    showToast(`⭐ Toegevoegd aan favorieten: ${station.name}`);
  }
  saveFavorites();
  renderStationList(State.stations);
  if (DOM.favoritesModal.style.display === "flex") {
    renderFavoritesModalList();
  }
}

function toggleFavoriteCurrent() {
  if (State.currentStation) {
    toggleFavorite(State.currentStation);
  }
}

function updateFavoriteCounters() {
  DOM.favCountBadge.textContent = State.favorites.length;
  document.getElementById("favModalCount").textContent = `${State.favorites.length} stations bewaard`;
}

function openFavoritesModal() {
  renderFavoritesModalList();
  DOM.favoritesModal.style.display = "flex";
}
function closeFavoritesModal() {
  DOM.favoritesModal.style.display = "none";
}

function renderFavoritesModalList() {
  DOM.favList.innerHTML = "";
  if (State.favorites.length === 0) {
    DOM.emptyFavsState.style.display = "flex";
    DOM.btnClearAllFavs.style.display = "none";
    return;
  }
  DOM.emptyFavsState.style.display = "none";
  DOM.btnClearAllFavs.style.display = "inline-flex";

  State.favorites.forEach(station => {
    const card = document.createElement("div");
    card.className = "station-card";
    card.innerHTML = `
      <div class="card-logo-box">
        <img class="card-logo" src="${escapeHtml(station.favicon || 'favicon.svg')}" alt="${escapeHtml(station.name)}" onerror="this.src='favicon.svg'">
      </div>
      <div class="card-info">
        <div class="card-title-row">
          <span class="card-flag">${getFlagEmoji(station.countrycode)}</span>
          <span class="card-name">${escapeHtml(station.name)}</span>
        </div>
        <div class="card-subtext">${escapeHtml(station.country || 'Wereldwijd')} • ${station.codec || 'MP3'}</div>
      </div>
      <div class="card-actions">
        <button class="card-btn btn-play-card" title="Speel af">▶️</button>
        <button class="card-btn btn-delete-fav" title="Verwijder">🗑️</button>
      </div>
    `;

    card.querySelector(".btn-play-card").addEventListener("click", () => {
      playStation(station);
      closeFavoritesModal();
    });

    card.querySelector(".btn-delete-fav").addEventListener("click", () => {
      toggleFavorite(station);
    });

    DOM.favList.appendChild(card);
  });
}

function clearAllFavorites() {
  if (confirm("Weet u zeker dat u alle opgeslagen favorieten wilt wissen?")) {
    State.favorites = [];
    saveFavorites();
    renderFavoritesModalList();
    renderStationList(State.stations);
    showToast("Alle favorieten gewist.");
  }
}

// ==========================================================================
// 12. Help, Documentatie & Dynamische Version Sync (AGENTS.md)
// ==========================================================================
async function fetchVersionData() {
  try {
    const res = await fetch(`version.json?_t=${Date.now()}`);
    if (res.ok) {
      const vdata = await res.json();
      DOM.helpVersionBadge.textContent = `✓ Altijd Actueel • v${vdata.version || "1.0.0"}`;
      DOM.helpGitHash.textContent = `Build ${vdata.build || 1} (${vdata.git_hash || "online"})`;

      // Render dynamische featurelijst in Help modal
      if (Array.isArray(vdata.features)) {
        DOM.helpFeaturesList.innerHTML = vdata.features.map(f => `
          <div class="feature-item">
            ${escapeHtml(f)}
          </div>
        `).join("");
      }
    }
  } catch (err) {
    console.warn("Kon version.json niet laden:", err);
  }
}

function startVersionPolling() {
  let lastBuild = null;
  setInterval(async () => {
    try {
      const res = await fetch(`version.json?_t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (lastBuild && data.build && data.build !== lastBuild) {
          showToast(`🔔 Nieuwe release live: v${data.version} Build ${data.build}! Klik hier om te verversen.`, 8000, () => {
            window.location.reload();
          });
        }
        lastBuild = data.build;
      }
    } catch (e) {
      // Stil falen bij offline
    }
  }, 60000);
}

function openHelpModal() {
  fetchVersionData();
  DOM.helpModal.style.display = "flex";
}
function closeHelpModal() {
  DOM.helpModal.style.display = "none";
}

// ==========================================================================
// 13. Sneltoetsen & Hulpmiddelen
// ==========================================================================
function handleKeydown(e) {
  // Negeer toetsen als de gebruiker in een invoerveld typt
  if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) {
    if (e.key === "Escape") {
      e.target.blur();
    }
    return;
  }

  switch (e.key) {
    case " ":
      e.preventDefault();
      togglePlayCurrent();
      break;
    case "r":
    case "R":
      e.preventDefault();
      toggleRecording();
      break;
    case "m":
    case "M":
      e.preventDefault();
      toggleMute();
      break;
    case "f":
    case "F":
      e.preventDefault();
      toggleFavoriteCurrent();
      break;
    case "ArrowUp":
      e.preventDefault();
      DOM.volumeSlider.value = Math.min(100, parseInt(DOM.volumeSlider.value, 10) + 5);
      DOM.volumeSlider.dispatchEvent(new Event("input"));
      break;
    case "ArrowDown":
      e.preventDefault();
      DOM.volumeSlider.value = Math.max(0, parseInt(DOM.volumeSlider.value, 10) - 5);
      DOM.volumeSlider.dispatchEvent(new Event("input"));
      break;
    case "?":
    case "h":
    case "H":
      e.preventDefault();
      openHelpModal();
      break;
    case "Escape":
      closeHelpModal();
      closeFavoritesModal();
      break;
  }
}

function showToast(message, duration = 3500, onClick = null) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  if (onClick) {
    toast.style.cursor = "pointer";
    toast.addEventListener("click", onClick);
  }
  DOM.toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(12px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, duration);
}

function getFlagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "🌍";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

function formatSeconds(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function escapeHtml(str) {
  if (!str) return "";
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
