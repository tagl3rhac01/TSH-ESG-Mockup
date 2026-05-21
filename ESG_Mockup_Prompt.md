# Prompt: Build ESG Platform Mockup — Full Interactive React Application

You are building a fully interactive, client-presentation-ready mockup of an enterprise ESG (Environmental, Social, Governance) data collection and management platform. This is a Microsoft Model-Driven Application modernization project, but the mockup is built as a React single-page application that demonstrates the complete user experience with realistic dummy data.

---

## CONTEXT

The client is TSH Group, a real estate and hospitality conglomerate with properties across Singapore, Australia, China, Indonesia, and Malaysia. They currently have a basic ESG data entry app where Building Managers (BMs) submit monthly electricity, water, gas, diesel, waste, and recycling data. The app is being modernized into an enterprise-grade ESG platform.

This mockup must convince senior Property Management leadership that the modernized platform meets their requirements:
1. Single source of truth for ESG data across the full portfolio
2. Full Scope 1, 2, and 3 emissions coverage in the data structure
3. Clearly defined ESG KPIs at both asset and portfolio level
4. Reporting-ready outputs aligned to FY2026 disclosure requirements
5. Automated portfolio consolidation across Singapore, Batam, Australia, China, and Malaysia

---

## DESIGN DIRECTION

**Style: Model-Driven App inspired, but premium and modern.**

- Clean light enterprise theme — white cards on a soft slate-grey (#f1f5f9) background
- NOT dark mode. NOT a startup aesthetic. This is enterprise software for property managers.
- Professional, calm, high-information-density without clutter
- Think: Dynamics 365 shell meets a beautifully designed SaaS dashboard

**Typography:**
- Display/heading font: Nunito Sans (weights 600, 700, 800)
- Monospace for data values, codes, percentages: JetBrains Mono
- No generic fonts (no Inter, no Arial, no system fonts)

**Color system — role-based accents:**
- Building Manager: Blue (#1e40af)
- Reporting Manager: Purple (#7c3aed)
- Sustainability Manager: Green (#047857)
- Status colors: Locked = green (#059669), Submitted = amber (#d97706), Draft = grey (#6b7280), Overdue = red (#dc2626)
- Status badges: pill-shaped with dot indicator + light tinted background

**Layout:**
- Fixed sidebar (256px) on left with logo, role switcher, navigation, user info
- Sticky header bar with page title, reporting period, notification button, refresh button
- Main content area with cards, tables, KPI tiles
- All content in white rounded cards (border-radius: 10px, 1px solid #e5e7eb)

---

## APPLICATION STRUCTURE

### Sidebar
- Logo area at top: "ESG Platform" title + "TSH Group" subtitle + role icon (building for BM, chart for RM, globe for SM)
- **Role switcher**: Three small toggle buttons (BM / RM / SM) in a segmented control. Active button takes the role's accent color. Switching roles changes the entire navigation and content area.
- Navigation: role-specific items (defined below) with emoji icons, active state has left border accent + tinted background
- User info at bottom: avatar initials circle + name + role label

### Sticky Header
- Page title (large, bold)
- "May 2026 · Reporting Period" subtitle
- Notifications button + Refresh button on right

---

## ROLE 1: BUILDING MANAGER (BM)

### Navigation Items:
1. 📋 My Submissions
2. ✏️ New Submission
3. 🕐 Submission History

### Screen 1: My Submissions (Dashboard)
**KPI cards row** (4 cards, flex layout):
- "Submitted This Period": value = count of submitted + locked out of 10
- "Draft / Pending": count of draft submissions
- "Overdue": count of overdue submissions (red if > 0)
- "On-Time Rate": percentage with "+X%" trend badge

**Submissions table** in a white card:
- Header row with "My Submissions — May 2026" title + "+ New Submission" button (blue)
- Table columns: Property (name + code + segment subtitle), Period, Status (badge), Electricity (kWh, monospace), Water (m³, monospace), Submitted On
- Show 10 rows (one per property)
- Rows are clickable — clicking opens the submission form

### Screen 2: New Submission (8-Tab Form)
This is the most important screen. It must demonstrate the complete modernized submission experience.

**Property selector** (top card):
- Text input with placeholder "🔍 Search by property name or code..."
- As user types, a dropdown appears filtering the 10 properties by name or code
- Each dropdown item shows: property name (bold), code + segment (grey), country (right-aligned)
- After selection, shows a blue pill with selected property info
- This replaces the current painful dropdown

**Business Process Flow bar** (horizontal tab strip):
- 8 tabs with emoji icons: 📋 General, ⚡ Electricity, 💧 Water, ⛽ Fuel, 🗑️ Waste, ♻️ Recycling, 📎 Documents, ✅ Review
- Active tab: blue bottom border + blue tinted background
- Completed tabs: green checkmark icon + green tinted background
- Previous / Next buttons at bottom of form content

**Tab 1 — General Information:**
- Property (disabled, auto-filled from picker)
- Reporting Period (disabled, "May 2026")
- Building Manager (disabled, "John Tan")
- Additional Comments (textarea with placeholder)
- Info banner at top: "Complete all tabs before submitting. No field should be left blank — enter 0 if no data available."

**Tab 2 — Electricity:**
- Landlord Electricity Consumption: input field + "kWh" unit label (required)
- Tenant Electricity Consumption: input + "kWh" (conditionally required — see property config)
- Meter Reading Start / End: two fields side by side
- Bill Amount: input + "SGD" unit
- Green info box: "Scope 2 emission factor will be resolved automatically based on country grid factor."

**Tab 3 — Water:**
- Domestic Water (m³) — always required
- Irrigation Water (m³) — conditional per property
- Cooling Tower Water (m³) — conditional per property
- Process Water (m³) — only for Hypak (Manufacture)
- NEWater (m³) — only for 18 Robinson, with note "NEWater consumption — 18 Robinson only"
- For ROLP: yellow warning banner "ROLP water consumption should be recorded separately under landlord consumption. Exclude tenant water."

**Tab 4 — Fuel (Natural Gas / Diesel):**
- If property uses natural gas (Australia, China, FRRP):
  - Natural Gas input (m³) with live conversion display: "1 m³ = 10.63 kWh → **15,094.60 kWh**"
  - For FRRP only: Tenant Town Gas (kWh) field with note "FRRP tenant town gas — categorised under Scope 3 upstream leased assets"
- If property does NOT use natural gas: grey "not applicable" placeholder
- Diesel input (litres) with conversion: "1 litre = 38 MJ = 10.63 kWh → **2,551.20 kWh**"

**Tab 5 — Waste:**
- General Waste (kg) — always required
- Food Waste (kg) — hospitality only, with note
- Plastic Waste (kg)
- Glass Waste (kg)
- Paper Waste (kg)
- Containers for Change (kg) — ROLP only, with note "Containers for Change scheme (mixed glass + plastic)"
- Conversion reference box: "1 tonne = 1 m³ (use metric tonne, not imperial US ton)"
- For ROLP: yellow disclaimer "Plastic waste should be classified under recycled plastic. Food waste should be classified under recycling — compost processed."

**Tab 6 — Recycling:**
- Paper (reams) with conversion: "1 ream = 500 sheets ≈ 2.5 kg → **120.00 kg**"
- Recycling Plastic (kg)
- Recycling Metal (kg)
- Recycling Glass (kg)
- Compost Processed (kg) — hospitality only

**Tab 7 — Documents:**
- Red warning banner: "At least one supporting document must be uploaded before you can submit."
- Drag-and-drop upload zone (dashed border, centered icon + text)
- Accepted formats: PDF, JPG, PNG (max 10MB)
- Show 2 pre-uploaded dummy files with filename, size, upload date, and "Remove" button
- Files shown in green-tinted rows

**Tab 8 — Review and Submit:**
- Full summary organized by category (Electricity, Water, Waste, Recycling, Documents)
- Each category is a card with a blue header bar and key-value pairs inside
- Confirmation checkbox: "I confirm that all data entered is accurate for May 2026"
- Full-width "🔒 Submit & Lock" button (blue, bold)

### Screen 3: Submission History
- Same table format as My Submissions but showing last 5 months across assigned properties

---

## ROLE 2: REPORTING MANAGER (RM)

### Navigation Items:
1. 📊 Compliance Dashboard
2. ⚠️ Outstanding Submissions
3. 📨 Escalation Log

### Screen 1: Compliance Dashboard
**KPI cards** (4):
- Portfolio Completion %
- Properties Locked (out of total)
- Outstanding
- Overdue

**Two side-by-side cards:**
- Left: "Submission Status — May 2026" — RAG stacked bar chart (Green/Amber/Red horizontal bar showing counts) + legend below
- Right: "On-Time Rate — Last 5 Months" — mini bar chart with 5 bars (Jan-May)

**Overdue properties table:**
- Columns: Property, Segment, Country, Status (badge), Days Overdue (red if >5), Action ("Escalate" button in purple)

### Screen 2: Outstanding Submissions
- Table: Property, Period, Status, BM, Days Outstanding

### Screen 3: Escalation Log
- Table: Date, Property, Type (Deadline Escalation / Mid-Period Nudge / Period Open Reminder), Sent To, Status (green "Sent" badge)
- Show 4 dummy escalation entries

---

## ROLE 3: SUSTAINABILITY MANAGER (SM)

### Navigation Items:
1. 🌍 Portfolio Overview
2. 📋 All Submissions
3. ⚙️ Master Data
4. 📝 Amendment Log

### Screen 1: Portfolio Overview
**KPI cards** (4):
- Portfolio Completion %
- Total Scope 1 YTD (tCO2e) with "-3.2%" trend
- Total Scope 2 YTD (tCO2e) with "-1.8%" trend
- Total Scope 3 YTD (tCO2e) with "+2.1%" trend

**Two-column layout:**
- Left (2fr): Portfolio RAG chart + segment-level completion bar chart (REI / Hospitality / Manufacture)
- Right (1fr): "Properties with Anomalies" — 3 warning cards (amber background) showing properties that varied >35% from 3-month average, with property name, metric, and variance note

**Two side-by-side trend charts:**
- Electricity trend (kWh) — 5-month bar chart
- Water trend (m³) — 5-month bar chart

### Screen 2: All Submissions
- Full portfolio table with all 10 properties for current period
- Segment filter buttons at top (All / REI / Hospitality / Manufacture)
- Table columns: Property, Segment, Country, Status (badge), Electricity, Water, Waste, Actions
- Locked rows show an "Unlock" button (amber)

### Screen 3: Master Data
**Two-column layout:**
- Left card: Properties list (10 properties with name, code, segment, country)
- Right card:
  - Emission Factors table: 6 rows with category, value (green monospace), unit, source
    - Electricity SG: 0.4085 kgCO2e/kWh (EMA 2025)
    - Electricity AU: 0.6800 kgCO2e/kWh (DEFRA 2025)
    - Electricity CN: 0.5810 kgCO2e/kWh (IEA 2024)
    - Natural Gas: 0.1840 kgCO2e/kWh (DEFRA 2025)
    - Diesel: 2.6880 kgCO2e/litre (DEFRA 2025)
    - Waste (General): 0.5870 kgCO2e/kg (DEFRA 2025)
  - Baseline Years: REI = FY2021, Hospitality = FY2019, Manufacture = FY2021

### Screen 4: Amendment Log
- Table: Date (monospace), Property (bold), Period, Field, Original Value (red, strikethrough), New Value (green, bold), Amended By, Approved By
- Show 3 dummy amendment entries:
  - 18 Robinson / Apr 2026 / Tenant kWh / 28,400 → 31,200 / John Tan / Abigail
  - ROLP / Apr 2026 / Food Waste / 950 → 1,180 / Sarah Lee / Abigail
  - Habitat Shanghai / Mar 2026 / Natural Gas / 1,680 → 1,420 / Wei Chen / Abigail

---

## PROPERTY DATA (Use these exact values)

| ID | Code | Name | Segment | Country | GFA (m²) |
|---|---|---|---|---|---|
| 1 | SG-18ROB | 18 Robinson | REI | Singapore | 27,540 |
| 2 | SG-DUNEARN | Dunearn Village | REI | Singapore | 8,120 |
| 3 | SG-OXLEY | The Oxley | REI | Singapore | 12,400 |
| 4 | AU-ROLP | ROLP (Perth Hospitality) | Hospitality | Australia | 15,200 |
| 5 | AU-GHM | Grand Hyatt Melbourne | Hospitality | Australia | 42,000 |
| 6 | SG-FRRP | Fraser Residence River Promenade | Hospitality | Singapore | 19,600 |
| 7 | CN-HABITAT | Habitat Shanghai | REI | China | 31,000 |
| 8 | ID-BATAM | PT Batam Opus Bay | REI | Indonesia | 22,800 |
| 9 | AU-PERTH | Perth Commercial Centre | REI | Australia | 18,900 |
| 10 | MY-HYPAK | Hypak Sdn Bhd | Manufacture | Malaysia | 9,400 |

## PROPERTY-SPECIFIC CONFIGURATION FLAGS

These determine which fields are VISIBLE on the form for each property:

| Property | Tenant Elec | Natural Gas | Diesel | NEWater | Food Waste | C4C (Containers for Change) | Town Gas | Process Water |
|---|---|---|---|---|---|---|---|---|
| 18 Robinson | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Dunearn Village | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| The Oxley | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| ROLP | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ | ❌ | ❌ |
| GHM Melbourne | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ |
| FRRP | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| Habitat Shanghai | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| PT Batam | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Perth Commercial | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Hypak | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |

When a BM selects a property, the form should HIDE fields that have ❌ for that property and SHOW fields that have ✅. Include property-specific disclaimer banners where applicable.

---

## DUMMY DATA GENERATION

Generate realistic randomized submission data:
- 5 months: Jan 2026 through May 2026
- 10 properties × 5 months = 50 submission records
- Older months (Jan–Mar): status = "locked"
- April: mix of "submitted" and "draft"
- May (current): mix of "draft" and "overdue"
- Electricity: random between 40,000 and 120,000 kWh
- Water: random between 800 and 3,000 m³
- Gas: random between 500 and 2,000 m³ (only for properties that use gas; 0 otherwise)
- Waste: random between 2,000 and 8,000 kg
- Days overdue: random 1-8 for overdue submissions

---

## COMPONENTS TO BUILD

### StatusBadge
- Pill shape with dot indicator + status text
- Color-coded: locked=green, submitted=amber, draft=grey, overdue=red
- Light tinted background matching the status color

### KpiCard
- White card, rounded corners, subtle border
- Label (uppercase monospace, grey), large value (display font, colored), unit (small grey), optional trend indicator

### MiniBar (simple bar chart)
- Vertical bars in a flex row, height proportional to value
- Label under each bar (month abbreviation)
- Current month in accent color, others in light tint

### RagChart
- Horizontal stacked bar (Green/Amber/Red) showing submission counts
- Legend row below with colored dots + labels + counts

### FormField
- Label with optional required asterisk (red)
- Input field with optional unit suffix and info note below
- Disabled state for auto-filled fields (grey background)

---

## CRITICAL REQUIREMENTS

1. **Property-specific form behavior is the most important demo feature.** When a BM selects different properties, the form tabs must show/hide fields based on that property's configuration. For example:
   - Select "18 Robinson" → NEWater field appears on Water tab; Natural Gas tab shows "not applicable"
   - Select "ROLP" → C4C field appears on Waste tab; food waste appears; disclaimer banners show
   - Select "FRRP" → Town gas field appears on Fuel tab
   - Select "Hypak" → Process water appears; diesel appears; no natural gas

2. **Inline conversion displays must be visible.** When a value is shown in the fuel or recycling tabs, the converted value must be displayed below it in a light info box with the formula shown.

3. **The searchable property picker must work.** Type a few characters → dropdown filters in real time → click to select → property info displays in a pill.

4. **All three roles must be switchable** without page reload. The sidebar navigation, header, accent colors, and content all change based on role.

5. **Dummy data must look realistic.** Use actual TSH property names, real emission factor values, real baseline years. Values should be in credible ranges for commercial real estate and hospitality buildings.

6. **Tables must have proper hover states, alignment (text left, numbers right with monospace), and be scrollable.**

7. **The Review & Submit tab must show a complete summary of all entered data** grouped by category, with a confirmation checkbox and a prominent Submit & Lock button.

8. **The Amendment Log must show strikethrough on original values (red) and bold on new values (green)** to make the audit trail visually clear.

---

## OUTPUT

Build this as a single React component (default export) suitable for rendering as an artifact. Use inline styles (no CSS modules or external stylesheets except Google Fonts imports). Import only from "react". Do not use any external component libraries. Build all UI components from scratch.

The entire application should be contained in one file with all components, data, and logic self-contained.
