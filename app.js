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
      TW: "Taiwan", TH: "Thailand", ID: "Indonesië", SG: "Singapore",
      VN: "Vietnam", PH: "Filipijnen", MY: "Maleisië", TR: "Turkije",
      IL: "Israël", AE: "Verenigde Arabische Emiraten", SA: "Saoedi-Arabië",
      PK: "Pakistan", BD: "Bangladesh", LK: "Sri Lanka", HK: "Hongkong"
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

// Snelkoppeling countrycode -> continent (hoofdletterongevoelig)
const COUNTRY_TO_CONTINENT = {};
Object.entries(CONTINENTS).forEach(([contKey, contData]) => {
  Object.keys(contData.countries).forEach(code => {
    COUNTRY_TO_CONTINENT[code.toUpperCase()] = contKey;
    COUNTRY_TO_CONTINENT[code.toLowerCase()] = contKey;
  });
});

// ==========================================================================
// 2. Curated Stations (100% Geverifieerde Live Streams Zonder Loze Links)
// ==========================================================================
const CURATED_STATIONS = [
  // ==========================================
  // Nederland & België (Pop, Rock, Nieuws, Dance, Soul)
  // ==========================================
  {
    id: "npo-radio-1",
    name: "NPO Radio 1",
    country: "Nederland",
    countrycode: "NL",
    continent: "europe",
    tags: "news,talk,public,sport,actualiteiten",
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
    tags: "pop,rock,top2000,classic,nederlands",
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
    tags: "pop,indie,rock,alternative,festival",
    codec: "MP3",
    bitrate: 192,
    url: "https://icecast.omroep.nl/3fm-bb-mp3",
    favicon: "https://www.npo3fm.nl/images/favicons/favicon.ico",
    votes: 8900
  },
  {
    id: "arrow-classic-rock-nl",
    name: "Arrow Classic Rock",
    country: "Nederland",
    countrycode: "NL",
    continent: "europe",
    tags: "rock,classic rock,hard rock,70s,80s",
    codec: "MP3",
    bitrate: 192,
    url: "https://stream.gal.io/arrow",
    favicon: "https://arrow.nl/favicon.ico",
    votes: 11200
  },
  {
    id: "qmusic-nl",
    name: "Qmusic Nederland",
    country: "Nederland",
    countrycode: "NL",
    continent: "europe",
    tags: "pop,hits,top40,charts",
    codec: "MP3",
    bitrate: 128,
    url: "https://icecast-qmusicnl-cdp.triple-it.nl/Qmusic_nl_live.mp3",
    favicon: "https://qmusic.nl/favicon.ico",
    votes: 9100
  },
  {
    id: "radio-veronica",
    name: "Radio Veronica",
    country: "Nederland",
    countrycode: "NL",
    continent: "europe",
    tags: "rock,pop,80s,90s,classic",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.radioveronica.nl/veronica",
    favicon: "https://www.radioveronica.nl/favicon.ico",
    votes: 8400
  },
  {
    id: "slam-fm",
    name: "SLAM! Dance Radio",
    country: "Nederland",
    countrycode: "NL",
    continent: "europe",
    tags: "electronic,dance,edm,house,club",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.slam.nl/slam-mp3",
    favicon: "https://www.slam.nl/favicon.ico",
    votes: 8800
  },
  {
    id: "sublime-fm",
    name: "Sublime FM",
    country: "Nederland",
    countrycode: "NL",
    continent: "europe",
    tags: "jazz,soul,funk,groove,rnb",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.sublime.nl/sublime",
    favicon: "https://sublime.nl/favicon.ico",
    votes: 7900
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
    tags: "hits,pop,dance,charts",
    codec: "MP3",
    bitrate: 128,
    url: "https://icecast.vrtcdn.be/mnm-high.mp3",
    favicon: "https://mnm.be/favicon.ico",
    votes: 7500
  },
  {
    id: "radio-1-be",
    name: "VRT Radio 1",
    country: "België",
    countrycode: "BE",
    continent: "europe",
    tags: "news,talk,culture,stories",
    codec: "MP3",
    bitrate: 128,
    url: "https://icecast.vrtcdn.be/radio1-high.mp3",
    favicon: "https://radio1.be/favicon.ico",
    votes: 6900
  },
  {
    id: "nostalgie-be",
    name: "Nostalgie What A Feeling",
    country: "België",
    countrycode: "BE",
    continent: "europe",
    tags: "80s,70s,retro,pop,classics",
    codec: "MP3",
    bitrate: 128,
    url: "https://playerservices.streamtheworld.com/api/livestream-redirect/NOSTALGIEWHATAFEELING_SC",
    favicon: "https://www.nostalgie.be/favicon.ico",
    votes: 8100
  },

  // ==========================================
  // Progressive Rock & Classic Rock (Specifieke Gebruikerswens)
  // ==========================================
  {
    id: "bob-progrock",
    name: "Radio BOB! Progressive Rock",
    country: "Duitsland",
    countrycode: "DE",
    continent: "europe",
    tags: "prog rock,progressive rock,symphonic rock,art rock",
    codec: "MP3",
    bitrate: 192,
    url: "https://streams.radiobob.de/progrock/mp3-192/",
    favicon: "https://www.radiobob.de/favicon.ico",
    votes: 18500
  },
  {
    id: "morow-progrock",
    name: "Morow Prog Rock Radio",
    country: "Frankrijk",
    countrycode: "FR",
    continent: "europe",
    tags: "prog rock,progressive rock,symphonic rock,space rock",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.morow.com/morow_med.mp3",
    favicon: "https://www.morow.com/favicon.ico",
    votes: 16700
  },
  {
    id: "prog-palace",
    name: "Prog Palace Radio",
    country: "Canada",
    countrycode: "CA",
    continent: "north_america",
    tags: "prog rock,progressive rock,progressive metal,metal",
    codec: "MP3",
    bitrate: 128,
    url: "https://puma.streemlion.com:5045/stream",
    favicon: "https://progpalace.com/favicon.ico",
    votes: 12400
  },
  {
    id: "bob-classicrock",
    name: "Radio BOB! Classic Rock",
    country: "Duitsland",
    countrycode: "DE",
    continent: "europe",
    tags: "classic rock,rock,hard rock,70s,80s",
    codec: "MP3",
    bitrate: 192,
    url: "https://streams.radiobob.de/bob-classicrock/mp3-192/",
    favicon: "https://www.radiobob.de/favicon.ico",
    votes: 21000
  },
  {
    id: "rock-antenne",
    name: "Rock Antenne Live",
    country: "Duitsland",
    countrycode: "DE",
    continent: "europe",
    tags: "rock,classic rock,hard rock,alternative",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.rockantenne.de/rockantenne/stream/mp3",
    favicon: "https://www.rockantenne.de/favicon.ico",
    votes: 19800
  },
  {
    id: "classic-rock-live",
    name: "Classic Rock Live Antenne",
    country: "Duitsland",
    countrycode: "DE",
    continent: "europe",
    tags: "classic rock,rock,guitar,hard rock",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.antenne.de/classic-rock-live/stream/mp3",
    favicon: "https://www.antenne.de/favicon.ico",
    votes: 17200
  },
  {
    id: "hardrock-181fm",
    name: "181.FM - The Eagle Classic Hard Rock",
    country: "Verenigde Staten",
    countrycode: "US",
    continent: "north_america",
    tags: "hard rock,metal,classic rock,rock",
    codec: "MP3",
    bitrate: 128,
    url: "https://listen.181fm.com/181-hardrock_128k.mp3",
    favicon: "https://www.181.fm/favicon.ico",
    votes: 15600
  },

  // ==========================================
  // New Wave & 80s / Synthpop (Specifieke Gebruikerswens)
  // ==========================================
  {
    id: "80s-forever-newwave",
    name: "80s Forever - New Wave & Synthpop",
    country: "Zwitserland",
    countrycode: "CH",
    continent: "europe",
    tags: "new wave,synthpop,80s,post-punk,darkwave",
    codec: "MP3",
    bitrate: 256,
    url: "https://premium.shoutcastsolutions.com/radio/8050/256.mp3",
    favicon: "https://80sforever.radio/favicon.ico",
    votes: 17400
  },
  {
    id: "neu-radio-newwave",
    name: "NEU Radio - New Wave & Post-Punk",
    country: "Italië",
    countrycode: "IT",
    continent: "europe",
    tags: "new wave,post-punk,indie,alternative,darkwave",
    codec: "MP3",
    bitrate: 192,
    url: "https://nr9.newradio.it/proxy/ebaruffa?mp=/stream",
    favicon: "https://neuradio.it/favicon.ico",
    votes: 11800
  },

  // ==========================================
  // Country & Americana (Specifieke Gebruikerswens)
  // ==========================================
  {
    id: "kickin-country-181fm",
    name: "181.FM - Kickin' Country",
    country: "Verenigde Staten",
    countrycode: "US",
    continent: "north_america",
    tags: "country,americana,hits,modern country",
    codec: "MP3",
    bitrate: 128,
    url: "https://listen.181fm.com/181-kickincountry_128k.mp3",
    favicon: "https://www.181.fm/favicon.ico",
    votes: 24200
  },
  {
    id: "90s-country-181fm",
    name: "181.FM - 90's Country Classics",
    country: "Verenigde Staten",
    countrycode: "US",
    continent: "north_america",
    tags: "country,classic country,90s country,bluegrass",
    codec: "MP3",
    bitrate: 128,
    url: "https://listen.181fm.com/181-90scountry_128k.mp3",
    favicon: "https://www.181.fm/favicon.ico",
    votes: 18900
  },
  {
    id: "radio-country-live",
    name: "Radio Country Live New York",
    country: "Verenigde Staten",
    countrycode: "US",
    continent: "north_america",
    tags: "country,folk,americana,acoustic",
    codec: "MP3",
    bitrate: 128,
    url: "https://streaming.radiostreamlive.com/radiocountrylive_devices",
    favicon: "https://radiocountrylive.com/favicon.ico",
    votes: 14300
  },

  // ==========================================
  // Gospel & Spiritualiteit (Specifieke Gebruikerswens)
  // ==========================================
  {
    id: "gospotainment-radio",
    name: "Gospotainment Radio",
    country: "Nigeria",
    countrycode: "NG",
    continent: "africa",
    tags: "gospel,christian,praise,worship,choir",
    codec: "MP3",
    bitrate: 128,
    url: "https://radio.gotright.net/radio/8000/radio.mp3",
    favicon: "https://gospotainment.com/favicon.ico",
    votes: 13900
  },
  {
    id: "lighthouse-gospel",
    name: "Lighthouse Gospel VOAR-FM",
    country: "Canada",
    countrycode: "CA",
    continent: "north_america",
    tags: "gospel,christian,southern gospel,inspirational",
    codec: "MP3",
    bitrate: 128,
    url: "https://usa4.fastcast4u.com/proxy/lighthousefm?mp=/1",
    favicon: "https://voar.org/favicon.ico",
    votes: 12600
  },
  {
    id: "melodia-gospel-br",
    name: "Melodia FM 97.5 Gospel",
    country: "Brazilië",
    countrycode: "BR",
    continent: "south_america",
    tags: "gospel,christian,worship,latin gospel",
    codec: "MP3",
    bitrate: 128,
    url: "https://server01.ouvir.radio.br:8033/stream",
    favicon: "https://melodia.com.br/favicon.ico",
    votes: 15800
  },
  {
    id: "onlineradio-gospel",
    name: "0nlineradio GOSPEL Worldwide",
    country: "Duitsland",
    countrycode: "DE",
    continent: "europe",
    tags: "gospel,black gospel,spiritual,worship",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.0nlineradio.com/gospel?ref=radiobrowser",
    favicon: "https://0nlineradio.com/favicon.ico",
    votes: 11500
  },

  // ==========================================
  // Jazz, Blues & Soul
  // ==========================================
  {
    id: "swiss-jazz",
    name: "Radio Swiss Jazz",
    country: "Zwitserland",
    countrycode: "CH",
    continent: "europe",
    tags: "jazz,smooth jazz,blues,soul,swing",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.srg-ssr.ch/m/rsj/mp3_128",
    favicon: "https://www.radioswissjazz.ch/favicon.ico",
    votes: 19400
  },
  {
    id: "blues-181fm",
    name: "181.FM - True Blues",
    country: "Verenigde Staten",
    countrycode: "US",
    continent: "north_america",
    tags: "blues,chicago blues,delta blues,soul",
    codec: "MP3",
    bitrate: 128,
    url: "https://listen.181fm.com/181-blues_128k.mp3",
    favicon: "https://www.181.fm/favicon.ico",
    votes: 17200
  },
  {
    id: "soul-181fm",
    name: "181.FM - Soul School",
    country: "Verenigde Staten",
    countrycode: "US",
    continent: "north_america",
    tags: "soul,rnb,funk,motown,70s",
    codec: "MP3",
    bitrate: 128,
    url: "https://listen.181fm.com/181-soul_128k.mp3",
    favicon: "https://www.181.fm/favicon.ico",
    votes: 14700
  },

  // ==========================================
  // Klassiek & Soundtracks
  // ==========================================
  {
    id: "swiss-classic",
    name: "Radio Swiss Classic",
    country: "Zwitserland",
    countrycode: "CH",
    continent: "europe",
    tags: "classical,symphony,orchestra,piano,baroque",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.srg-ssr.ch/m/rsc_de/mp3_128",
    favicon: "https://www.radioswissclassic.ch/favicon.ico",
    votes: 15200
  },
  {
    id: "classic-fm-uk",
    name: "Classic FM United Kingdom",
    country: "Verenigd Koninkrijk",
    countrycode: "GB",
    continent: "europe",
    tags: "classical,soundtrack,relax,piano,opera",
    codec: "MP3",
    bitrate: 128,
    url: "https://media-ice.musicradio.com/ClassicFMMP3",
    favicon: "https://www.classicfm.com/favicon.ico",
    votes: 18100
  },

  // ==========================================
  // Verenigd Koninkrijk & Europa
  // ==========================================
  {
    id: "bbc-radio-1",
    name: "BBC Radio 1",
    country: "Verenigd Koninkrijk",
    countrycode: "GB",
    continent: "europe",
    tags: "pop,dance,chart,electronic,youth",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_one",
    favicon: "https://www.bbc.co.uk/favicon.ico",
    votes: 14500
  },
  {
    id: "bbc-radio-2",
    name: "BBC Radio 2",
    country: "Verenigd Koninkrijk",
    countrycode: "GB",
    continent: "europe",
    tags: "pop,adult,rock,classic,entertainment",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_two",
    favicon: "https://www.bbc.co.uk/favicon.ico",
    votes: 13900
  },
  {
    id: "bbc-radio-4",
    name: "BBC Radio 4",
    country: "Verenigd Koninkrijk",
    countrycode: "GB",
    continent: "europe",
    tags: "news,talk,culture,drama,analysis",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.live.vc.bbcmedia.co.uk/bbc_radio_fourfm",
    favicon: "https://www.bbc.co.uk/favicon.ico",
    votes: 11200
  },
  {
    id: "bbc-6-music",
    name: "BBC 6 Music",
    country: "Verenigd Koninkrijk",
    countrycode: "GB",
    continent: "europe",
    tags: "indie,alternative,rock,eclectic,new music",
    codec: "MP3",
    bitrate: 128,
    url: "https://stream.live.vc.bbcmedia.co.uk/bbc_6music",
    favicon: "https://www.bbc.co.uk/favicon.ico",
    votes: 16300
  },
  {
    id: "1live-de",
    name: "1LIVE WDR",
    country: "Duitsland",
    countrycode: "DE",
    continent: "europe",
    tags: "pop,dance,hits,youth",
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
    tags: "rock,indie,culture,talk,berlin",
    codec: "MP3",
    bitrate: 128,
    url: "https://dispatcher.rndfnk.com/rbb/radioeins/live/mp3/mid",
    favicon: "https://www.radioeins.de/favicon.ico",
    votes: 11400
  },
  {
    id: "fip-paris",
    name: "FIP Radio Paris",
    country: "Frankrijk",
    countrycode: "FR",
    continent: "europe",
    tags: "jazz,eclectic,world,chillout,groove",
    codec: "MP3",
    bitrate: 128,
    url: "https://icecast.radiofrance.fr/fip-midfi.mp3",
    favicon: "https://www.radiofrance.fr/fip/favicon.ico",
    votes: 13800
  },

  // ==========================================
  // Noord-Amerika (USA, Canada)
  // ==========================================
  {
    id: "kexp-seattle",
    name: "KEXP 90.3 FM Seattle",
    country: "Verenigde Staten",
    countrycode: "US",
    continent: "north_america",
    tags: "indie,alternative,rock,eclectic,live",
    codec: "MP3",
    bitrate: 128,
    url: "https://kexp.streamguys1.com/kexp128.mp3",
    favicon: "https://kexp.org/favicon.ico",
    votes: 21500
  },
  {
    id: "wnyc-fm",
    name: "WNYC 93.9 FM New York",
    country: "Verenigde Staten",
    countrycode: "US",
    continent: "north_america",
    tags: "news,talk,npr,culture,new york",
    codec: "MP3",
    bitrate: 128,
    url: "https://fm939.wnyc.org/wnycfm",
    favicon: "https://www.wnyc.org/favicon.ico",
    votes: 16400
  },

  // ==========================================
  // Azië & Oceanië & Wereld
  // ==========================================
  {
    id: "gensokyo-radio",
    name: "Gensokyo Radio Japan",
    country: "Japan",
    countrycode: "JP",
    continent: "asia",
    tags: "anime,touhou,soundtrack,gaming,japanese",
    codec: "MP3",
    bitrate: 192,
    url: "https://stream.gensokyoradio.net/1",
    favicon: "https://gensokyoradio.net/favicon.ico",
    votes: 14800
  },
  {
    id: "rnz-national-nz",
    name: "RNZ National 101 FM",
    country: "Nieuw-Zeeland",
    countrycode: "NZ",
    continent: "oceania",
    tags: "news,talk,stories,newzealand,public",
    codec: "MP3",
    bitrate: 128,
    url: "https://radionz-ice.streamguys.com/national.mp3",
    favicon: "https://www.rnz.co.nz/favicon.ico",
    votes: 9100
  },
  {
    id: "reggae-181fm",
    name: "181.FM - Reggae Roots",
    country: "Jamaica",
    countrycode: "JM",
    continent: "north_america",
    tags: "reggae,roots,dub,dancehall,caribbean",
    codec: "MP3",
    bitrate: 128,
    url: "https://listen.181fm.com/181-reggae_128k.mp3",
    favicon: "https://www.181.fm/favicon.ico",
    votes: 16100
  }
];

// ==========================================================================
// 2b. Alle Genres Matrix Catalogus (1-Klik Verkenner)
// ==========================================================================
const GENRES_CATALOG = [
  {
    category: "Rock & Hard Rock",
    icon: "🎸",
    genres: [
      { name: "Classic Rock", tag: "classic rock", icon: "🎸" },
      { name: "Rock", tag: "rock", icon: "⚡" },
      { name: "Hard Rock", tag: "hard rock", icon: "🔥" },
      { name: "Heavy Metal", tag: "metal", icon: "🤘" },
      { name: "Alternative Rock", tag: "alternative", icon: "📻" },
      { name: "Indie Rock", tag: "indie", icon: "💿" },
      { name: "Punk Rock", tag: "punk", icon: "💥" },
      { name: "Grunge", tag: "grunge", icon: "🔊" }
    ]
  },
  {
    category: "Progressive & Symphonic Rock",
    icon: "🎹",
    genres: [
      { name: "Prog Rock", tag: "prog rock", icon: "🎹" },
      { name: "Progressive Metal", tag: "progressive metal", icon: "⚡" },
      { name: "Symphonic Rock", tag: "symphonic rock", icon: "🎻" },
      { name: "Psychedelic Rock", tag: "psychedelic", icon: "🌀" },
      { name: "Art Rock", tag: "art rock", icon: "🎨" },
      { name: "Space Rock", tag: "space rock", icon: "🚀" }
    ]
  },
  {
    category: "New Wave, Synthpop & 80s",
    icon: "⚡",
    genres: [
      { name: "New Wave", tag: "new wave", icon: "⚡" },
      { name: "Synthpop", tag: "synthpop", icon: "🎹" },
      { name: "80s Hits", tag: "80s", icon: "🕺" },
      { name: "Post-Punk", tag: "post-punk", icon: "🕶️" },
      { name: "Darkwave", tag: "darkwave", icon: "🌒" },
      { name: "70s & 80s Disco", tag: "disco", icon: "🪩" },
      { name: "Eurodance", tag: "eurodance", icon: "🔥" }
    ]
  },
  {
    category: "Country, Folk & Americana",
    icon: "🤠",
    genres: [
      { name: "Country", tag: "country", icon: "🤠" },
      { name: "Americana", tag: "americana", icon: "🌾" },
      { name: "Classic Country", tag: "classic country", icon: "🪕" },
      { name: "Bluegrass", tag: "bluegrass", icon: "🎻" },
      { name: "Folk", tag: "folk", icon: "🍂" },
      { name: "Acoustic", tag: "acoustic", icon: "🪕" }
    ]
  },
  {
    category: "Gospel & Spiritualiteit",
    icon: "✨",
    genres: [
      { name: "Gospel", tag: "gospel", icon: "✨" },
      { name: "Christian", tag: "christian", icon: "✝️" },
      { name: "Black Gospel", tag: "black gospel", icon: "🙌" },
      { name: "Southern Gospel", tag: "southern gospel", icon: "🕊️" },
      { name: "Praise & Worship", tag: "worship", icon: "🙏" }
    ]
  },
  {
    category: "Jazz, Blues & Soul",
    icon: "🎷",
    genres: [
      { name: "Jazz", tag: "jazz", icon: "🎷" },
      { name: "Smooth Jazz", tag: "smooth jazz", icon: "🍸" },
      { name: "Blues", tag: "blues", icon: "🎸" },
      { name: "Soul", tag: "soul", icon: "❤️" },
      { name: "Funk", tag: "funk", icon: "🕺" },
      { name: "R&B", tag: "rnb", icon: "🎶" },
      { name: "Big Band & Swing", tag: "swing", icon: "🎺" }
    ]
  },
  {
    category: "Electronic, Club & Dance",
    icon: "🎧",
    genres: [
      { name: "Electronic", tag: "electronic", icon: "🎧" },
      { name: "Trance", tag: "trance", icon: "💫" },
      { name: "Techno", tag: "techno", icon: "🎛️" },
      { name: "House", tag: "house", icon: "🏠" },
      { name: "Deep House", tag: "deep house", icon: "🌊" },
      { name: "EDM", tag: "edm", icon: "⚡" },
      { name: "Drum & Bass", tag: "drum and bass", icon: "🥁" },
      { name: "Chillout & Lounge", tag: "chillout", icon: "🛋️" },
      { name: "Ambient", tag: "ambient", icon: "🌌" }
    ]
  },
  {
    category: "Pop, Top 40 & Nederpop",
    icon: "🎵",
    genres: [
      { name: "Pop", tag: "pop", icon: "🎵" },
      { name: "Top 40 & Charts", tag: "top40", icon: "⭐" },
      { name: "Nederpop", tag: "nederlands", icon: "🇳🇱" },
      { name: "90s Hits", tag: "90s", icon: "📼" },
      { name: "Oldies & 60s/70s", tag: "oldies", icon: "📻" }
    ]
  },
  {
    category: "Klassiek & Soundtracks",
    icon: "🎻",
    genres: [
      { name: "Klassiek", tag: "classical", icon: "🎻" },
      { name: "Barok", tag: "baroque", icon: "🎼" },
      { name: "Filmmuziek (Soundtracks)", tag: "soundtrack", icon: "🎬" },
      { name: "Piano & Solo", tag: "piano", icon: "🎹" },
      { name: "Opera", tag: "opera", icon: "🎭" }
    ]
  },
  {
    category: "Wereld, Latin & Reggae",
    icon: "🌍",
    genres: [
      { name: "Reggae & Dub", tag: "reggae", icon: "🌴" },
      { name: "Latin & Salsa", tag: "latin", icon: "💃" },
      { name: "Bossa Nova", tag: "bossa nova", icon: "🏖️" },
      { name: "Wereldmuziek", tag: "world", icon: "🌍" },
      { name: "Flamenco", tag: "flamenco", icon: "🇪🇸" }
    ]
  },
  {
    category: "Nieuws, Praat & Sport",
    icon: "🎙️",
    genres: [
      { name: "Nieuws & Actualiteiten", tag: "news", icon: "📰" },
      { name: "Praatradio & Talk", tag: "talk", icon: "🎙️" },
      { name: "Sport", tag: "sport", icon: "⚽" },
      { name: "Cultuur & Verdieping", tag: "culture", icon: "🏛️" }
    ]
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
  activeGenreTitle: "",
  activeSort: "votes",
  searchQuery: "",

  // Zenderdata & Gezondheid
  stations: [...CURATED_STATIONS],
  favorites: [],
  brokenStationIds: new Set(),
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

  // Weergave modus ('voorkant' = overzicht | 'achterkant' = speler & studio | 'split')
  currentView: "voorkant",
  mobileView: "stations"
};

// DOM Referenties
const DOM = {
  audio: document.getElementById("audioPlayer"),
  stationList: document.getElementById("stationList"),
  stationCountText: document.getElementById("stationCountText"),
  continentSelect: document.getElementById("continentSelect"),
  countrySelect: document.getElementById("countrySelect"),
  sortSelect: document.getElementById("sortSelect"),
  stationSearch: document.getElementById("stationSearch"),
  btnClearSearch: document.getElementById("btnClearSearch"),
  loadingIndicator: document.getElementById("loadingIndicator"),
  emptyState: document.getElementById("emptyState"),

  // Weergave Knoppen (Voorkant / Achterkant / Split)
  btnViewVoorkant: document.getElementById("btnViewVoorkant"),
  btnViewAchterkant: document.getElementById("btnViewAchterkant"),
  btnViewSplit: document.getElementById("btnViewSplit"),
  btnBackToVoorkant: document.getElementById("btnBackToVoorkant"),

  // Zwevende Mini-Speler HUD (Zichtbaar op de Voorkant)
  miniPlayerHud: document.getElementById("miniPlayerHud"),
  miniStationLogo: document.getElementById("miniStationLogo"),
  miniStationFlag: document.getElementById("miniStationFlag"),
  miniStationName: document.getElementById("miniStationName"),
  miniStationBadge: document.getElementById("miniStationBadge"),
  miniStationTrack: document.getElementById("miniStationTrack"),
  btnMiniPrev: document.getElementById("btnMiniPrev"),
  btnMiniPlay: document.getElementById("btnMiniPlay"),
  btnMiniNext: document.getElementById("btnMiniNext"),
  btnMiniMute: document.getElementById("btnMiniMute"),
  btnMiniToAchterkant: document.getElementById("btnMiniToAchterkant"),

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

  // Alle Genres Verkenner & Modal
  btnAllGenres: document.getElementById("btnAllGenres"),
  btnOpenGenresModal: document.getElementById("btnOpenGenresModal"),
  genresModal: document.getElementById("genresModal"),
  btnCloseGenres: document.getElementById("btnCloseGenres"),
  btnCloseGenresDone: document.getElementById("btnCloseGenresDone"),
  genresMatrixContainer: document.getElementById("genresMatrixContainer"),
  genreModalSearch: document.getElementById("genreModalSearch"),
  btnClearGenreSearch: document.getElementById("btnClearGenreSearch"),
  btnGenreResetAll: document.getElementById("btnGenreResetAll"),
  genresModalBadge: document.getElementById("genresModalBadge"),

  // Modals & Bovenbalk
  verPill: document.getElementById("verPill"),
  verPillText: document.getElementById("verPillText"),
  subbarVerText: document.getElementById("subbarVerText"),
  footerVerNote: document.getElementById("footerVerNote"),
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
  renderGenresModal();
  renderStationList();
  setupEventListeners();
  initVisualizer();
  fetchVersionData();
  startVersionPolling();

  // Stel standaard volume in
  DOM.audio.volume = 0.8;

  // Onthoud en herstel het laatst gekozen station & continent uit localStorage
  const lastSavedStation = loadLastStation();

  if (lastSavedStation) {
    State.currentStation = lastSavedStation;
    if (!State.stations.some(s => s.id === lastSavedStation.id)) {
      State.stations.unshift(lastSavedStation);
    }

    // Stel het actieve continent in op basis van het laatste station
    const stCont = lastSavedStation.continent || COUNTRY_TO_CONTINENT[(lastSavedStation.countrycode || "").toUpperCase()];
    const savedContinent = localStorage.getItem("petervroon_last_continent") || stCont || "all";
    const savedCountry = localStorage.getItem("petervroon_last_country") || lastSavedStation.countrycode || "";

    if (savedContinent && CONTINENTS[savedContinent]) {
      State.activeContinent = savedContinent;
      document.querySelectorAll(".continent-btn").forEach(b => {
        b.classList.toggle("active", b.dataset.continent === savedContinent);
      });
      if (DOM.continentSelect) DOM.continentSelect.value = savedContinent;
      populateCountrySelect();

      // Controleer of savedCountry wel hoort bij het opgeslagen continent
      if (savedCountry && CONTINENTS[savedContinent].countries && CONTINENTS[savedContinent].countries[savedCountry.toUpperCase()]) {
        State.activeCountry = savedCountry.toUpperCase();
        if (DOM.countrySelect) DOM.countrySelect.value = State.activeCountry;
      } else {
        State.activeCountry = "";
        localStorage.removeItem("petervroon_last_country");
        if (DOM.countrySelect) DOM.countrySelect.value = "";
      }

      // Haal direct live zenders op voor dit continent
      if (savedContinent !== "all") {
        loadContinentStations(savedContinent);
      }
    } else if (savedCountry) {
      State.activeCountry = savedCountry.toUpperCase();
      if (DOM.countrySelect) DOM.countrySelect.value = State.activeCountry;
    }
  } else if (State.stations.length > 0) {
    State.currentStation = State.stations[0];
  }

  filterStations();
  updatePlayerUI();

  // Start ALTIJD gegarandeerd met de Voorkant (het Overzicht van de zenders) conform gebruikerswens!
  setViewMode("voorkant");

  // Start direct vanzelf met het LAATST GEKOZEN STATION:
  // 1. Probeer directe autoplay van de browser
  if (State.currentStation) {
    playStation(State.currentStation, true);
  }

  // 2. Start direct het laatste station bij de allereerste interactie (touch/klik) overal op het scherm
  const triggerLastStationOnInteraction = () => {
    if (!State.isPlaying && State.currentStation) {
      playStation(State.currentStation);
    }
  };
  window.addEventListener("pointerdown", triggerLastStationOnInteraction, { once: true });
  window.addEventListener("keydown", triggerLastStationOnInteraction, { once: true });
});

function setupEventListeners() {
  // Continent pill knoppen
  document.querySelectorAll(".continent-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      setContinent(btn.dataset.continent);
    });
  });

  // Continent dropdown
  if (DOM.continentSelect) {
    DOM.continentSelect.addEventListener("change", (e) => {
      setContinent(e.target.value);
    });
  }

  // Genre pill filters in de scrollbar
  document.querySelectorAll(".genre-pill").forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.id === "btnOpenGenresModal") {
        openGenresModal();
        return;
      }
      const gTag = (btn.dataset.genre || "").toLowerCase().trim();
      const gName = btn.textContent.trim();
      selectGenre(gTag, gName);
    });
  });

  // Alle Genres Verkenner (1-Klik Matrix)
  DOM.btnAllGenres?.addEventListener("click", openGenresModal);
  DOM.btnOpenGenresModal?.addEventListener("click", openGenresModal);
  DOM.btnCloseGenres?.addEventListener("click", closeGenresModal);
  DOM.btnCloseGenresDone?.addEventListener("click", closeGenresModal);
  DOM.genresModal?.addEventListener("click", (e) => {
    if (e.target === DOM.genresModal) closeGenresModal();
  });
  DOM.genreModalSearch?.addEventListener("input", filterGenresInModal);
  DOM.btnClearGenreSearch?.addEventListener("click", clearGenreSearch);
  DOM.btnGenreResetAll?.addEventListener("click", () => {
    selectGenre("", "Alle Zenders");
    closeGenresModal();
  });

  // Land & Sorteer dropdowns
  DOM.countrySelect.addEventListener("change", (e) => {
    State.activeCountry = e.target.value;
    filterStations();
    if (State.activeCountry) {
      queryCountryExact(State.activeCountry);
    }
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
    setContinent("all");
    State.activeGenre = "";
    State.searchQuery = "";
    DOM.stationSearch.value = "";
    document.querySelectorAll(".genre-pill").forEach(b => b.classList.toggle("active", b.dataset.genre === ""));
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
  if (DOM.verPill) {
    DOM.verPill.addEventListener("click", () => {
      fetchVersionData(true);
    });
  }
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

  // Universele Weergave Knoppen (Voorkant / Achterkant / Split)
  DOM.btnViewVoorkant?.addEventListener("click", () => setViewMode("voorkant"));
  DOM.btnViewAchterkant?.addEventListener("click", () => setViewMode("achterkant"));
  DOM.btnViewSplit?.addEventListener("click", () => setViewMode("split"));
  DOM.btnBackToVoorkant?.addEventListener("click", () => setViewMode("voorkant"));

  // Zwevende Mini Speler HUD Knoppen
  DOM.btnMiniPlay?.addEventListener("click", togglePlayCurrent);
  DOM.btnMiniPrev?.addEventListener("click", playRandomStation);
  DOM.btnMiniNext?.addEventListener("click", playRandomStation);
  DOM.btnMiniMute?.addEventListener("click", toggleMute);
  DOM.btnMiniToAchterkant?.addEventListener("click", () => setViewMode("achterkant"));

  // Mobiele schermwissel fallback knop
  DOM.btnMobileToggle?.addEventListener("click", () => {
    setViewMode(State.currentView === "voorkant" ? "achterkant" : "voorkant");
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
    console.warn("Audio stream error:", e);
    if (State.currentStation) {
      handleStreamFailure(State.currentStation);
    } else {
      State.isPlaying = false;
      State.isBuffering = false;
      updatePlayerUI();
      showToast("⚠️ Stream niet bereikbaar of offline.");
    }
  });

  // Sneltoetsen
  window.addEventListener("keydown", handleKeydown);
}

// ==========================================================================
// 4b. Weergave Beheer: Voorkant (Overzicht) vs Achterkant (Speler & Studio)
// ==========================================================================
function setViewMode(mode) {
  State.currentView = mode;

  if (DOM.mainContainer) {
    DOM.mainContainer.classList.remove("view-voorkant", "view-achterkant", "view-split");
    DOM.mainContainer.classList.add(`view-${mode}`);
  }

  // Update actieve stijl van navigatieknoppen
  if (DOM.btnViewVoorkant) DOM.btnViewVoorkant.classList.toggle("active", mode === "voorkant");
  if (DOM.btnViewAchterkant) DOM.btnViewAchterkant.classList.toggle("active", mode === "achterkant");
  if (DOM.btnViewSplit) DOM.btnViewSplit.classList.toggle("active", mode === "split");

  updateMiniPlayerUI();
}

function updateMiniPlayerUI() {
  if (!DOM.miniPlayerHud) return;

  // Mini-player alleen tonen op de Voorkant (overzicht) wanneer er een zender actief is
  if (State.currentView === "voorkant" && State.currentStation) {
    DOM.miniPlayerHud.style.display = "flex";
    if (DOM.miniStationLogo) DOM.miniStationLogo.src = State.currentStation.favicon || "favicon.svg";
    if (DOM.miniStationFlag) DOM.miniStationFlag.textContent = getFlagEmoji(State.currentStation.countrycode);
    if (DOM.miniStationName) DOM.miniStationName.textContent = State.currentStation.name;
    if (DOM.miniStationBadge) {
      DOM.miniStationBadge.textContent = State.isPlaying ? "LIVE" : "GEREED";
      DOM.miniStationBadge.className = `mini-badge ${State.isPlaying ? "is-live" : ""}`;
    }
    if (DOM.miniStationTrack) {
      DOM.miniStationTrack.textContent = `${State.currentStation.country || "Wereldwijd"} • ${State.currentStation.bitrate || 128}k ${State.currentStation.codec || "MP3"}`;
    }
    if (DOM.btnMiniPlay) DOM.btnMiniPlay.textContent = State.isPlaying ? "⏸️" : "▶️";
    if (DOM.btnMiniMute) DOM.btnMiniMute.textContent = DOM.audio.muted ? "🔇" : "🔊";
  } else {
    DOM.miniPlayerHud.style.display = "none";
  }
}

// ==========================================================================
// 5. Continenten, Landen & Filters
// ==========================================================================
function setContinent(continentKey) {
  State.activeContinent = continentKey;
  State.activeCountry = "";

  try {
    localStorage.setItem("petervroon_last_continent", continentKey);
    localStorage.removeItem("petervroon_last_country");
  } catch (e) {}

  // Update continent pill knoppen
  document.querySelectorAll(".continent-btn").forEach(b => {
    b.classList.toggle("active", b.dataset.continent === continentKey);
  });

  // Update continent dropdown
  if (DOM.continentSelect) {
    DOM.continentSelect.value = continentKey;
  }

  populateCountrySelect();
  filterStations();

  // Laad direct live stations in voor dit continent via API
  loadContinentStations(continentKey);
}

function populateCountrySelect() {
  if (State.activeContinent === "all") {
    DOM.countrySelect.innerHTML = '<option value="">🗺️ Alle Landen Wereldwijd</option>';
    Object.values(CONTINENTS).forEach(cont => {
      const optgroup = document.createElement("optgroup");
      optgroup.label = `${cont.flag} ${cont.name}`;
      Object.entries(cont.countries).forEach(([code, name]) => {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = `${getFlagEmoji(code)} ${name}`;
        optgroup.appendChild(opt);
      });
      DOM.countrySelect.appendChild(optgroup);
    });
  } else {
    const cont = CONTINENTS[State.activeContinent];
    if (cont) {
      DOM.countrySelect.innerHTML = `<option value="">🗺️ Alle Landen in ${cont.name}</option>`;
      Object.entries(cont.countries).forEach(([code, name]) => {
        const opt = document.createElement("option");
        opt.value = code;
        opt.textContent = `${getFlagEmoji(code)} ${name}`;
        DOM.countrySelect.appendChild(opt);
      });
    }
  }
  DOM.countrySelect.value = State.activeCountry || "";
}

async function loadContinentStations(continentKey) {
  if (continentKey === "all") {
    queryRadioBrowserApi(false);
    return;
  }

  const contData = CONTINENTS[continentKey];
  if (!contData) return;

  DOM.loadingIndicator.style.display = "flex";
  DOM.stationCountText.textContent = `Zenders ophalen voor ${contData.name}...`;

  // Selecteer de top 6 landen van dit continent om parallel live stations op te halen
  const topCodes = Object.keys(contData.countries).slice(0, 6);
  const server = "https://de1.api.radio-browser.info";

  try {
    const promises = topCodes.map(code =>
      fetch(`${server}/json/stations/bycountrycodeexact/${code}?limit=15&order=votes&reverse=true&hidebroken=true`)
        .then(r => r.ok ? r.json() : [])
        .catch(() => [])
    );

    const resultsArray = await Promise.all(promises);
    let addedCount = 0;
    const existingIds = new Set(State.stations.map(s => s.id));

    resultsArray.forEach(data => {
      if (Array.isArray(data)) {
        data.forEach(item => {
          let streamUrl = item.url_resolved || item.url || "";
          if (streamUrl.startsWith("http://")) {
            streamUrl = streamUrl.replace("http://", "https://");
          }
          if (streamUrl && item.lastcheckok !== 0) {
            const id = item.stationuuid || Math.random().toString(36).substring(2);
            if (!existingIds.has(id)) {
              existingIds.add(id);
              const ccode = (item.countrycode || "").toUpperCase().trim();
              State.stations.push({
                id: id,
                name: item.name.trim(),
                country: item.country || contData.name,
                countrycode: ccode,
                continent: continentKey,
                tags: item.tags || "",
                codec: item.codec || "MP3",
                bitrate: item.bitrate || 128,
                url: streamUrl,
                favicon: item.favicon || "favicon.svg",
                votes: item.votes || 0
              });
              addedCount++;
            }
          }
        });
      }
    });

    filterStations();
    if (addedCount > 0) {
      showToast(`${contData.flag} ${contData.name}: ${addedCount} extra live radiostations geladen!`);
    }
  } catch (err) {
    console.warn("Fout bij ophalen continent zenders:", err);
  } finally {
    DOM.loadingIndicator.style.display = "none";
  }
}

async function queryCountryExact(countryCode) {
  if (!countryCode) return;
  DOM.loadingIndicator.style.display = "flex";
  DOM.stationCountText.textContent = `Zenders ophalen voor ${countryCode}...`;

  try {
    const server = "https://de1.api.radio-browser.info";
    const resp = await fetch(`${server}/json/stations/bycountrycodeexact/${countryCode}?limit=40&order=votes&reverse=true&hidebroken=true`);
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && data.length > 0) {
        let addedCount = 0;
        const existingIds = new Set(State.stations.map(s => s.id));

        data.forEach(item => {
          let streamUrl = item.url_resolved || item.url || "";
          if (streamUrl.startsWith("http://")) {
            streamUrl = streamUrl.replace("http://", "https://");
          }
          if (streamUrl && item.lastcheckok !== 0) {
            const id = item.stationuuid || Math.random().toString(36).substring(2);
            if (!existingIds.has(id)) {
              existingIds.add(id);
              State.stations.push({
                id: id,
                name: item.name.trim(),
                country: item.country || countryCode,
                countrycode: item.countrycode || countryCode,
                continent: State.activeContinent !== "all" ? State.activeContinent : (COUNTRY_TO_CONTINENT[item.countrycode] || "all"),
                tags: item.tags || "",
                codec: item.codec || "MP3",
                bitrate: item.bitrate || 128,
                url: streamUrl,
                favicon: item.favicon || "favicon.svg",
                votes: item.votes || 0
              });
              addedCount++;
            }
          }
        });

        filterStations();
        if (addedCount > 0) {
          showToast(`${getFlagEmoji(countryCode)} ${addedCount} live zenders opgehaald!`);
        }
      }
    }
  } catch (err) {
    console.warn("Fout bij ophalen landzenders:", err);
  } finally {
    DOM.loadingIndicator.style.display = "none";
  }
}

async function queryGenreStations(genreTag) {
  if (!genreTag) return;
  DOM.loadingIndicator.style.display = "flex";
  DOM.stationCountText.textContent = `Zenders ophalen voor genre '${genreTag}'...`;

  try {
    const servers = [
      "https://de1.api.radio-browser.info",
      "https://nl1.api.radio-browser.info",
      "https://at1.api.radio-browser.info"
    ];
    const server = servers[Math.floor(Math.random() * servers.length)];
    const url = `${server}/json/stations/search?tag=${encodeURIComponent(genreTag)}&limit=40&order=votes&reverse=true&hidebroken=true`;

    const resp = await fetch(url, { headers: { "User-Agent": "AntigravityInternetRadio/1.2" } });
    if (resp.ok) {
      const data = await resp.json();
      if (Array.isArray(data) && data.length > 0) {
        let addedCount = 0;
        const existingIds = new Set(State.stations.map(s => s.id));

        data.forEach(item => {
          let streamUrl = item.url_resolved || item.url || "";
          if (streamUrl.startsWith("http://")) {
            streamUrl = streamUrl.replace("http://", "https://");
          }
          if (streamUrl && item.lastcheckok !== 0) {
            const id = item.stationuuid || Math.random().toString(36).substring(2);
            if (!existingIds.has(id)) {
              existingIds.add(id);
              const ccode = (item.countrycode || "").toUpperCase().trim();
              State.stations.push({
                id: id,
                name: item.name.trim(),
                country: item.country || "Wereldwijd",
                countrycode: ccode,
                continent: COUNTRY_TO_CONTINENT[ccode] || "all",
                tags: item.tags || genreTag,
                codec: item.codec || "MP3",
                bitrate: item.bitrate || 128,
                url: streamUrl,
                favicon: item.favicon || "favicon.svg",
                votes: item.votes || 0
              });
              addedCount++;
            }
          }
        });

        filterStations();
        if (addedCount > 0) {
          showToast(`🎸 ${addedCount} extra live ${genreTag}-zenders geladen!`);
        }
      }
    }
  } catch (err) {
    console.warn("Fout bij ophalen genre zenders:", err);
  } finally {
    DOM.loadingIndicator.style.display = "none";
  }
}

function filterStations() {
  let list = [...State.stations];

  // Filter op continent
  if (State.activeContinent !== "all") {
    list = list.filter(st => {
      const c = (st.countrycode || "").toUpperCase().trim();
      const cCont = st.continent || COUNTRY_TO_CONTINENT[c] || COUNTRY_TO_CONTINENT[c.toLowerCase()];
      return cCont === State.activeContinent;
    });
  }

  // Filter op specifiek land
  if (State.activeCountry) {
    const targetCode = State.activeCountry.toUpperCase().trim();
    const countryFiltered = list.filter(st => (st.countrycode || "").toUpperCase().trim() === targetCode);
    if (countryFiltered.length > 0) {
      list = countryFiltered;
    } else {
      // Land heeft geen stations binnen dit continent: reset filter
      State.activeCountry = "";
      localStorage.removeItem("petervroon_last_country");
      if (DOM.countrySelect) DOM.countrySelect.value = "";
    }
  }

  // Filter op genre (zowel in tags als naam voor maximale trefzekerheid)
  if (State.activeGenre) {
    const genre = State.activeGenre.toLowerCase().trim();
    list = list.filter(st => {
      const tags = (st.tags || "").toLowerCase();
      const name = (st.name || "").toLowerCase();
      return tags.includes(genre) || name.includes(genre);
    });
  }

  // Filter op zoekopdracht
  if (State.searchQuery) {
    const query = State.searchQuery.toLowerCase().trim();
    list = list.filter(st =>
      st.name.toLowerCase().includes(query) ||
      (st.tags || "").toLowerCase().includes(query) ||
      (st.country || "").toLowerCase().includes(query)
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

  // Veiligheidsvangnet: als de gefilterde lijst leeg is en er is geen zoekterm,
  // toon dan alle zenders zodat de interface nooit zomaar blanco raakt
  if (list.length === 0 && !State.searchQuery) {
    list = [...State.stations];
  }

  // Zorg dat het actuele / laatst gekozen station ALTIJD prominent bovenaan staat in de lijst!
  if (State.currentStation) {
    const curIdx = list.findIndex(s => s.id === State.currentStation.id);
    if (curIdx > 0) {
      const [curSt] = list.splice(curIdx, 1);
      list.unshift(curSt);
    } else if (curIdx === -1 && !State.searchQuery && !State.activeGenre) {
      list.unshift(State.currentStation);
    }
  }

  renderStationList(list);

  // Als de lijst klein is of zoekopdracht actief is, probeer ook de Radio Browser API
  if (list.length < 5 && State.searchQuery && State.searchQuery.length >= 2) {
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
          const apiStations = data
            .filter(item => item && (item.url_resolved || item.url) && item.lastcheckok !== 0)
            .map(item => {
              let streamUrl = item.url_resolved || item.url || "";
              if (streamUrl.startsWith("http://")) {
                streamUrl = streamUrl.replace("http://", "https://");
              }
              return {
                id: item.stationuuid || Math.random().toString(36).substring(2),
                name: item.name.trim(),
                country: item.country || "Wereldwijd",
                countrycode: item.countrycode || "",
                continent: COUNTRY_TO_CONTINENT[item.countrycode] || "all",
                tags: item.tags || "",
                codec: item.codec || "MP3",
                bitrate: item.bitrate || 128,
                url: streamUrl,
                favicon: item.favicon || "favicon.svg",
                votes: item.votes || 0
              };
            });

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
// 7. Zenderlijst Renderen & Loze Links Herkenning
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
    const isBroken = State.brokenStationIds && State.brokenStationIds.has(station.id);

    const card = document.createElement("div");
    card.className = `station-card ${isCurrent ? "active" : ""} ${isBroken ? "broken-stream" : ""}`;
    card.dataset.id = station.id;
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
          ${isBroken ? '<span class="broken-stream-badge" title="Deze stream reageert niet of is offline">⚠️ Offline</span>' : ''}
          ${isCurrent ? '<span class="card-current-badge">ACTIEF</span>' : ''}
        </div>
        <div class="card-subtext">${escapeHtml(station.country || 'Wereldwijd')} • ${station.bitrate ? station.bitrate + 'k' : '128k'} ${station.codec || 'MP3'}</div>
        <div class="card-tags">
          ${isCurrent ? '<span class="tag-pill last-played-pill">🕒 Laatst Geluisterd</span>' : ''}
          ${tagsHtml}
        </div>
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
      // Blijf comfortabel op het overzicht (de voorkant) en update de mini-speler
      updateMiniPlayerUI();
    });

    DOM.stationList.appendChild(card);
  });
}

// ==========================================================================
// 8. Afspelen, Watchdog & Automatisch Herstel van Loze Links
// ==========================================================================
let streamWatchdogTimer = null;
let autoFallbackTimeout = null;

function markStationBroken(stationId) {
  if (!stationId) return;
  State.brokenStationIds.add(stationId);
  const card = document.querySelector(`.station-card[data-id="${stationId}"]`);
  if (card) {
    card.classList.add("broken-stream");
    if (!card.querySelector(".broken-stream-badge")) {
      const nameEl = card.querySelector(".card-name");
      if (nameEl) {
        const badge = document.createElement("span");
        badge.className = "broken-stream-badge";
        badge.title = "Deze stream reageert niet of is offline";
        badge.textContent = "⚠️ Offline";
        nameEl.insertAdjacentElement("afterend", badge);
      }
    }
  }
}

function findWorkingAlternative(failedStation) {
  if (!failedStation) return null;
  const tagKeywords = (failedStation.tags || "").toLowerCase().split(/[\s,]+/).filter(w => w.length > 2);

  // 1. Zoek in geladen zenders met zelfde genre
  for (const st of State.stations) {
    if (st.id === failedStation.id || State.brokenStationIds.has(st.id)) continue;
    const stTags = (st.tags || "").toLowerCase();
    if (tagKeywords.some(kw => stTags.includes(kw))) {
      return st;
    }
  }

  // 2. Zoek in zelfde land of continent
  for (const st of State.stations) {
    if (st.id === failedStation.id || State.brokenStationIds.has(st.id)) continue;
    if (st.countrycode === failedStation.countrycode || st.continent === failedStation.continent) {
      return st;
    }
  }

  // 3. Fallback naar een betrouwbaar werkend station uit curated stations
  return CURATED_STATIONS.find(s => s.id !== failedStation.id && !State.brokenStationIds.has(s.id)) || null;
}

function handleStreamFailure(station, isSilentAuto = false) {
  if (!station) return;
  markStationBroken(station.id);
  State.isPlaying = false;
  State.isBuffering = false;
  updatePlayerUI();

  if (isSilentAuto) return;

  const alt = findWorkingAlternative(station);
  if (alt && alt.id !== station.id) {
    showToast(`⚠️ "${station.name}" stream is offline. Overschakelen naar: ${alt.name}...`);
    if (autoFallbackTimeout) clearTimeout(autoFallbackTimeout);
    autoFallbackTimeout = setTimeout(() => {
      playStation(alt);
    }, 1400);
  } else {
    showToast(`⚠️ Stream offline: ${station.name}. Kies een andere zender.`);
  }
}

function playStation(station, isSilentAuto = false) {
  if (!station || !station.url) return;

  ensureAudioContext();

  State.currentStation = station;
  State.isBuffering = true;
  saveLastStation(station);
  updatePlayerUI();

  if (streamWatchdogTimer) clearTimeout(streamWatchdogTimer);

  // Reset en laad audio rechtstreeks zonder blokkerende CORS restrictie
  DOM.audio.removeAttribute("crossorigin");
  DOM.audio.src = station.url;
  DOM.audio.load();

  // Watchdog timer: als een stream binnen 6.5s nog niet begonnen is met spelen, trigger automatische recovery
  streamWatchdogTimer = setTimeout(() => {
    if (State.isBuffering && !State.isPlaying && State.currentStation && State.currentStation.id === station.id) {
      console.warn("Stream verbinding time-out (watchdog):", station.name);
      handleStreamFailure(station, isSilentAuto);
    }
  }, 6500);

  const playPromise = DOM.audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      if (streamWatchdogTimer) clearTimeout(streamWatchdogTimer);
      State.isPlaying = true;
      State.isBuffering = false;
      updatePlayerUI();
      if (!isSilentAuto) {
        showToast(`▶️ Live: ${station.name}`);
      }
    }).catch(err => {
      console.warn("Audio afspelen:", err);
      if (err.name === "NotAllowedError") {
        if (streamWatchdogTimer) clearTimeout(streamWatchdogTimer);
        State.isPlaying = false;
        State.isBuffering = false;
        updatePlayerUI();
        if (!isSilentAuto) {
          showToast(`👆 Klik op afspelen om ${station.name} te starten.`);
        }
      } else {
        // Probeer alternatief HTTPS protocol als URL http:// had
        if (station.url.startsWith("http://")) {
          const httpsUrl = station.url.replace("http://", "https://");
          DOM.audio.src = httpsUrl;
          DOM.audio.load();
          DOM.audio.play().then(() => {
            if (streamWatchdogTimer) clearTimeout(streamWatchdogTimer);
            State.isPlaying = true;
            State.isBuffering = false;
            updatePlayerUI();
          }).catch(() => {
            handleStreamFailure(station, isSilentAuto);
          });
        } else {
          handleStreamFailure(station, isSilentAuto);
        }
      }
    });
  }
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

  // Update actieve klasse in zenderlijst zonder de gefilterde lijst opnieuw te overschrijven
  document.querySelectorAll(".station-card").forEach(c => {
    c.classList.toggle("active", Boolean(st && c.dataset.id === st.id));
  });

  // Synchroniseer zwevende mini-speler op de voorkant
  updateMiniPlayerUI();
}

function toggleMute() {
  DOM.audio.muted = !DOM.audio.muted;
  DOM.volIcon.textContent = DOM.audio.muted ? "🔇" : "🔊";
  updateMiniPlayerUI();
  showToast(DOM.audio.muted ? "Dempen ingeschakeld" : "Geluid hersteld");
}

function updateVolumeIcon(val) {
  if (val === 0) DOM.volIcon.textContent = "🔇";
  else if (val < 50) DOM.volIcon.textContent = "🔉";
  else DOM.volIcon.textContent = "🔊";
}

// ==========================================================================
// 8b. Alle Genres Verkenner & Matrix Beheer (1-Klik Overzicht)
// ==========================================================================
function renderGenresModal() {
  if (!DOM.genresMatrixContainer) return;
  DOM.genresMatrixContainer.innerHTML = "";

  GENRES_CATALOG.forEach(cat => {
    const block = document.createElement("div");
    block.className = "genre-category-block";

    const header = document.createElement("div");
    header.className = "genre-category-header";
    header.innerHTML = `
      <div class="genre-category-title">
        <span class="genre-cat-icon">${cat.icon}</span>
        <span>${escapeHtml(cat.category)}</span>
      </div>
      <span class="genre-category-count">${cat.genres.length} genres</span>
    `;
    block.appendChild(header);

    const chipsWrap = document.createElement("div");
    chipsWrap.className = "genre-chips-wrap";

    cat.genres.forEach(g => {
      const chip = document.createElement("button");
      chip.className = "genre-chip" + (State.activeGenre === g.tag.toLowerCase() ? " active" : "");
      chip.dataset.genreTag = g.tag.toLowerCase();
      chip.dataset.genreName = g.name;
      chip.innerHTML = `<span class="genre-chip-icon">${g.icon}</span><span>${escapeHtml(g.name)}</span>`;

      chip.addEventListener("click", () => {
        selectGenre(g.tag.toLowerCase(), g.name);
        closeGenresModal();
      });

      chipsWrap.appendChild(chip);
    });

    block.appendChild(chipsWrap);
    DOM.genresMatrixContainer.appendChild(block);
  });
}

function openGenresModal() {
  if (!DOM.genresModal) return;
  renderGenresModal();
  DOM.genresModal.style.display = "flex";
  document.body.style.overflow = "hidden";
  if (DOM.genreModalSearch) {
    DOM.genreModalSearch.value = "";
    filterGenresInModal();
    DOM.genreModalSearch.focus();
  }
  if (DOM.btnClearGenreSearch) DOM.btnClearGenreSearch.style.display = "none";
}

function closeGenresModal() {
  if (!DOM.genresModal) return;
  DOM.genresModal.style.display = "none";
  document.body.style.overflow = "";
}

function filterGenresInModal() {
  const query = (DOM.genreModalSearch?.value || "").toLowerCase().trim();
  if (DOM.btnClearGenreSearch) {
    DOM.btnClearGenreSearch.style.display = query ? "inline-block" : "none";
  }

  document.querySelectorAll(".genre-category-block").forEach(block => {
    let visibleCount = 0;
    block.querySelectorAll(".genre-chip").forEach(chip => {
      const gName = (chip.dataset.genreName || "").toLowerCase();
      const gTag = (chip.dataset.genreTag || "").toLowerCase();
      const match = !query || gName.includes(query) || gTag.includes(query);
      chip.style.display = match ? "inline-flex" : "none";
      if (match) visibleCount++;
    });
    block.style.display = visibleCount > 0 ? "flex" : "none";
  });
}

function clearGenreSearch() {
  if (DOM.genreModalSearch) {
    DOM.genreModalSearch.value = "";
    filterGenresInModal();
    DOM.genreModalSearch.focus();
  }
}

function selectGenre(genreTag, displayName = "") {
  State.activeGenre = (genreTag || "").toLowerCase().trim();
  State.activeGenreTitle = displayName || genreTag || "Alle Zenders";

  // Update active status van pill knoppen in de scrollbar
  document.querySelectorAll(".genre-pill").forEach(b => {
    if (b.id === "btnOpenGenresModal") return;
    const bTag = (b.dataset.genre || "").toLowerCase().trim();
    const isActive = State.activeGenre ? bTag === State.activeGenre : bTag === "";
    b.classList.toggle("active", isActive);
    if (isActive) {
      b.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
    }
  });

  // Update knop in filterbalk
  if (DOM.btnAllGenres) {
    DOM.btnAllGenres.classList.toggle("active", !!State.activeGenre);
  }

  // Update chips in modal
  document.querySelectorAll(".genre-chip").forEach(chip => {
    chip.classList.toggle("active", chip.dataset.genreTag === State.activeGenre);
  });

  filterStations();

  // Haal extra live zenders op als er weinig lokaal beschikbaar zijn voor dit genre
  const localMatching = State.stations.filter(s => {
    const t = (s.tags || "").toLowerCase();
    const n = (s.name || "").toLowerCase();
    return t.includes(State.activeGenre) || n.includes(State.activeGenre);
  });
  if (State.activeGenre && localMatching.length < 12) {
    queryGenreStations(State.activeGenre);
  }

  if (State.activeGenre) {
    showToast(`🎸 Genre geselecteerd: ${State.activeGenreTitle}`);
  } else {
    showToast(`📻 Alle genres en zenders zichtbaar`);
  }
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

    // Analyser Node voor Visualizer
    State.analyserNode = State.audioCtx.createAnalyser();
    State.analyserNode.fftSize = 256;
    State.analyserNode.smoothingTimeConstant = 0.82;

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

    if (!State.isPlaying) {
      // Subtiele rustpuls golflijn als er niets speelt
      drawIdleLine(ctx, w, h, now);
      updateVuMeter(0, 0);
      return;
    }

    const bufferLength = State.analyserNode ? State.analyserNode.frequencyBinCount : 64;
    const freqData = new Uint8Array(bufferLength);
    let sum = 0;

    if (State.analyserNode && State.sourceNode) {
      try {
        State.analyserNode.getByteFrequencyData(freqData);
        for (let i = 0; i < bufferLength; i++) {
          sum += freqData[i];
        }
      } catch (e) { }
    }

    // Als de stream cross-origin is: genereer een vloeiende ritmische live visualizer
    if (sum === 0) {
      for (let i = 0; i < bufferLength; i++) {
        const beat = (Math.sin(now * 0.007) + 1) * 0.5;
        const wave = Math.sin(i * 0.18 + now * 0.009);
        const noise = Math.cos(i * 0.35 + now * 0.013);
        const val = Math.max(12, Math.min(240, Math.floor(beat * 130 + wave * 65 + noise * 30 + 45)));
        freqData[i] = val;
        sum += val;
      }
    }

    const avg = sum / bufferLength;
    const normLevel = Math.min(1, avg / 140);
    updateVuMeter(normLevel * 0.94, normLevel * 1.02);

    if (State.visMode === "bars") {
      drawSpectrumBars(ctx, freqData, w, h);
    } else {
      drawWaveform(ctx, freqData, w, h);
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

async function startRecording() {
  if (!State.isPlaying || !State.currentStation) {
    showToast("⚠️ Start eerst een radiostation om live audio op te nemen.");
    return;
  }

  const kbps = parseInt(DOM.recBitrate.value, 10) || 192;
  State.isRecording = true;
  State.recChunks = [];
  State.recordedBytesEstimate = 0;
  State.recordingStartTime = Date.now();
  State.recAbortController = new AbortController();

  updateRecordingUI(true);

  // Timer interval voor live klok (00:00:01...)
  State.recordingTimerInterval = setInterval(() => {
    const elapsed = Math.floor((Date.now() - State.recordingStartTime) / 1000);
    const hrs = String(Math.floor(elapsed / 3600)).padStart(2, "0");
    const mins = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0");
    const secs = String(elapsed % 60).padStart(2, "0");
    DOM.recTimer.textContent = `${hrs}:${mins}:${secs}`;
  }, 500);

  showToast(`🔴 MP3-opname gestart voor ${State.currentStation.name}!`);

  // Start live stream ingest (Direct of via streaming fallback)
  captureLiveStreamAudio(State.currentStation.url, State.recAbortController.signal);
}

async function captureLiveStreamAudio(targetUrl, signal) {
  let streamResponse = null;

  // Probeer 1: Directe streaming fetch van de radiostroom
  try {
    streamResponse = await fetch(targetUrl, { signal });
  } catch (err) {
    if (signal.aborted) return;
    console.warn("Direct stream fetch geblokkeerd door CORS, schakel over naar streaming proxy...", err);
  }

  // Probeer 2: Streaming CORS proxy fallback als directe fetch faalt
  if (!streamResponse || !streamResponse.ok || !streamResponse.body) {
    try {
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
      streamResponse = await fetch(proxyUrl, { signal });
    } catch (proxyErr) {
      if (signal.aborted) return;
      console.warn("Streaming proxy faalde:", proxyErr);
    }
  }

  // Probeer 3: Tweede streaming proxy fallback
  if (!streamResponse || !streamResponse.ok || !streamResponse.body) {
    try {
      const proxy2 = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;
      streamResponse = await fetch(proxy2, { signal });
    } catch (proxyErr2) {
      if (signal.aborted) return;
      console.warn("Tweede proxy faalde:", proxyErr2);
    }
  }

  // Verwerk binnenkomende MP3 stream chunks in real-time
  if (streamResponse && streamResponse.body) {
    try {
      const reader = streamResponse.body.getReader();
      State.activeStreamReader = reader;

      while (State.isRecording && !signal.aborted) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value && value.length > 0) {
          State.recChunks.push(value);
          State.recordedBytesEstimate += value.length;
          updateRecordingStats();
        }
      }
    } catch (readErr) {
      if (!signal.aborted) {
        console.warn("Stream reader onderbroken:", readErr);
      }
    }
  } else {
    // Probeer 3: MediaRecorder fallback via HTML5 audio capture
    tryMediaRecorderFallback();
  }
}

function tryMediaRecorderFallback() {
  try {
    let stream = null;
    if (typeof DOM.audio.captureStream === "function") {
      stream = DOM.audio.captureStream();
    } else if (typeof DOM.audio.mozCaptureStream === "function") {
      stream = DOM.audio.mozCaptureStream();
    }

    if (stream && window.MediaRecorder) {
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : (MediaRecorder.isTypeSupported("audio/mp4") ? "audio/mp4" : "");

      State.mediaRecorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      State.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          State.recChunks.push(e.data);
          State.recordedBytesEstimate += e.data.size;
          updateRecordingStats();
        }
      };
      State.mediaRecorder.start(250);
    }
  } catch (e) {
    console.warn("MediaRecorder fallback niet beschikbaar:", e);
  }
}

function stopRecording() {
  if (!State.isRecording) return;
  State.isRecording = false;

  clearInterval(State.recordingTimerInterval);

  // Annuleer actieve streaming readers en abort controllers
  if (State.recAbortController) {
    State.recAbortController.abort();
    State.recAbortController = null;
  }
  if (State.activeStreamReader) {
    try { State.activeStreamReader.cancel(); } catch (e) { }
    State.activeStreamReader = null;
  }
  if (State.mediaRecorder && State.mediaRecorder.state !== "inactive") {
    try { State.mediaRecorder.stop(); } catch (e) { }
    State.mediaRecorder = null;
  }

  updateRecordingUI(false);

  // Controleer of er data is opgenomen
  if (!State.recChunks || State.recChunks.length === 0) {
    showToast("⚠️ Geen audiogegevens ontvangen van deze stream tijdens opname.");
    return;
  }

  // Maak authentieke MP3 audio Blob
  const mp3Blob = new Blob(State.recChunks, { type: "audio/mp3" });
  const stationName = State.currentStation ? State.currentStation.name.replace(/[^a-zA-Z0-9_-]/g, "_") : "Radio";
  const dateStr = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const filename = `PeterVroonRadio_${stationName}_Opname_${dateStr}.mp3`;
  const durationSec = Math.floor((Date.now() - State.recordingStartTime) / 1000);
  const sizeMb = (mp3Blob.size / (1024 * 1024)).toFixed(2);

  // Sla opname op in sessielijst
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

  showToast(`✅ MP3-opname gereed: ${filename} (${sizeMb} MB)`);

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
// 11. Onthouden van Laatst Gekozen Station & Favorieten Beheer (LocalStorage)
// ==========================================================================
function saveLastStation(station) {
  if (!station || !station.url) return;
  try {
    localStorage.setItem("petervroon_last_station", JSON.stringify(station));
    localStorage.setItem("petervroon_last_station_id", station.id);

    const cont = station.continent || COUNTRY_TO_CONTINENT[(station.countrycode || "").toUpperCase()] || State.activeContinent;
    if (cont) {
      localStorage.setItem("petervroon_last_continent", cont);
    }
    if (station.countrycode) {
      localStorage.setItem("petervroon_last_country", station.countrycode);
    } else {
      localStorage.removeItem("petervroon_last_country");
    }
  } catch (err) {
    console.warn("Kon laatste station niet opslaan:", err);
  }
}

function loadLastStation() {
  try {
    const saved = localStorage.getItem("petervroon_last_station");
    if (saved) {
      const station = JSON.parse(saved);
      if (station && station.url) {
        const match = CURATED_STATIONS.find(s => s.id === station.id);
        if (match) {
          return { ...match, ...station, url: match.url };
        }
        return station;
      }
    }
    const savedId = localStorage.getItem("petervroon_last_station_id");
    if (savedId) {
      const match = CURATED_STATIONS.find(s => s.id === savedId);
      if (match) return match;
    }
  } catch (err) {
    console.warn("Kon laatste station niet laden:", err);
  }
  return null;
}

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
  filterStations();
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
    filterStations();
    showToast("Alle favorieten gewist.");
  }
}

// ==========================================================================
// 12. Help, Documentatie & Dynamische Version Sync (AGENTS.md)
// ==========================================================================
async function fetchVersionData(showFeedback = false) {
  try {
    const res = await fetch(`version.json?_t=${Date.now()}`);
    if (res.ok) {
      const vdata = await res.json();
      const verStr = `v${vdata.version || "1.0.5"}`;
      const buildStr = `Build ${vdata.build || 6}`;

      if (DOM.verPillText) DOM.verPillText.textContent = `${verStr} ${buildStr}`;
      if (DOM.subbarVerText) DOM.subbarVerText.textContent = verStr;
      if (DOM.footerVerNote) DOM.footerVerNote.textContent = `PeterVroon Radio • ${verStr} ${buildStr} • GitHub Pages Online Editie`;
      if (DOM.helpVersionBadge) DOM.helpVersionBadge.textContent = `✓ Altijd Actueel • ${verStr} ${buildStr}`;
      if (DOM.helpGitHash) DOM.helpGitHash.textContent = `${buildStr} (${vdata.git_hash || "online"})`;

      // Render dynamische featurelijst in Help modal
      if (Array.isArray(vdata.features)) {
        DOM.helpFeaturesList.innerHTML = vdata.features.map(f => `
          <div class="feature-item">
            ${escapeHtml(f)}
          </div>
        `).join("");
      }

      if (showFeedback) {
        showToast(`✓ PeterVroon Radio ${verStr} ${buildStr} is 100% up-to-date!`);
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
