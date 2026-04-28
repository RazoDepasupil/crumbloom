# 🍪 Crumb & Bloom — Cookie Shop

A modern React + TypeScript storefront for an artisan cookie business, built with Vite and CSS Modules.

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## 📁 Project Structure

```
cookie-shop/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── src/
    ├── main.tsx              # App entry point
    ├── App.tsx               # Root component
    ├── types/
    │   └── index.ts          # TypeScript interfaces
    ├── data/
    │   └── cookies.ts        # Cookie catalogue data
    ├── context/
    │   └── CartContext.tsx   # Cart state (useReducer + Context)
    ├── hooks/
    │   ├── useToast.ts       # Toast notification hook
    │   └── useScrolled.ts    # Scroll-detection hook
    ├── styles/
    │   └── globals.css       # CSS variables & animations
    ├── components/
    │   ├── Navbar/
    │   │   ├── Navbar.tsx
    │   │   └── Navbar.module.css
    │   ├── HeroSection/
    │   │   ├── HeroSection.tsx
    │   │   └── HeroSection.module.css
    │   ├── CookieCard/
    │   │   ├── CookieCard.tsx
    │   │   └── CookieCard.module.css
    │   ├── CartDrawer/
    │   │   ├── CartDrawer.tsx
    │   │   └── CartDrawer.module.css
    │   └── Toast/
    │       ├── Toast.tsx
    │       └── Toast.module.css
    └── pages/
        ├── Home.tsx
        └── Home.module.css
```

## 🎨 Tech Stack

- **React 18** + **TypeScript**
- **Vite** — fast dev server & bundler
- **CSS Modules** — scoped, maintainable styles
- **useReducer + Context API** — cart state management
- **Custom Hooks** — `useToast`, `useScrolled`

## ✨ Features

- Animated hero with floating blobs
- Cookie menu grid with hover effects
- Cart drawer with quantity controls
- Toast notifications on order
- Scroll-aware sticky navbar
- Fully typed with TypeScript
- Responsive design
