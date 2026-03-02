# UI/UX Design System Document

**Project Name:** EV Charge Planner  
**Design Language:** Tech-Sleek (Dark Mode / Precision Utility)  

> **Core Philosophy:** The interface should feel like a high-end, in-car telemetry dashboard. It must prioritize data legibility, high contrast for nighttime use, and tactile, glow-based micro-interactions to indicate active states.

---

## 1. Color Palette

The foundation relies on deep, cool grays to maintain depth, while using a vibrant electric cyan sparingly to draw the eye to actions and critical data.

| Element Category | Tailwind Class | Hex Code | Usage Notes |
| :--- | :--- | :--- | :--- |
| **App Background** | `bg-zinc-950` | `#09090b` | Base layer. Avoid pure black. |
| **Card Backgrounds** | `bg-zinc-900/50` | `#18181b` | Use slight transparency for glassmorphism. |
| **Elevated Elements** | `bg-zinc-800` | `#27272a` | For dropdowns, active inputs, or hover states. |
| **Borders** | `border-zinc-800` | `#27272a` | Cards must have a subtle 1px border. |
| **Primary Text** | `text-white` | `#ffffff` | Main headings and active data points. |
| **Secondary Text** | `text-zinc-400` | `#a1a1aa` | Labels, units, and helper text. |
| **Disabled Text** | `text-zinc-600` | `#52525b` | Inactive states or tertiary info. |
| **Primary Accent** | `text-cyan-400` | `#22d3ee` | Action items, active states, focus rings. |
| **Accent Highlights** | `bg-cyan-500/10` | N/A | Subtle background glows and selection states. |

---

## 2. Typography Strategy

* **Primary Font (UI & Labels):** `Inter` (or equivalent clean sans-serif like Roboto or San Francisco). Use `font-medium` for labels and `font-normal` for body text.
* **Secondary Font (Data & Inputs):** `JetBrains Mono` (or equivalent monospace font). 
    * **Crucial Rule:** All numbers, times, percentages, and metrics (kWh, V, A) *must* use the monospace font. This aligns decimals perfectly, communicates technical precision, and establishes the "dashboard" aesthetic.

---

## 3. Layout & Spacing

* **Grid System:** Utilize a "Bento Box" grid system. Information should be grouped into distinct, modular cards rather than floating freely.
* **Border Radius:** Use heavily rounded corners for main structural cards (`rounded-2xl` or `rounded-3xl`) and slightly sharper corners for interior inputs (`rounded-xl` or `rounded-lg`).
* **Spacing:** Use generous padding (`p-6` or `p-8`) inside cards. Maintain a consistent gap (e.g., `gap-6` or `gap-8`) between structural elements to avoid a cramped, "Bootstrap" layout.

---

## 4. Component DNA & Interactions

* **Active States:** Selected elements (like radio buttons or slider handles) should not just change color; they should emit a subtle glow using CSS drop shadows (e.g., `shadow-[0_0_15px_rgba(34,211,238,0.2)]`).
* **Buttons & Selectors:** Avoid solid background colors unless it is the primary "Call to Action" at the end of a flow. Prefer transparent backgrounds with a `zinc-800` border that illuminates to `cyan-400` on hover or active states.
* **Transitions:** Always use Tailwind's `transition-all duration-200` to ensure smooth state changes on all interactive elements.
