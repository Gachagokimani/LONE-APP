
Design System Specification (DSS) – Expert UI with Next.js
1. Introduction
This document defines the design and development standards for building high‑quality user interfaces with Next.js. It ensures consistency, performance, and maintainability across the project by enforcing:

A strict color palette (dark, vibrant, no white backgrounds).

Global styling via a single CSS file; all components use semantic class names only.

Iconography from Lucide React and MUI Icons, with animated variants.

Modal design that embraces transparency and dark vibrancy.

Mandatory loading states and smooth animations powered by Framer Motion and CSS transitions.

Adherence to this DSS guarantees a cohesive visual language and an exceptional user experience.

2. Color Palette – Dark & Vibrant
All UI elements must use colors from the approved palette. Avoid pure white backgrounds; instead, employ dark shades with vibrant accents.

Role	Hex Code	Usage
Background	#0A0A0F	Primary page background (deep dark).
Surface	#1A1A2A	Cards, sidebars, dropdowns – slightly lighter for depth.
Elevated	#242438	Hover states, modals, tooltips – further lifted.
Primary	#7C3AED	Vibrant purple – buttons, links, active indicators.
Secondary	#EC4899	Pink – accents, highlights, loading spinners.
Tertiary	#3B82F6	Blue – info messages, secondary buttons.
Text	#F8FAFC	Primary text – off‑white for readability.
Text Muted	#94A3B8	Secondary text, placeholders.
Border	#2D2D44	Dividers, subtle outlines.
Success	#10B981	Green – success states.
Warning	#F59E0B	Amber – warnings.
Error	#EF4444	Red – errors.
All color values are defined as CSS custom properties in the global stylesheet for easy theming and maintenance.

3. Styling Architecture – Single Source of Truth
Global Styles Only: All styling must reside in one global CSS file (e.g., styles/globals.css).

Semantic Class Names: Components and pages use only class names (no inline styles, no CSS‑in‑JS). Class names follow the BEM‑like convention: block__element--modifier.

No Scoped Styles: Avoid CSS Modules or styled‑components – everything is globally namespaced to prevent duplication.

Utility Classes: For rapid development, a set of utility classes (e.g., flex, p-4, text-primary) is defined in the global file. These mirror a subset of Tailwind but are handcrafted to match the palette.

Theming: Dark mode is the default; no light mode is supported.

Example Class Definition in globals.css:
css
/* Color variables */
:root {
  --bg-primary: #0A0A0F;
  --surface: #1A1A2A;
  --primary: #7C3AED;
  --text: #F8FAFC;
  /* ... all other colors */
}

/* Utility classes */
.bg-surface { background-color: var(--surface); }
.text-primary { color: var(--primary); }
.p-4 { padding: 1rem; }
/* ... */
Components then simply apply these classes:

jsx
<div className="bg-surface p-4 rounded-lg">
  <p className="text-primary">Hello World</p>
</div>
4. Icon Usage – Lucide React & MUI Icons
Lucide React is the primary icon set for its clean, consistent style and animation support.

MUI Icons may be used for specific cases where Lucide lacks an icon, but their visual weight must be adjusted via CSS to match Lucide’s stroke width.

4.1. Installation
bash
npm install lucide-react @mui/icons-material @mui/material
4.2. Icon Implementation
All icons must be wrapped in a reusable Icon component that:

Accepts name (from Lucide) or muiName (from MUI) as a prop.

Applies default size (20px) and color (using CSS classes like text-primary).

Supports animation props (spin, pulse) via CSS or Framer Motion.

Example Icon Component:
jsx
// components/ui/Icon.jsx
import * as LucideIcons from 'lucide-react';
import * as MuiIcons from '@mui/icons-material';

export default function Icon({ name, muiName, className = '', size = 20, ...props }) {
  if (muiName) {
    const MuiIcon = MuiIcons[muiName];
    return <MuiIcon className={`icon ${className}`} style={{ fontSize: size }} {...props} />;
  }
  const LucideIcon = LucideIcons[name];
  return <LucideIcon className={`icon ${className}`} size={size} {...props} />;
}
Icons can be animated by adding utility classes:

.icon-spin (rotate animation)

.icon-pulse (opacity/scale pulse)

5. Modal Design – Transparent & Vibrant
Modals must never have a solid white background. Instead, they follow these rules:

Backdrop: A semi‑transparent dark overlay (rgba(10, 10, 15, 0.8)) – blur effect optional.

Modal Container: background-color: var(--elevated) with opacity/transparency allowed for a glass‑morphism effect (use backdrop-filter: blur(8px) when appropriate).

Borders: Subtle, using border: 1px solid var(--border).

Animations: Entrance/exit animations using Framer Motion (scale + fade).

Modal Component Example (with Framer Motion):
jsx
// components/ui/Modal.jsx
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-container bg-elevated p-6 rounded-xl border border-border"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
6. Loading States & Animations – Mandatory
Every data‑fetching operation must display a loading state. Use:

Skeleton screens for content areas (defined via CSS classes with shimmer animation).

Spinners (from Lucide’s Loader2 icon) with .icon-spin class.

Page transitions with Framer Motion (fade/slide between routes).

6.1. Global CSS Animations
Define reusable animations in globals.css:

css
@keyframes spin {
  to { transform: rotate(360deg); }
}
.icon-spin {
  animation: spin 1s linear infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
.icon-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
.skeleton {
  background: linear-gradient(90deg, var(--surface) 25%, var(--elevated) 50%, var(--surface) 75%);
  background-size: 2000px 100%;
  animation: shimmer 2s infinite;
}
6.2. Next.js Integration for Page Transitions
Use framer-motion with Next.js App Router:

jsx
// app/layout.js
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  return (
    <html>
      <body>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </body>
    </html>
  );
}
7. Animation Libraries
Framer Motion – required for all complex animations (modals, page transitions, micro‑interactions).

CSS Transitions/Animations – for simple hover effects, loading spinners, and utility animations (as defined above).

Lucide React Animations – use the animate-spin or custom CSS classes for icons.

All animations must be performant – prefer transform and opacity properties, and avoid animating width, height, or top/left.

8. Implementation Guidelines for Next.js
8.1. Folder Structure
text
project/
├── app/                 # Next.js App Router pages
├── components/
│   ├── ui/              # Reusable UI components (Button, Modal, Icon, etc.)
│   └── layouts/         # Layout components (Header, Footer)
├── styles/
│   └── globals.css      # ONLY global CSS file
├── public/
└── next.config.js
8.2. CSS Imports
Only globals.css is imported in the root layout:

jsx
// app/layout.js
import '../styles/globals.css';
8.3. Using Class Names
All styling is done via class names; no style prop unless absolutely necessary (e.g., dynamic values not covered by palette). For dynamic values, use CSS variables set via inline style.

9. Quality Assurance
No white backgrounds – verify with browser devtools.

All interactive elements have hover/focus animations (scale, color transition).

Loading states are present for async operations – skeletons or spinners.

Icons are consistently sized and colored.

Modals use transparent backdrop and spring animations.

10. Example: Putting It All Together
jsx
// app/dashboard/page.jsx
'use client';
import { useState } from 'react';
import Icon from '@/components/ui/Icon';
import Modal from '@/components/ui/Modal';

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAction = async () => {
    setLoading(true);
    // simulate fetch
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setModalOpen(true);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl text-primary mb-4">Dashboard</h1>
      <button
        onClick={handleAction}
        className="bg-primary text-text px-4 py-2 rounded-lg flex items-center gap-2 hover:scale-105 transition-transform"
      >
        {loading ? (
          <>
            <Icon name="Loader2" className="icon-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            <Icon name="Rocket" />
            <span>Launch</span>
          </>
        )}
      </button>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <div className="p-4">
          <h2 className="text-xl mb-2">Success!</h2>
          <p>Your action completed.</p>
          <button
            onClick={() => setModalOpen(false)}
            className="mt-4 bg-secondary text-text px-3 py-1 rounded"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}
11. Conclusion
By strictly following this Design System Specification, the development team will produce a visually cohesive, highly performant, and engaging UI. Every component, animation, and color choice is intentional and contributes to an expert user experience.

All code must be reviewed against this DSS before merging. For any questions or exceptions, consult the design lead.

End of Document