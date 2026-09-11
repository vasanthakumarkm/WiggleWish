<p align="center">
  <img src="assets/logo.png" alt="WiggleWish Logo" width="120">
</p>

<h1 align="center">✨ WiggleWish ✨</h1>

<p align="center">
  <strong>A tiny lucky charm that lives on your Windows desktop</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Windows%2010%2F11-blue?style=flat-square" alt="Platform">
  <img src="https://img.shields.io/badge/Built%20with-Tauri%20%2B%20React-orange?style=flat-square" alt="Built with">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License">
</p>

<p align="center">
  <!-- Add demo.gif here after recording -->
  <!-- <img src="assets/demo.gif" alt="WiggleWish Demo" width="300"> -->
</p>

---

## 🎯 What is WiggleWish?

WiggleWish is a delightful desktop companion that displays a small, interactive lucky charm hanging from the top of your screen. With realistic rope physics, ritual animations, and a collection of traditional lucky charms from around the world, it adds a touch of magic to your desktop.

<p align="center">
  <!-- Add charms-preview.png here after creating it -->
  <!-- <img src="assets/charms-preview.png" alt="Available Charms" width="400"> -->
</p>

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎭 Realistic Physics
- **Verlet integration** for smooth, natural rope movement
- **12-point rope simulation** with proper tension
- Drag and release to swing with momentum
- Subtle wind effects for idle animation

</td>
<td width="50%">

### 🍀 Lucky Charms
- **9 traditional charms** from world cultures
- **Custom emoji** support - use any emoji!
- Each charm has unique ritual animations
- Cultural descriptions and meanings

</td>
</tr>
<tr>
<td width="50%">

### 🖱️ Interactive
- **Drag** the charm to swing it
- **Click** for ritual animation
- **Right-click** for charm picker
- **Drag anchor** to reposition window

</td>
<td width="50%">

### 🪟 Desktop Integration
- **Transparent window** - blends with your desktop
- **Always on top** - your charm is always visible
- **System tray** - quick access menu
- **Minimal footprint** - low CPU/memory usage

</td>
</tr>
</table>

---

## 🌍 Available Charms

| Charm | Culture | Meaning |
|:-----:|---------|---------|
| 🧿 | **Nazar** - Turkey/Middle East | Wards off the evil eye |
| 🪬 | **Hamsa** - Middle East/North Africa | Protection and blessing |
| 🍀 | **Four-Leaf Clover** - Ireland | Faith, hope, love, luck |
| 🐱 | **Maneki-neko** - Japan | Beckoning good fortune |
| 🪲 | **Scarab** - Egypt | Rebirth and protection |
| 🕉️ | **Om** - India | Inner peace, sacred sound |
| 🧧 | **Fu Character** - China | Fortune and good luck |
| 🧲 | **Horseshoe** - Western | Attracts luck, wards evil |
| ⭐ | **Lucky Star** - Universal | Wishes come true |
| ✨ | **Custom** - Personal | Your own lucky charm |

---

## 🚀 Installation

### Download Release
1. Go to [Releases](https://github.com/YOUR_USERNAME/WiggleWish/releases)
2. Download the latest `.msi` or `.exe` installer
3. Run the installer
4. Find WiggleWish in your Start Menu or System Tray

### Build from Source

**Prerequisites:**
- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://rustup.rs/) (latest stable)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/WiggleWish.git
cd WiggleWish

# Install dependencies
npm install

# Run in development mode
npm run tauri:dev

# Build for production
npm run tauri:build
```

The built installer will be in `src-tauri/target/release/bundle/`

---

## 🎮 How to Use

<table>
<tr>
<td align="center" width="25%">
<h3>🖱️ Drag</h3>
<p>Click and drag the charm to swing it around</p>
</td>
<td align="center" width="25%">
<h3>👆 Click</h3>
<p>Click the charm for a ritual animation</p>
</td>
<td align="center" width="25%">
<h3>🔄 Right-Click</h3>
<p>Open the charm picker to change charms</p>
</td>
<td align="center" width="25%">
<h3>↔️ Move</h3>
<p>Drag near the top to reposition the window</p>
</td>
</tr>
</table>

---

## 🛠️ Tech Stack

- **[Tauri](https://tauri.app/)** - Rust-based desktop framework
- **[React](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Fast build tool
- **Verlet Integration** - Physics simulation

---

## 📁 Project Structure

```
WiggleWish/
├── src/                    # React frontend
│   ├── components/         # UI components
│   │   ├── Charm.tsx       # Charm rendering & animations
│   │   ├── Rope.tsx        # Rope SVG rendering
│   │   └── CharmPicker.tsx # Charm selection UI
│   ├── hooks/              # Custom React hooks
│   │   ├── useRope.ts      # Physics simulation
│   │   ├── useSettings.ts  # Persistence
│   │   └── useSound.ts     # Audio playback
│   ├── data/
│   │   └── charms.ts       # Charm definitions
│   └── App.tsx             # Main application
├── src-tauri/              # Rust backend
│   ├── src/
│   │   └── lib.rs          # Window management & tray
│   └── tauri.conf.json     # Tauri configuration
├── public/
│   └── sounds/             # Audio assets
└── package.json
```

---

## 🎨 Customization

### Adding New Charms

Edit `src/data/charms.ts`:

```typescript
{
  id: 'your-charm',
  name: 'Your Charm',
  emoji: '🎁',
  culture: 'Your Culture',
  description: 'What it means',
  ritualAnimation: 'bounce', // spin, bounce, pulse, shake, glow
  soundFile: 'your-sound.mp3', // optional
}
```

### Adding Sounds

Place `.mp3` files in `public/sounds/` and reference them in charm definitions.

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing`)
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

<p align="center">
  <strong>Made with ❤️ and a little bit of luck</strong>
</p>

<p align="center">
  <sub>If this project brought you good fortune, consider giving it a ⭐</sub>
</p>
