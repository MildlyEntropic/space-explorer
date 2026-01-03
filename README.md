# Cosmic Mirror

A modern portal for exploring NASA imagery and space science data. Mars rovers, JWST, Hubble, APOD, and educational content — all in one clean interface.

**[Live Demo](https://cosmicmirror.vercel.app)**

## Features

### Imagery

- **Mars Rovers**: All 4 rovers (Perseverance, Curiosity, Opportunity, Spirit) with 20+ years of imagery
- **JWST Gallery**: Latest images from the James Webb Space Telescope
- **Hubble Archive**: Classic imagery from the Hubble Space Telescope
- **APOD**: NASA's Astronomy Picture of the Day

### Education Section

- **Solar System**: Comprehensive data on all planets, dwarf planets, and small bodies with science/humanities/moons tri-pane detail views
- **Constellations**: 88 IAU constellations plus 17 cultural sky traditions (Chinese, Hindu, Polynesian, Aboriginal, and more)
- **Hall of Fame**: Space pioneers including astronauts, cosmonauts, astronomers, and unsung heroes (Hidden Figures, Mission Control, engineers)
- **Cosmic Distance Ladder**: How we measure the universe

### Interface

- **Clean Dark UI**: Minimal, responsive design
- **Powerful Filters**: Sol range, Earth date, camera selection, text search
- **Lightbox Viewer**: Full-screen image viewing
- **No API Key Required**: Uses NASA's public APIs

## Quick Start

```bash
# Clone the repo
git clone https://github.com/MildlyEntropic/space-explorer.git
cd space-explorer

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## Tech Stack

- **[SvelteKit 2](https://kit.svelte.dev/)** + **[Svelte 5](https://svelte.dev/)** - Frontend framework with runes
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vercel](https://vercel.com/)** - Hosting with serverless functions

## Data Sources

| Source | Content |
| ------ | ------- |
| [NASA Mars API](https://mars.nasa.gov) | Perseverance & Curiosity imagery |
| [PDS Archive](https://planetarydata.jpl.nasa.gov) | Spirit & Opportunity archives |
| [JWST via STScI](https://webbtelescope.org) | James Webb Space Telescope |
| [Hubble via STScI](https://hubblesite.org) | Hubble Space Telescope |
| [NASA APOD](https://apod.nasa.gov) | Astronomy Picture of the Day |
| [NASA Planetary Factsheets](https://nssdc.gsfc.nasa.gov/planetary/factsheet/) | Solar system data |
| [IAU](https://www.iau.org) | Constellation definitions |

## Project Structure

```text
src/
├── lib/
│   ├── api/
│   │   └── nasa.ts              # API clients for all sources
│   ├── components/
│   │   ├── FilterPanel.svelte   # Search filters
│   │   ├── LatestPhotos.svelte  # Image carousels
│   │   ├── Lightbox.svelte      # Full-screen viewer
│   │   ├── PhotoGrid.svelte     # Image grids
│   │   └── ...
│   └── types/
│       └── mars.ts              # TypeScript types
├── routes/
│   ├── +page.svelte             # Home (APOD + Mars)
│   ├── telescopes/+page.svelte  # JWST & Hubble
│   ├── education/+page.svelte   # Solar system, constellations, Hall of Fame
│   └── api/
│       ├── mer/+server.ts       # PDS proxy for legacy rovers
│       └── mer-image/+server.ts # Image proxy (CORS bypass)
```

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Deploy (auto-detects SvelteKit)

The proxy endpoints require serverless functions for Spirit/Opportunity CORS bypass.

## Contributing

Contributions welcome! Ideas:

- [ ] More cultural constellation systems
- [ ] Mission timelines
- [ ] Rocket/launch vehicle database
- [ ] Deep sky object catalog
- [ ] Interactive solar system visualization

## License

MIT

---

**Data**: NASA/JPL-Caltech, STScI, IAU (public domain / CC-BY)
**Not affiliated with NASA**
