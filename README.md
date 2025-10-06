# Sister Moon - Sustainable Fashion Website

A modern, responsive e-commerce website for Sister Moon, a sustainable clothing brand. Built with SvelteKit and featuring a beautiful, user-friendly interface focused on ethical fashion.

## 🌟 Features

- **Responsive Design**: Mobile-first approach with beautiful layouts for all devices
- **Modern UI/UX**: Clean, professional design with smooth animations and interactions
- **Product Showcase**: Featured products with hover effects and quick actions
- **Shopping Experience**: Product filtering, sorting, and grid/list view options
- **Brand Story**: Comprehensive about page with company values and team information
- **Contact System**: Contact form with FAQ section and company information
- **Newsletter Signup**: Email subscription with success feedback
- **Navigation**: Sticky navigation with mobile-responsive menu
- **Sustainability Focus**: Content and design emphasizing eco-friendly practices

## 🛠️ Tech Stack

- **Framework**: SvelteKit 2.0
- **Language**: TypeScript
- **Styling**: CSS with custom properties and utility classes
- **Icons**: Lucide Svelte
- **Build Tool**: Vite
- **Development**: Hot module replacement and TypeScript checking

## 📁 Project Structure

```
sisterMoon/
├── src/
│   ├── lib/
│   │   ├── components/          # Reusable components
│   │   │   ├── Navigation.svelte
│   │   │   ├── Hero.svelte
│   │   │   ├── FeaturedProducts.svelte
│   │   │   ├── AboutSection.svelte
│   │   │   ├── Newsletter.svelte
│   │   │   └── Footer.svelte
│   │   └── assets/             # Static assets
│   ├── routes/                 # Page routes
│   │   ├── +layout.svelte      # Root layout
│   │   ├── +page.svelte        # Homepage
│   │   ├── shop/+page.svelte   # Shop page
│   │   ├── about/+page.svelte  # About page
│   │   └── contact/+page.svelte # Contact page
│   └── app.css                 # Global styles
├── static/                     # Static files
└── package.json               # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sisterMoon
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Type-check the project

## 🎨 Design System

### Color Palette
- **Primary**: `#2c3e50` (Dark Blue)
- **Secondary**: `#e74c3c` (Red)
- **Accent**: `#f39c12` (Orange)
- **Text**: `#2c3e50` (Dark Blue)
- **Light Text**: `#7f8c8d` (Gray)
- **Background**: `#ffffff` (White)
- **Light Background**: `#f8f9fa` (Light Gray)

### Typography
- **Font Family**: Inter, system fonts
- **Headings**: Bold weights with proper hierarchy
- **Body Text**: Regular weight with good line height

### Components
- **Buttons**: Primary and secondary variants with hover effects
- **Cards**: Product cards with shadow and hover animations
- **Forms**: Clean input styling with focus states
- **Navigation**: Sticky header with mobile menu

## 📱 Responsive Design

The website is fully responsive with breakpoints at:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔧 Customization

### Adding New Pages
1. Create a new folder in `src/routes/`
2. Add a `+page.svelte` file
3. Import and use the Navigation and Footer components

### Styling
- Global styles are in `src/app.css`
- Component-specific styles use Svelte's scoped CSS
- CSS custom properties are defined in `:root`

### Content
- Product data is currently mocked in components
- Replace with real data from your backend
- Update images, text, and contact information

## 🌍 Sustainability Features

The website emphasizes sustainable fashion through:
- Content focused on ethical production
- Information about sustainable materials
- Transparency about supply chain
- Educational content about fashion impact

## 📞 Support

For questions or support, please contact:
- Email: hello@sistermoon.com
- Phone: +1 (555) 123-4567

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

**Sister Moon** - Sustainable Fashion for the Modern Woman
# SisterMoon
