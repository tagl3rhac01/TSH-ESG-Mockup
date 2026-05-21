---
name: TSH ESG Enterprise System
colors:
  surface: '#fdf7ff'
  surface-dim: '#ded8e0'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2fa'
  surface-container: '#f2ecf4'
  surface-container-high: '#ece6ee'
  surface-container-highest: '#e6e0e9'
  on-surface: '#1d1b20'
  on-surface-variant: '#494551'
  inverse-surface: '#322f35'
  inverse-on-surface: '#f5eff7'
  outline: '#7a7582'
  outline-variant: '#cbc4d2'
  surface-tint: '#6750a4'
  primary: '#4f378a'
  on-primary: '#ffffff'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#cfbcff'
  secondary: '#63597c'
  on-secondary: '#ffffff'
  secondary-container: '#e1d4fd'
  on-secondary-container: '#645a7d'
  tertiary: '#765b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#fdf7ff'
  on-background: '#1d1b20'
  surface-variant: '#e6e0e9'
typography:
  display-lg:
    fontFamily: Nunito Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Nunito Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-sm:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Nunito Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  data-table:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  label-caps:
    fontFamily: Nunito Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  card-gap: 16px
  element-tight: 8px
  grid-columns: '12'
  max-width: 1600px
---

## Brand & Style
The design system is engineered for high-stakes Environmental, Social, and Governance (ESG) reporting within the TSH Group. It adopts a **Corporate / Modern** aesthetic, specifically a **Model-Driven App** framework that prioritizes information density, data integrity, and multi-persona workflows.

The visual narrative is one of "Technical Precision meeting Institutional Trust." By utilizing a soft slate-grey foundation, the UI reduces eye strain for power users while allowing color-coded role accents and status indicators to provide immediate cognitive orientation. The atmosphere is professional, organized, and authoritative.

## Colors
The palette is functional and semantic. The background uses a soft slate-grey to create a "canvas" effect, making the white data cards pop. 

### Role-Based Accents
Navigation elements, active states, and primary action buttons change based on the logged-in user profile:
- **Building Manager (BM):** Deep Blue for operational stability.
- **Reporting Manager (RM):** Sophisticated Purple for analytical oversight.
- **Sustainability Manager (SM):** Forest Green for environmental stewardship.

### Status Indicators
Critical for ESG workflows, these colors are used in badges and progress bars to denote data lifecycle stages.

## Typography
The system uses **Nunito Sans** for the majority of the interface to maintain a professional yet accessible feel. Bold weights (700, 800) are reserved for page headers and metric callouts.

**JetBrains Mono** is utilized strictly for data values, numerical inputs, and table cells. This monospaced choice ensures that columns of numbers align perfectly, aiding in the rapid audit of carbon footprints and energy consumption figures.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid** model. Navigation is a fixed left-rail (collapsed or expanded), while the content area uses a 12-column fluid grid with a maximum width of 1600px to prevent excessive line lengths on ultra-wide monitors.

Spacing is tight (4px base unit) to support high-information density required for enterprise dashboards. Content is grouped into logical modules using cards, with a standard 16px gutter between them.

## Elevation & Depth
This design system uses **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows. 

- **Level 0 (Canvas):** Soft slate-grey (#f1f5f9).
- **Level 1 (Cards):** White background with a 1px solid border (#e5e7eb). No shadow is used in the default state to maintain a clean, "printed" feel.
- **Level 2 (Hover/Active):** A very subtle 4px blur shadow with 5% opacity to indicate interactivity on clickable cards.
- **Modals:** Centered, white, with a 20% opacity black backdrop blur to focus the user on critical data entry.

## Shapes
The shape language is structured and professional.
- **Cards:** Fixed at 10px corner radius to soften the enterprise environment without appearing "playful."
- **Buttons/Inputs:** Use a tighter 6px radius for a more precise, tool-like appearance.
- **Status Badges:** Specifically pill-shaped (fully rounded) to contrast against the rectangular grid of the data tables.

## Components

### Status Badges
Pill-shaped containers with a 20% opacity background of their semantic color. They must include a 6px solid "dot indicator" on the left side of the label for instant color-code recognition.

### Data Cards
The primary container. White background, 10px radius, 1px grey border. Header area should include a subtle bottom divider if the card contains a complex data table.

### Input Fields
Strict, rectangular fields with 6px rounding. Use `JetBrains Mono` for value entry. The focus state border color must match the user's **Role-Based Accent**.

### Buttons
- **Primary:** Solid fill of the Role-Based Accent color.
- **Secondary:** Outline in the Role-Based Accent color.
- **Ghost:** No border, text-only for low-priority actions.

### Lists & Tables
High-density rows (32px or 40px height). Zebra-striping is encouraged for tables exceeding 10 rows. Column headers should use the `label-caps` typography style.