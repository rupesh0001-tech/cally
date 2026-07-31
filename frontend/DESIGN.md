---
version: beta
name: Cally-design-analysis
description: A neo-brutalist, vibrant scheduling-software interface anchored on a cream canvas (#FDFBF2) with high-contrast black borders, solid drop shadows, and a playful brand style. Brand identity is driven by bright accent colors (Yellow, Mint, Violet), Space Grotesk display typography, and rotated badged elements (WILD SIDE, Chaos). Product UI fragments (laptop schedules, task lists, and chat bubbles) are rendered directly inside high-contrast phone and browser mockups.

colors:
  yellow: "#F3E75B"
  yellow-deep: "#EEDF3E"
  ink: "#171614"
  ink-soft: "#2B2A27"
  cream: "#FDFBF2"
  white: "#FFFFFF"
  mint: "#7CEFC0"
  mint-deep: "#58D9A6"
  violet: "#8C7CF0"
  violet-soft: "#B7ACF7"
  gray-outline: "#E4E1D4"
  border: "#171614"

shadows:
  shadow-hard: "5px 5px 0 #171614"
  shadow-hard-sm: "3px 3px 0 #171614"

typography:
  display-xl:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(34px, 5.6vw, 58px)"
    fontWeight: 700
    lineHeight: 1.08
    textTransform: "uppercase"
  display-lg:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(28px, 4vw, 44px)"
    fontWeight: 700
  display-md:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(26px, 3.4vw, 38px)"
    fontWeight: 700
    textTransform: "uppercase"
  title-md:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "17px"
    fontWeight: 700
    textTransform: "uppercase"
  body-md:
    fontFamily: "Inter, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.6
  body-sm:
    fontFamily: "Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  button:
    fontFamily: "Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 700
  nav-link:
    fontFamily: "Inter, sans-serif"
    fontSize: "15px"
    fontWeight: 600

rounded:
  sm: "14px"
  md: "20px"
  lg: "28px"
  xs: "12px"
  pill: "999px"
  full: "50%"

components:
  eyebrow:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.yellow}"
    typography: "Inter 13px bold"
    rounded: "{rounded.pill}"
    padding: "8px 18px"
  btn-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    border: "2px solid {colors.ink}"
    shadow: "{shadows.shadow-hard-sm}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  btn-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    border: "2px solid {colors.ink}"
    shadow: "{shadows.shadow-hard-sm}"
    rounded: "{rounded.pill}"
    padding: "14px 26px"
  feature-card:
    backgroundColor: "{colors.white}"
    border: "2px solid {colors.ink}"
    shadow: "{shadows.shadow-hard}"
    rounded: "{rounded.md}"
    padding: "30px 26px"
  testimonial-card:
    backgroundColor: "{colors.white}"
    border: "2px solid {colors.ink}"
    shadow: "{shadows.shadow-hard-sm}"
    rounded: "{rounded.md}"
    padding: "26px 24px"
  testimonial-card-dark:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    border: "2px solid {colors.ink}"
    shadow: "{shadows.shadow-hard-sm}"
    rounded: "{rounded.md}"
    padding: "26px 24px"
  step-num:
    width: "42px"
    height: "42px"
    border: "2px solid {colors.cream}"
    rounded: "{rounded.xs}"
    fontFamily: "Space Grotesk"
    fontSize: "15px"
  store-btn:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.cream}"
    border: "2px solid {colors.ink}"
    rounded: "{rounded.sm}"
    padding: "13px 26px"
  store-btn-outline:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    border: "2px solid {colors.ink}"
    rounded: "{rounded.sm}"
    padding: "13px 26px"
  email-input:
    backgroundColor: "{colors.white}"
    border: "2px solid {colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 20px"
    width: "280px"
---

## Overview

Cally's marketing layout is a bold, high-contrast, **Neo-Brutalist** web application design. The UI is built on a warm cream grid floor (`{colors.cream}` — #FDFBF2) patterned with gray dots (`{colors.gray-outline}` — #E4E1D4) and styled with thick black borders (`2px`/`3px` solid `#171614`) and hard offset shadows. Brand energy is visual, organic, and graphic, employing asymmetric rotations, badge banners (e.g., "WILD SIDE" and "Chaos?"), and primary saturated colors (Yellow, Mint, Violet).

Headline elements use the robust geometric display face **Space Grotesk** in heavy 700 weight, while body text and UI controls use the cleaner sans-serif **Inter** for readability. Visual depth is established by flat colors and solid shadows rather than gradients or soft blur reflections.

### Key Characteristics:
* **Neo-Brutalist Visual Foundations**: Card containers and buttons carry explicit black borders and solid shadows without blur (`box-shadow: 5px 5px 0 var(--ink)`).
* **Vibrant Accent Layering**: Bold block elements in Mint (`#7CEFC0`), Yellow (`#F3E75B`), and Violet (`#8C7CF0`) segment interactive areas and label groupings.
* **Graphic Typography Mix**: High-contrast pairing of Space Grotesk (heads, uppercase styling) and Inter (body copy, details).
* **Active Interactive Components**: Hero mockups showcase actual interactive elements (Priya Shah schedule laptop views, task checklists, and chat feeds) to showcase functionality visually.
* **Responsive Grid Transitioning**: Cards stack cleanly from 3-up desktop layouts into 1-up columns on smaller viewport sizes, while decorative elements scale down to preserve the reading layout.

---

## Colors

### Brand & Accent
* **Yellow** (`{colors.yellow}` — #F3E75B): Pervasive brand accent. Used for the navbar background, the hero canvas backdrop, the waiting waitlist pills, and highlight tags.
* **Mint** (`{colors.mint}` — #7CEFC0): Signals success and primary visual badges. Used for progress cards, checked checklist items, waitlist buttons, and rotated badges.
* **Violet** (`{colors.violet}` — #8C7CF0): Structural accent. Used for feature cards, testimonials, active calendars, step highlights, and card counts.
* **Violet Soft** (`{colors.violet-soft}` — #B7ACF7): Input halos and chat backgrounds.

### Layout Floor & Cards
* **Cream** (`{colors.cream}` — #FDFBF2): The base background of all main sections, decorated with a radial grid.
* **White** (`{colors.white}` — #FFFFFF): Default card fills, text inputs, and content slots.
* **Ink** (`{colors.ink}` — #171614): The primary deep tone. Used for typography, borders, solid shadows, mockup backgrounds, and dark testimonials/footers.

---

## Typography

### Font voice
* **Space Grotesk**: Active display headings (h1, h2, h3, h4) and badges. Large sizes are rendered uppercase with close tracking.
* **Inter**: Main reading text, inputs, buttons, navigation links, and caption labels.

### Size Hierarchy

| Scale Token | Font Family | Size | Weight | Line Height | Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `display-xl` | Space Grotesk | clamp(34px, 5.6vw, 58px) | 700 | 1.08 | Primary Hero Headline |
| `display-lg` | Space Grotesk | clamp(28px, 4vw, 44px) | 700 | 1.15 | Proof Grid / Accent titles |
| `display-md` | Space Grotesk | clamp(26px, 3.4vw, 38px) | 700 | 1.2 | Feature / Step Header titles |
| `title-md` | Space Grotesk | 17px | 700 | 1.3 | Card Feature heads |
| `body-md` | Inter | 16px | 400 | 1.6 | Normal body text / captions |
| `body-sm` | Inter | 14px | 400 | 1.6 | Step lists / Footer lists |
| `button` | Inter | 15px | 700 | 1.0 | CTAs, Waitlist triggers |
| `nav-link` | Inter | 15px | 600 | 1.2 | Main navigation items |

---

## Spacing & Layout

### Spacing Tokens
* **Base scale**: 4px grid.
* **Section Padding**: `110px 0 100px` (Features, Social Proof, How It Works) and `120px 0 90px` (CTA band).
* **Grid gaps**: `26px` between feature cards, `24px` for testimonial rows, and `60px` columns in the "How it Works" layout.

### Layout grids
* **Feature layouts**: 3 columns at desktop, wrapping to 1 column at tablet (< 900px) and mobile (< 720px).
* **Mockup stages**: The hero stage uses absolute layers holding the laptop layout alongside the floating mobile phone popup. Stacks vertically under 900px.

---

## Shape Elements

* **Border Thickness**: Default elements use `2px` solid black borders (`#171614`). Highlight elements (like the rotated hero badge) use `3px` thickness.
* **Border Radii**:
  * `{rounded.xs}` (`12px`): Logo marks, step wrappers, calendar columns.
  * `{rounded.sm}` (`14px`): Store buttons, progress badges.
  * `{rounded.md}` (`20px`): Features cards, testimonial cards, stat blocks.
  * `{rounded.lg}` (`28px`): Main mockup phone edges.
  * `{rounded.pill}` (`999px`): Navbar CTAs, waitlist forms, eyebrow badges.

---

## UI Components

### Navigation & Headers
* **Logo Mark**: Solid ink square (`42px`) holding the yellow starburst SVG symbol.
* **Navbar**: Spans the top of page, colored in brand yellow, with logo signature, inline links (Features, How it Works), and primary CTA button.

### High-Contrast CTAs
* **Primary Button** (`.btn-dark`): Saturated ink background with cream text, a 2px border, and hard shadow. Shifts `translate(-2px, -2px)` on hover.
* **Secondary Button** (`.btn-light`): White background, ink text, 2px border.

### Interactive Mockups
* **HeroLaptop**: A dark screen mockup showing a simulated calendar column display (`cal-col`) populated with mint, violet, and dark events.
* **ChatPhone**: Interactive chat feed simulation showing messaging dialogue bubbles, calendar appointments, and active confirmation checkmarks.

### Cards & testimonials
* **Feature Card**: High-contrast white card, styled with a colored icon wrapper (Violet / Mint), Space Grotesk h3, and paragraph description.
* **Testi-Card**: Outlined white container displaying quote paragraphs, testimonials, and author avatar details. The second card flips to `{colors.ink}` (dark variant) to capture attention.

---

## Interactive States (Do's & Don'ts)

### Do:
* **Borders & Shadows**: Always pair borders (`2px` solid `#171614`) with sharp, solid drop shadows.
* **Offset Hover Interactions**: Move interactive cards and buttons by `translate(-2px, -2px)` on hover while increasing the solid shadow size (e.g. from `3px` to `5px`) to simulate physical height.
* **Uppercase Display Style**: Keep headers (h1, h2, h3, h4) in Space Grotesk with text-transform uppercase to sustain the neo-brutalist theme.
* **Rotated Badges**: Use slight asymmetric rotations (`-3deg` to `2deg`) on badge overlays to preserve the playful character.

### Don't:
* **Soft Shadows**: Avoid fuzzy box-shadows or gradients; keep shadow edges 100% sharp.
* **Animations**: Do not add continuous scrolling, sliding, or complex web animations. Keep state transitions limited to standard hover translate effects.
* **Pastel Canvas Floors**: Always use cream (`#FDFBF2`) as the main canvas floor background rather than plain white or neon backdrops.
