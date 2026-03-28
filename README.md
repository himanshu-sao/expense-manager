# Expense Manager

A comprehensive macOS desktop application for tracking expenses and managing credit cards with analytics, break-even calculations, and portfolio optimization tools.

## Features

### Expense Tracking
- Monthly expense tracking with categories
- Visual analytics and spending breakdowns
- Filter by month/year

### Credit Card Management
- Add and manage credit cards from templates (Amex, Chase, Bilt, Citi, Hilton)
- Refresh card data from GitHub Gist
- Track annual fees, credits, and benefits

### Credit Tracker
- Monitor credit usage against annual limits
- Progress bars for each credit category
- Summary dashboard

### Spend Caps Calculator
- Track category-specific spending caps
- Real-time cap utilization monitoring

### Points Projector
- Project annual points earnings
- Value calculations based on point valuations
- Category-wise spend analysis

### Credit Reset Calendar
- Visual calendar showing when credits reset
- Annual fee reminder timeline

### Card Comparison Tool
- Side-by-side card comparisons
- Feature and benefit analysis
- Value ratings

### Net Value Calculator
- Calculate net annual value per card
- Portfolio ROI tracking
- Monthly spend input for accurate projections

## Prerequisites

- Node.js 18+ 
- npm 9+
- macOS (built for Apple Silicon/arm64)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd expense-manager
```

2. Install dependencies:
```bash
npm install
```

## Development

Run the app in development mode with hot reload:

```bash
npm run dev
```

This will:
- Start the Vite dev server on http://localhost:3000
- Launch Electron with the React app
- Enable hot module replacement

## Building

### Build React App Only
```bash
npm run build:react
```

### Build for macOS (DMG)
```bash
npm run build
```

### Build Directory Only (faster)
```bash
npm run pack
```

The built app will be in `dist/mac-arm64/`.

## Running the Built App

```bash
open dist/mac-arm64/"Expense Manager.app"
```

## Card Data

Card data is fetched from a GitHub Gist and cached locally. To refresh card data:

1. Go to the "Cards" tab
2. Click "Refresh Card Data"

### Supported Cards
- American Express Platinum
- American Express Gold
- Chase Sapphire Reserve
- Chase Sapphire Preferred
- Bilt Mastercard
- Bilt Palladium
- Citi Strata Premier
- Hilton Surpass
- Hilton Honors American Express

## Point Valuations

The app uses these cent-per-point valuations:

| Program | Value (cents) |
|---------|---------------|
| Membership Rewards | 2.0¢ |
| Ultimate Rewards | 2.0¢ |
| Bilt Points | 2.2¢ |
| ThankYou Points | 1.6¢ |
| Hilton Points | 0.6¢ |
| Capital One Miles | 1.4¢ |
| Marriott Points | 0.8¢ |
| Delta Miles | 1.2¢ |
| United Miles | 1.2¢ |
| Cash Back | 1.0¢ |

## Tech Stack

- **Electron** - Desktop application framework
- **React 18** - UI library
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Recharts** - Charts and visualizations
- **electron-log** - Logging

## Project Structure

```
expense-manager/
├── src/
│   ├── main/
│   │   ├── main.js          # Electron main process
│   │   └── preload.js       # Context bridge
│   └── renderer/
│       ├── App.jsx          # Main React app
│       ├── components/      # UI components
│       ├── hooks/           # React hooks
│       └── utils/           # Utility functions
├── dist/                    # Built application
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## License

MIT
