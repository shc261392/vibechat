# VibeChat

A local desktop app that provides an AI-powered chatroom with configurable personalities. Your AI companions respond to periodic screen captures, remember conversations, and keep you in a good mood—all running completely local and private.

## Features

- **🎭 Configurable AI Personalities**: Set up multiple AI companions with different personalities and traits
- **📸 Screen-aware Chat**: AI responses take periodic screen captures (10-30 seconds) into account
- **🧠 Memory Management**: Conversations are remembered and can be edited/managed
- **💻 100% Local & Private**: No cloud storage, no data collection—everything runs on your machine
- **🚀 Desktop App**: Built with Electron for a native desktop experience
- **⚙️ Fully Customizable**: Control capture frequency, personality traits, memory pool, and more

## Project Structure

```
vibechat/
├── src/
│   ├── electron/          # Electron main process
│   ├── renderer/          # React UI components
│   ├── types/            # TypeScript type definitions
│   ├── lib/              # Core functionality
│   │   ├── llm/         # Local LLM integration
│   │   ├── capture/     # Screen capture module
│   │   ├── memory/      # Memory management
│   │   └── chat/        # Chat logic
│   └── styles/          # CSS/styling
├── public/              # Static assets
├── tests/              # Test suites
├── package.json
├── tsconfig.json
├── LICENSE
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A local LLM (e.g., Ollama, LM Studio)

### Installation

```bash
git clone https://github.com/shc261392/vibechat.git
cd vibechat
npm install
```

### Development

```bash
npm run dev
```

This starts both the React development server and Electron.

### Building

```bash
npm run build
npm run dist
```

## Architecture

### Core Components

1. **Electron Main Process** (`src/electron/main.ts`)
   - Window management
   - File system access
   - Process control

2. **React UI** (`src/renderer/`)
   - Chat interface
   - Personality settings
   - Memory management UI
   - Configuration panel

3. **Screen Capture Module** (`src/lib/capture/`)
   - Periodic screenshot capture
   - Image processing
   - Intelligent downsampling

4. **LLM Integration** (`src/lib/llm/`)
   - API communication with local LLM
   - Prompt generation
   - Response processing

5. **Memory System** (`src/lib/memory/`)
   - SQLite-based conversation storage
   - Context management
   - Memory retrieval and editing

## Configuration

Create a `.env` file in the project root:

```env
# LLM Configuration
LLM_API_URL=http://localhost:11434/api
LLM_MODEL=mistral

# Capture Settings
CAPTURE_INTERVAL=15000  # milliseconds (15 seconds)
CAPTURE_QUALITY=0.7

# Memory
MEMORY_DB_PATH=./vibechat_memory.db
```

## Development Guidelines

- **TypeScript**: Strict mode enabled, all code must be type-safe
- **React**: Functional components with hooks preferred
- **Styling**: Tailwind CSS for UI
- **Testing**: Jest + React Testing Library
- **Git**: Conventional commits

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## Roadmap

- [ ] Multi-personality support
- [ ] Conversation export/import
- [ ] Custom model fine-tuning
- [ ] Voice input/output
- [ ] Browser extension support
- [ ] Mobile companion app
- [ ] Performance optimizations
- [ ] Accessibility improvements

## Support

For issues, feature requests, or questions, please [open an issue](https://github.com/shc261392/vibechat/issues) on GitHub.

---

Made with ❤️ for keeping good vibes
