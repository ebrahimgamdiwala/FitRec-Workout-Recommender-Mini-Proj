# FitRec - AI-Powered Workout Recommender 🏋️‍♀️

A beautiful, modern workout recommendation system with an interactive 3D ballpit background, glassmorphism design, and smooth typewriter effects.

## ✨ Features

- **Interactive 3D Background**: Physics-based ballpit animation using Three.js
- **Glassmorphism Design**: Modern, translucent UI components with blur effects
- **Capsule Navigation**: Floating navbar with smooth transitions
- **Typewriter Effect**: Dynamic text animation on the hero section
- **Personalized Recommendations**: AI-powered workout suggestions based on user input
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic dark mode detection and styling

## 🎨 Design Elements

- **Gradient Colors**: Purple and pink gradient accents throughout
- **Glass Cards**: Frosted glass effect on all cards and components
- **Smooth Animations**: Hover effects, transitions, and scale animations
- **Custom Scrollbar**: Styled scrollbar matching the color scheme

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Navigate to the frontend directory:
```bash
cd "e:\\RS Mini Project\\frontend\\workout-recommender"
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🏗️ Project Structure

```
frontend/workout-recommender/
├── app/
│   ├── layout.js          # Root layout with fonts
│   ├── page.js            # Main page with all sections
│   └── globals.css        # Global styles
├── components/
│   ├── Ballpit.jsx        # 3D background animation
│   ├── Navbar.jsx         # Capsule navigation bar
│   ├── HeroSection.jsx    # Hero with typewriter effect
│   ├── FeaturesSection.jsx # Features showcase
│   ├── RecommendSection.jsx # Workout form
│   ├── Footer.jsx         # Footer with links
│   ├── GlassCard.jsx      # Reusable glass card component
│   └── TypewriterText.jsx # Typewriter animation
└── public/
    └── herosection-workout.jpg # Hero image
```

## 🎯 Sections

1. **Hero Section**: Welcome message with typewriter effect and hero image
2. **Features Section**: Highlights key features with icon cards
3. **Recommend Section**: Interactive form to get personalized workout plans
4. **Footer**: Contact information and quick links

## 🛠️ Built With

- **Next.js 16.0** - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **Three.js** - 3D graphics
- **Lucide React** - Icons

## 🎨 Customization

### Colors

The main gradient colors can be customized in the Ballpit component:
```javascript
colors={[0x9333ea, 0xec4899, 0x3b82f6]} // Purple, Pink, Blue
```

### Typewriter Texts

Edit the texts in `HeroSection.jsx`:
```javascript
const typewriterTexts = [
  'Your Perfect Workout',
  'Personalized Training',
  // Add more...
];
```

## 📱 Responsive Breakpoints

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 🌙 Dark Mode

The app automatically detects system preferences and applies the appropriate theme. All components are styled for both light and dark modes.

## 📄 License

This project is part of a mini project for workout recommendation system.

## 🤝 Contributing

Feel free to fork, modify, and use this project for your own purposes!

---

Built with ❤️ for fitness enthusiasts
