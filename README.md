# Astra Browser

A Firefox-based browser built for Indian users — featuring a frosted glass UI with a warm Indian sunset aesthetic, sidebar navigation, workspaces, pinned sites, and an integrated AI assistant.

## Architecture

Built on top of Mozilla Firefox using the [`@zen-browser/surfer`](https://github.com/zen-browser/surfer) build system.

```
astra-desktop/
├── surfer.json                          # Surfer build config
├── patches/                             # Firefox source patches (.patch files)
├── configs/
│   └── common/astra.js                  # Default browser preferences
└── src/
    └── browser/
        ├── themes/astra/astra.css       # Main theme (frosted glass)
        ├── branding/astra/              # Branding assets & moz.build
        └── base/content/
            ├── astra-sidebar.js         # Sidebar + Workspaces + Pinned Sites
            ├── astra-ai.js              # AI assistant integration
            └── astra-newtab.html        # Custom new tab page
```

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3 (for Firefox build system)
- Mozilla build prerequisites: https://firefox-source-docs.mozilla.org/setup/

### Setup

```bash
npm install

# Download Firefox source
npm run download

# Import Astra patches into Firefox source
npm run import

# Build
npm run build
```

## Key Features

### Frosted Glass UI
CSS-based frosted glass effects using `backdrop-filter: blur()` with an Indian sunset color palette (deep indigo → violet → magenta → orange → gold).

### Sidebar Navigation
Vertical tab list replacing the traditional horizontal tab bar. Collapsible to icon-only mode.

### Workspaces
Tab grouping with named workspaces. Stored in `astra.workspaces.data` preference.

### Pinned Sites / Speed Dial
Quick-access grid on the new tab page with default Indian sites (Google India, YouTube, Flipkart, Amazon India, IRCTC, etc.).

### AI Assistant
In-browser AI chat panel (Ctrl+Shift+A). Connects to:
- **Ollama** (default, local) — `http://localhost:11434`
- Any **OpenAI-compatible** API endpoint

Configure via `about:config`:
- `astra.ai.provider` — `ollama` or `openai`
- `astra.ai.endpoint` — API base URL
- `astra.ai.model` — Model name
- `astra.ai.apiKey` — API key (for cloud providers)

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Deep Indigo | `#1A1035` | Background base |
| Twilight Purple | `#2D1B69` | Sidebar/panels |
| Violet | `#4A1B8C` | Active states |
| Magenta | `#8B2252` | Gradients |
| Sunset Orange | `#D4532A` | Accents |
| Golden Hour | `#F0A500` | Primary accent |
| Amber | `#FFCB47` | Hover states |

## License

Mozilla Public License 2.0 — see [LICENSE](LICENSE).
