# TSH ESG Management Platform Mockup

Welcome to the **TSH ESG Management Platform Mockup**, an enterprise-grade Environmental, Social, and Governance (ESG) reporting system designed for TSH Group. The platform is engineered to streamline carbon footprint accounting, utility intensity tracking, audit trials, and compliance workflows across a diverse global portfolio of commercial, hospitality, and retail properties.

This project is built using a **Next.js (Pages Router)** framework combined with a dynamic, role-based Tailwind design system to offer an immersive, high-fidelity interactive simulation.

---

## 🌟 Key Features & Architecture

### 1. Dynamic Role-Based Accent System
The application models three distinct operations personas, each with dedicated navigation, content widgets, action capabilities, and matching brand styling. Switching roles instantly morphs the interface theme by dynamically updating root-level CSS variables:
*   **Building Manager (BM)** — 🔵 Corporate Blue accents (`#1e40af`): Focused on data entry, utility consumption logging, and compliance status tracking.
*   **Reporting Manager (RM)** — 🟣 Compliance Purple accents (`#4f378a`): Focused on data validation, RAG completion compliance, nudges, and escalations.
*   **Sustainability Manager (SM)** — 🟢 Sustainability Emerald Green accents (`#047857`): Focused on global portfolio views, Scope 1/2/3 metrics, utility intensity charts, and audit trail administration.

### 2. High-Fidelity 8-Tab Submission Wizard (BM)
The data entry portal is isolated into a dedicated React sub-component to eliminate cascading state re-renders. It features segment-specific data logic and real-time validation:
*   **General**: Select reporting period, operational control flags, and attach general remarks.
*   **Electricity**: Supports grid and landlord-provided inputs. Selects specific sub-meter profiles (e.g., *18 Robinson* `SG-18ROB`). Dynamically computes location-based **Scope 2 emissions** (in tCO2e) based on regional grid emission factors (Singapore EMA, Australia NEM, Indonesia PLN, China national grid, etc.).
*   **Water**: Logs potable, cooling tower, and irrigation consumption. Conditional fields activate **NEWater** usage for Singapore (`SG-18ROB`) and Australia (`AU-ROLP`). Displays a critical warning badge for guest-meter logs in Perth Hospitality (`AU-ROLP`), and enables industrial process water tracking for Malaysia (`MY-HYPAK`).
*   **Fuel & Gas**: Logs Diesel (liters) and Natural Gas (m³) with automated energy conversion to kWh. Hides gas fields based on asset registry, and activates **Town Gas** inputs specifically for Fraser Residence Promenade (`SG-FRRP`).
*   **Waste**: Logs general solid waste. Activates conditional food-waste fields for hospitality segments, and triggers a *Containers for Change* notification for Western Australia properties (`AU-ROLP`).
*   **Recycling**: Logs paper reams with real-time weight conversions (reams to kg) alongside dedicated inputs for plastics, metals, glass, and organic compost.
*   **Documents**: Interactive drag-and-drop attachment vault that lists file names, sizes, upload dates, and supports active deletions.
*   **Review & Submit**: Full parameter summary with checkbox confirmation and submit locking mechanism.

### 3. Compliance Oversight & Escalations (RM)
*   **RAG Stack & KPIs**: Live compliance tracking with stacked bars showcasing properties that are locked, pending, or overdue.
*   **Nudges & Notifications**: Send nudges to late properties (like batam, etc.) with animated, interactive toast feedback.
*   **Escalation Log**: Live audit-like log showing formal escalation escalations for highly delinquent entries.

### 4. Portfolio Analytics & Audit Trail (SM)
*   **Utility Intensities Chart**: High-fidelity custom dual-bar chart comparing electricity (kWh) and water (m³) intensities over the year (Jan–May), utilizing an active, responsive flexbox layout.
*   **Admin Override (Unlock)**: Allows administrators to unlock finalized submissions, reverting them to drafts to allow edits.
*   **Amendment Log**: Visual compliance audit trail displaying past value modifications. Deleted or modified values are rendered with a strict `line-through` and rose-accent highlight to denote audit history.

---

## 📂 Project Structure

```bash
├── pages/
│   ├── _app.jsx          # React app shell & global provider setup
│   ├── _document.jsx     # HTML layout, CDN styles, and typography configuration
│   └── index.jsx         # Next.js homepage, rendering the main App component
├── public/
│   ├── favicon.svg       # Site logo / browser favicon
│   └── icons.svg         # SVG icon assets
├── src/
│   ├── App.jsx           # Core application code (data models, state, UI components)
│   ├── App.css           # Modern CSS variable themes and global animation styling
│   ├── index.css         # Tailwind directives and base style definitions
│   └── assets/           # React component assets (Vite / React icons)
├── DESIGN.md             # Visual design tokens (colors, shapes, layouts, typography)
├── package.json          # Node scripts and Next.js dependencies
└── README.md             # Documentation (this file)
```

---

## 🛠️ Tech Stack & Styling

1.  **Core Framework**: Next.js (Pages Router) + React 19.
2.  **Styling**: Vanilla Tailwind CSS loaded via modern CDN. Layout parameters match the specifications defined in [DESIGN.md](file:///C:/Users/irt/OneDrive%20-%20ICON%20Resources/Desktop/TSH/Mockup/DESIGN.md):
    *   **Typography**: *Nunito Sans* for core interfaces; *JetBrains Mono* for exact, tabular numeric outputs.
    *   **Shapes**: Tighter `rounded-[6px]` corners for inputs and buttons; `rounded-[10px]` corners for container cards; fully rounded pills for status tags.
    *   **Colors**: Semantic indicator palettes paired with primary color overrides using CSS custom variables.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18.x or higher)
*   npm (v9.x or higher)

### Setup & Installation
Clone the repository, navigate to the folder, and install the required dependencies:
```bash
# Install dependencies
npm install
```

### Running the Development Server
Launch the Next.js development server locally:
```bash
# Run server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the mockup.

### Building for Production
Build the optimized application bundle:
```bash
# Run next build
npm run build
```
Start the production server:
```bash
# Start production server
npm run start
```

---

## 📊 Verification & Audits
*   **Lint Checks**: Run `npm run lint` to verify that there are no syntax, import, or React Hook compilation warnings.
*   **Interactive Testing**: Use the **Role Switcher** widget at the bottom-left of the sidebar to verify how primary/secondary accents, forms, charts, and table rows seamlessly morph across Building, Reporting, and Sustainability manager configurations.
