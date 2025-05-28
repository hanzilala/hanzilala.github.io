# Hanzii Lala 🌸

A beautiful and interactive language learning application for studying Chinese characters with stroke animations, definitions, and examples.

## 🤖 AI-Powered Development

This project serves as an **experimental showcase** of AI-assisted software development, demonstrating how modern AI tools can create sophisticated, production-ready applications with minimal human intervention.

### 🧠 AI Technologies Used
- **Claude Sonnet 4**: Primary AI assistant for code generation, architecture design, and problem-solving
- **Cursor IDE**: AI-powered code editor with intelligent suggestions and refactoring
- **AI-Driven Development**: Nearly 95% of the codebase was generated through AI assistance
- **Iterative AI Collaboration**: Human-AI pair programming approach for feature development

### 💻 Technologies & Implementation
- **React 18 + TypeScript**: Modern frontend framework with type safety
- **Tailwind CSS + Catppuccin**: Utility-first styling with beautiful color palette
- **Hanzi Writer**: Interactive Chinese character stroke animations
- **Hanzii API**: External API integration for word definitions and examples
- **Local Storage**: Client-side data persistence and management
- **Responsive Design**: CSS Grid and Flexbox for adaptive layouts
- **Component Architecture**: Modular React components with proper separation of concerns

## ✨ Features

### 🎨 Beautiful UI
- **Catppuccin Theme Support**: Four gorgeous themes (Latte, Mocha, Frappe, Macchiato)
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern Interface**: Clean, minimalist design with smooth animations

### 📚 Word Learning
- **Slideshow Mode**: Browse through your daily vocabulary with navigation controls
- **API Integration**: Fetches definitions, pronunciations, and examples from Hanzii API
- **Local Storage**: Automatically saves and manages your word collection
- **Daily Reset**: Clears old words and focuses on today's learning

### 🖌️ Interactive Kanji/Hanzi
- **Stroke Animations**: Watch characters being drawn stroke by stroke

### 🔍 Smart Search
- **Instant Search**: Look up any word with the floating search interface

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- pnpm package manager

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hanzii-lala.git
   cd hanzii-lala
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure Environment Variables (Optional)**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Google Client ID for authentication:
   ```env
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   ```
   
   > **Note**: See [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) for detailed configuration instructions.

4. **Start development server**
   ```bash
   pnpm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3002
   ```

## 🚀 Deployment

### Automatic Deployment
This project is configured with **GitHub Actions** for automatic deployment to GitHub Pages:

- **Trigger**: Automatically deploys on push to `master` branch
- **Build Process**: Uses pnpm to install dependencies and build the project
- **Output**: Deploys to GitHub Pages at `https://yourusername.github.io/hanzii-lala/`

### Environment Variables for GitHub Pages
To enable Google authentication on GitHub Pages:

1. **Set Repository Secret**:
   - Go to **Settings** → **Secrets and variables** → **Actions**
   - Add `GOOGLE_CLIENT_ID` with your Google OAuth Client ID

2. **Configure Google Cloud Console**:
   - Add your GitHub Pages URL to authorized origins
   - See [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) for complete setup guide

### Manual Deployment
To deploy manually:

1. **Build the project**
   ```bash
   pnpm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

### GitHub Pages Setup
To enable GitHub Pages deployment:

1. Go to your repository **Settings** → **Pages**
2. Set **Source** to "GitHub Actions"
3. Push to the `master` branch to trigger automatic deployment

## 🎮 Usage

### Basic Navigation
- **← →**: Navigate between words in your collection
- **🔍**: Open search to look up any word
- **🎨**: Switch between Catppuccin themes (top-left corner)

### Learning Features
- **Usage Panel (Left 40%)**:
  - Word pronunciation and definitions
  - Example sentences
  - Timestamp when word was added
  - Scrollable for long content

- **Kanji Panel (Right 60%)**:
  - Interactive character display with hanzi-writer
  - Individual character breakdown
  - Control buttons for each character:
    - ▶️ Animate stroke order
    - 👁️ Show character
    - 🙈 Hide character
    - ✏️ Practice writing (quiz mode)

### Search Functionality
1. Click the 🔍 search button
2. Type any Chinese word
3. Press Enter or click Search
4. View instant results with full analysis
5. Press Escape or click outside to close

### Theme Switching
- Click the theme switcher in the top-left corner
- Choose from 2 beautiful Catppuccin themes:
  - 🌅 **Latte** (Light theme)
  - 🌙 **Mocha** (Dark theme)

## 🛠️ Technical Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Catppuccin** color palette
- **Vite** for fast development

### Libraries
- **hanzi-writer**: Interactive Chinese character stroke animations
- **React Hooks**: Modern state management
- **CSS Grid & Flexbox**: Responsive layouts

### API Integration
- **Hanzii API**: Word definitions and examples
- **Error Handling**: Graceful fallbacks and user feedback
- **CORS Support**: Proper API communication

### Storage
- **localStorage**: Persistent word collection
- **Automatic Cleanup**: Removes outdated entries
- **Data Validation**: Ensures data integrity

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ThemeProvider.tsx # Theme context and management
│   └── ThemeSwitcher.tsx # Theme selection UI
├── pages/SlideShow/      # Main application pages
│   ├── index.tsx         # Main slideshow container
│   ├── Content.tsx       # Content layout manager
│   ├── Usage.tsx         # Word usage and definitions
│   ├── Kanji.tsx         # Kanji analysis container
│   ├── KanjiCharacter.tsx # Individual character component
│   └── ControlView.tsx   # Navigation and search controls
├── api/                  # API integration
│   └── hanzii.ts         # Hanzii API client
├── utils.ts              # Utility functions
└── types.d.ts            # TypeScript type definitions
```

## 🎨 Customization

### Adding New Themes
1. Update `ThemeProvider.tsx` with new theme type
2. Add theme colors to `KanjiCharacter.tsx` color palette
3. Update theme switcher options

### Modifying API
- Edit `src/api/hanzii.ts` to change API endpoints
- Update response parsing logic as needed
- Add error handling for new API features

### Styling Changes
- Modify Tailwind classes throughout components
- Update `tailwind.config.js` for global changes
- Customize Catppuccin theme in the config

## 🐛 Troubleshooting

### Common Issues

**API not working**
- Check network connection
- Verify API endpoint is accessible
- Check browser console for CORS errors

**Characters not displaying**
- Ensure hanzi-writer is properly loaded
- Check if characters are valid Chinese
- Verify theme colors are properly applied

**Theme not switching**
- Clear browser cache
- Check localStorage for theme persistence
- Verify ThemeProvider is wrapping the app

**Search not working**
- Check if search input is properly focused
- Verify API integration is working
- Ensure search mode state is managed correctly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Catppuccin** for the beautiful color palette
- **Hanzi Writer** for interactive character animations
- **Hanzii API** for word definitions and examples
- **React Community** for excellent documentation and tools

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the project documentation

---

Made with ❤️ for me first, thank you 🌸
