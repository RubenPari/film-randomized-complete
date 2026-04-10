# 🎬 Film Randomized - Generatore Random di Film e Serie TV

Un'applicazione web moderna che ti aiuta a scoprire film e serie TV casuali in base ai tuoi gusti personali. Utilizza l'API di The Movie Database (TMDb) per fornire raccomandazioni personalizzate.

Questa cartella (`film-randomized/`) è il **frontend** del monorepo; il backend **NestJS** si trova in `film-randomized-back/` nella directory padre. Per lo stack completo con Docker vedi più sotto la sezione **Docker Compose (Full Stack)**.

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=flat&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-06B6D4?style=flat&logo=tailwindcss)

## ✨ Caratteristiche

### 🎯 Funzionalità Principali

- **Generazione Casuale Intelligente**: Scopri film e serie TV casuali con un algoritmo che evita ripetizioni
- **Filtri Avanzati**: Filtra per genere, valutazione (0-10), e anno di uscita
- **Doppia Modalità**: Passa facilmente tra film e serie TV
- **Internazionalizzazione**: Italiano e inglese (i18n)
- **Design Moderno**: Interfaccia pulita e responsive con TailwindCSS

## 🚀 Quick Start

### Prerequisiti

- **Node.js**: versione 18.0.0 o superiore
- **npm**: versione 9.0.0 o superiore

### Installazione

1. **Clona il repository** e entra nella cartella del frontend

```bash
git clone <repository-url>
cd film-randomized-complete/film-randomized
```

2. **Installa le dipendenze**

```bash
npm install
```

3. **Avvia il server di sviluppo**

```bash
npm run dev
```

4. **Apri il browser**

```
http://localhost:5173
```

## 🐳 Docker Compose (Full Stack)

Lo stack Docker è definito nella **root del monorepo** (`film-randomized-complete/docker-compose.yml`), non in questa cartella.

### Prerequisiti

- **Docker** installato e in esecuzione
- **Docker Compose v2** (integrato in Docker Desktop recente)

### Configurazione variabili d'ambiente

Nella **root del monorepo** (`film-randomized-complete/`) crea un file `.env` (non viene committato) con almeno:

```env
VITE_TMDB_API_KEY=la_tua_chiave_tmdb
JWT_SECRET=stringa_segreta_di_almeno_trentadue_caratteri
```

`JWT_SECRET` è richiesto dal backend NestJS (validazione all’avvio). Il database PostgreSQL nel servizio `db` è già cablato in `docker-compose.yml` (nessun provider esterno come Neon).

### Avvio dello stack completo

Dalla root del monorepo:

```bash
cd film-randomized-complete
docker compose up --build
```

Questo comando:

- avvia **PostgreSQL** (`db`)
- builda ed esegue il **backend NestJS** (`backend`, migrazioni TypeORM all’avvio, API sulla porta 8000 nella rete Docker)
- builda il **frontend** Vite e lo serve con **Nginx** (`frontend`, porta **80** sull’host)

Nginx inoltra le richieste `/api/*` al backend (vedi `nginx.conf` in questa cartella).

### URL di accesso

- Applicazione web: `http://localhost`
- API (stesso host, percorso prefissato): `http://localhost/api/…` (es. `GET /api/health`)

Il backend non espone la porta 8000 sull’host di default: in sviluppo locale senza Docker usi `http://localhost:8000` dal package `film-randomized-back`.

Per fermare tutto:

```bash
docker compose down
```

## 📋 Comandi Disponibili

### Sviluppo

```bash
npm run dev          # Avvia il server di sviluppo (http://localhost:5173)
npm run build        # Crea la build di produzione
npm run preview      # Anteprima della build di produzione
```

### Qualità del Codice

```bash
npm run lint         # Esegue ESLint su tutti i file
npm run format       # Formatta il codice con Prettier
npm run format:check # Verifica la formattazione senza modificare
```

## 🏗️ Architettura

### Stack Tecnologico

#### Frontend

- **React 19.0.0**: Framework UI con le ultime funzionalità
- **Vite 6.2.0**: Build tool ultra-veloce con HMR
- **TailwindCSS 3.4.17**: Framework CSS utility-first
- **ESLint 9.21.0**: Linting con regole per React Hooks e React Refresh
- **Prettier 3.5.3**: Formattazione automatica del codice

#### APIs

- **TMDb API**: film e serie TV (chiamate dal browser al build/runtime)
- **Backend NestJS** (`../film-randomized-back/`): autenticazione, watchlist, email (fuori da questo package; in produzione Docker le chiamate passano da `/api`)

### Struttura del Progetto (sintesi)

```
film-randomized/
├── src/
│   ├── features/media/       # Generazione media, filtri, card, contesto filtri
│   ├── features/watchlist/   # Pagina e componenti watchlist
│   ├── pages/                # HomePage, auth, NotFound, ecc.
│   ├── shared/               # context, services (apiClient, tmdbApi), constants
│   ├── locales/              # Traduzioni i18n (en / it)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── Dockerfile                # Build Vite + Nginx (usato da docker-compose nella root del monorepo)
├── nginx.conf
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

### Flusso di Dati

```
Filtri → useMediaGenerator → tmdbApi.discoverMedia()
                                              ↓
                    Selezione pagina casuale + fetchMediaDetails()
                                              ↓
                    Validazione descrizione + controllo duplicati
                                              ↓
                              Display MediaCard
```

### Pattern Architetturali

#### 1. Custom Hook Pattern

`useMediaGenerator` incapsula tutta la logica di generazione media, inclusi:

- Gestione stato filtri
- Chiamate API TMDb
- Tracking media visualizzati
- Algoritmo di randomizzazione

#### 2. Service Layer

I servizi API sono isolati nel modulo `tmdbApi.js` che gestisce tutte le interazioni con The Movie Database.

#### 3. Component Composition

Componenti piccoli e riutilizzabili per filtri e UI elements, garantendo manutenibilità e riusabilità del codice.

## 🔧 Configurazione

### TMDb API Key

Attenzione: **non inserire mai la tua API key TMDb direttamente nel codice sorgente** e non committarla nel repository.

In questo progetto la chiave è letta tramite variabile d'ambiente in `src/shared/constants/api.js`:

```javascript
export const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
```

Per configurarla in locale (senza Docker):

1. Ottieni una chiave API gratuita da [TMDb](https://www.themoviedb.org/settings/api)
2. Nella root del progetto crea/modifica il file `.env` (già ignorato da Git) con:

```env
VITE_TMDB_API_KEY=la_tua_chiave_tmdb
```
3. Riavvia il server di sviluppo (`npm run dev`) se era già in esecuzione.

Quando usi Docker Compose dalla root del monorepo, `VITE_TMDB_API_KEY` viene passata al build del container frontend tramite il file `.env` in quella directory.

## 🎨 Personalizzazione

### Aggiungere Nuovi Filtri

1. **Aggiungi stato in `src/features/media/hooks/useMediaGenerator.js`** (o nel hook filtri collegato):

```javascript
const [nuovoFiltro, setNuovoFiltro] = useState(defaultValue);
```

2. **Includi nel filters object**:

```javascript
const filters = {
  minRating,
  maxRating,
  nuovoFiltro, // Aggiungi qui
  // ...
};
```

3. **Aggiorna `tmdbApi.discoverMedia()`** per costruire il parametro query

4. **Crea componente UI** sotto `src/features/media/components/` (o `filters/`)

5. **Aggiungi alla sezione filtri** in `FilterPanel.jsx` / `HomePage.jsx` come da struttura attuale

### Modificare Stili

L'applicazione usa TailwindCSS. Per personalizzare:

- **Colori/temi**: Modifica `tailwind.config.js`
- **Stili globali**: Modifica `src/index.css`
- **Componenti**: Usa classi Tailwind direttamente nei componenti

## 🧪 Testing

### Testare l'Applicazione Manualmente

1. **Test Generazione Media**:

   - Clicca "Genera Contenuto Casuale"
   - Verifica che il media mostrato sia diverso ogni volta
   - Testa i filtri per genere, rating, anno

2. **Test Filtri**:
   - Prova diverse combinazioni di filtri
   - Verifica che i risultati rispettino i criteri impostati
   - Testa il passaggio tra modalità Film e Serie TV

## 🐛 Troubleshooting

### Problemi Comuni

**Errore: "Nessun risultato trovato"**

- I filtri sono troppo restrittivi
- Prova ad ampliare l'intervallo di anni o rimuovere filtri genere
- Verifica la connessione a Internet (necessaria per TMDb API)

**Media senza descrizione utilizzabile**

- L'algoritmo filtra automaticamente questi casi
- Clicca "Genera Contenuto Casuale" per ottenere un altro suggerimento

**Errore API TMDb**

- Verifica che la chiave API sia valida
- Controlla di non aver superato il rate limit (40 richieste ogni 10 secondi)

## 📝 Note di Sviluppo

### Code Style

- **Line width**: 100 caratteri (Prettier)
- **Quotes**: Single quotes
- **Indentazione**: 2 spazi
- **Semicoloni**: Obbligatori
- **Function style**: Function expressions per componenti, function declarations per utility
- **Imports**: Sempre con estensioni `.jsx` o `.js`

### Best Practices

- Usa sempre i servizi API invece di fetch diretto
- Valida descrizioni italiane con `hasValidDescription()`
- Gestisci errori con try/catch e mostra messaggi utente-friendly
- Mantieni componenti piccoli e focalizzati
- Evita di fare troppe richieste consecutive all'API TMDb

## 🔐 Sicurezza

⚠️ **Attenzione**: non esporre mai l'API key di TMDb nel codice sorgente committato.

Per un'applicazione in produzione:

1. Usa sempre variabili d'ambiente per la chiave API (non committare il file `.env`)
2. Considera di creare un backend proxy per le chiamate TMDb
3. Mantieni le chiavi solo in sistemi di secret management o variabili d'ambiente del provider
4. Implementa rate limiting lato client per evitare di superare i limiti TMDb

## 🚀 Deploy

### Build per Produzione

```bash
npm run build
```

I file ottimizzati saranno generati nella cartella `dist/`.

### Deploy su Vercel/Netlify

1. Connetti il repository GitHub
2. Configura build command: `npm run build`
3. Configura output directory: `dist`
4. Aggiungi variabili d'ambiente se necessario
5. Deploy!

### Note Importanti

- Assicurati di configurare la chiave API TMDb come variabile d'ambiente
- Verifica che le richieste all'API TMDb siano ottimizzate per evitare rate limiting

## 📄 Licenza

Questo progetto è sviluppato per scopi educativi.

## 🙏 Riconoscimenti

- **TMDb API**: Dati su film e serie TV forniti da [The Movie Database](https://www.themoviedb.org/)
- **React Team**: Per il framework incredibile
- **Vite Team**: Per la developer experience eccezionale
- **TailwindCSS**: Per lo styling utility-first

## 📞 Supporto

Per domande o problemi, apri una issue nel repository.

---

**Sviluppato con ❤️ e ☕**
