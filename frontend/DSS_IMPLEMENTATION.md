# Frontend DSS Implementation - Complete Revamp (v2.0) 🇰🇪 Kenya Edition

## Product: Mkopo Kenya 🇰🇪

**Official Name:** Mkopo Kenya Loan Management Platform  
**Market:** Kenya  
**Currency:** KES (Kenyan Shilling)  
**Language:** English  
**Target Users:** Kenyan businesses, SMEs, loan officers

## Overview

**Loan Management Platform for Kenya**

The frontend has been **completely revamped** as a **Kenyan loan management solution** with:

- ✅ **Crimson Red Color Scheme** (replacing purple) with diverse accent palette
- ✅ **Enhanced Icon Animations** (8+ animation styles with Lucide React)
- ✅ **Advanced Render Animations** (stagger effects, scale-in, bounce, glow)
- ✅ **Full Dev Mode Access** (all routes accessible for end-to-end testing)
- ✅ **Optimized Record Layouts** with shimmer effects and polish
- ✅ **Dark, Vibrant Theme** with semantic class names
- ✅ **Comprehensive global CSS** with utilities
- ✅ **Reusable UI components**
- ✅ **Framer Motion animations** for page transitions
- ✅ **Loading states** with skeleton screens
- ✅ **Proper error handling** with visual feedback
- ✅ **Kenyan Localization**: KES Currency, Kenyan Names, Local Context

## What Was Implemented (v2.0)

### NEW: Revolutionary Expanded Color Palette

**Premium Action & Status Colors (Diverse Application):**

| Role | Hex Code | Usage | Component Examples |
|------|----------|-------|-------------------|
| Crimson | #DC2626 | Primary CTAs, danger, critical alerts | Primary buttons, delete actions, error badges |
| Orange | #F97316 | Secondary actions, warnings, emphasis | Secondary buttons, warning messages, featured tags |
| Cyan | #06B6D4 | Tertiary actions, info, notifications | Info buttons, info badges, notification icons |
| Violet | #A855F7 | Special highlights, premium features | Special badges, featured loans, VIP customers |
| Blue | #3B82F6 | Informational elements, links | Help text, info icons, link colors, detail pages |
| Emerald | #10B981 | Success, approved, positive states | Success badges, approved loans, checkmarks |
| Lime | #84CC16 | Positive indicators, growth, active states | Active indicators, growth metrics, live status |
| Amber | #F59E0B | Warnings, pending, attention needed | Warning badges, pending loans, cautionary text |
| Rose | #F43F5E | Soft errors, rejections, declined | Declined badges, soft errors, cancellations |
| Fuchsia | #EC4899 | Accent highlights, special features | Accent highlights, feature callouts, premium icons |
| Indigo | #6366F1 | Alternative primary, secondary data | Alternative buttons, secondary calls-to-action |
| Sky | #0EA5E9 | Light info, secondary notifications | Secondary info, light status indicators |

**Extended Neutral & Semantic Colors:**
- Background: #0A0A0F (deep dark)
- Surface: #1A1A2A (card backgrounds)
- Elevated: #242438 (hover states)
- Text: #F8FAFC (readable white)
- Text Muted: #94A3B8 (secondary)
- Border: #2D2D44 (subtle dividers)
- Success: #10B981
- Warning: #F59E0B
- Error: #DC2626
- Info: #3B82F6

**Neutral Colors (Unchanged):**
- Background: #0A0A0F (deep dark)
- Surface: #1A1A2A (card backgrounds)
- Elevated: #242438 (hover states)
- Text: #F8FAFC (readable white)
- Text Muted: #94A3B8 (secondary)
- Border: #2D2D44 (subtle dividers)

### Color Usage Guidelines - Avoiding Uniformity

**IMPORTANT: Do NOT use the same color for all elements. Diversify colors throughout the UI!**

**Button Variants - Use Different Colors:**
```tsx
// Primary CTA - Crimson
<Button variant="primary">Create Loan</Button>

// Secondary CTA - Orange
<Button variant="secondary">Edit Details</Button>

// Tertiary CTA - Cyan
<Button variant="tertiary">View More</Button>

// Quaternary CTA - Violet
<Button variant="quaternary">Mark Special</Button>

// Info CTA - Blue
<Button variant="info">Help & Support</Button>

// Success CTA - Emerald
<Button variant="success">Approve Loan</Button>

// Danger CTA - Rose
<Button variant="danger">Reject Application</Button>
```

**Badge Variants - Use Different Colors Based on Context:**
```tsx
// Loan Status Badges
<Badge variant="approved" color="emerald">Approved</Badge>  {/* Green #10B981 */}
<Badge variant="pending" color="amber">Pending</Badge>      {/* Amber #F59E0B */}
<Badge variant="rejected" color="rose">Rejected</Badge>     {/* Rose #F43F5E */}
<Badge variant="under-review" color="sky">Under Review</Badge> {/* Sky #0EA5E9 */}
<Badge variant="disbursed" color="lime">Disbursed</Badge>   {/* Lime #84CC16 */}

// Priority Badges
<Badge variant="high" color="crimson">High Priority</Badge> {/* Crimson #DC2626 */}
<Badge variant="medium" color="orange">Medium Priority</Badge> {/* Orange #F97316 */}
<Badge variant="low" color="cyan">Low Priority</Badge>     {/* Cyan #06B6D4 */}

// Customer Type Badges
<Badge variant="vip" color="violet">VIP Customer</Badge>   {/* Violet #A855F7 */}
<Badge variant="premium" color="fuchsia">Premium</Badge>    {/* Fuchsia #EC4899 */}
<Badge variant="standard" color="indigo">Standard</Badge>   {/* Indigo #6366F1 */}
```

**Icon Colors - Vary by Context:**
```tsx
// Status- Green for success
<Icon name="CheckCircle" color="emerald" animate="glow" />

// Warning - Amber for attention
<Icon name="AlertTriangle" color="amber" animate="bounce" />

// Info - Blue for information
<Icon name="Info" color="blue" animate="ping" />

// Error - Crimson for critical
<Icon name="XCircle" color="crimson" animate="wobble" />

// Secondary - Orange for emphasis
<Icon name="Zap" color="orange" animate="spin" />

// Special - Violet for premium
<Icon name="Star" color="violet" animate="glow" />

// Active - Lime for live/active
<Icon name="Activity" color="lime" animate="pulse" />
```

**Card/Tile Accents - Use Different Border Colors:**
```tsx
// Loan Tile Variants
<div className="record-tile border-crimson">Urgent Loan</div>   {/* Red border */}
<div className="record-tile border-emerald">Approved Loan</div>  {/* Green border */}
<div className="record-tile border-amber">Pending Loan</div>     {/* Amber border */}
<div className="record-tile border-violet">Featured Loan</div>   {/* Purple border */}
<div className="record-tile border-sky">New Loan</div>           {/* Light blue border */}

// Customer Card Variants
<div className="record-tile border-fuchsia">VIP Customer</div>   {/* Pink border */}
<div className="record-tile border-lime">Active Customer</div>   {/* Lime border */}
<div className="record-tile border-indigo">Standard</div>        {/* Indigo border */}
```

**Text & Typography - Use Colors for Meaning:**
```tsx
// Primary emphasis - Crimson
<h1 className="text-crimson">Critical Information</h1>

// Success message - Emerald
<p className="text-emerald">Loan approved successfully!</p>

// Warning message - Amber
<p className="text-amber">Please review pending items</p>

// Error message - Rose
<p className="text-rose">Action could not be completed</p>

// Secondary emphasis - Orange
<p className="text-orange">Important notice</p>

// Info message - Sky
<p className="text-sky">Additional information</p>

// Featured/Special - Violet
<p className="text-violet">Premium feature</p>

// Success indicator - Lime
<p className="text-lime">Active and working</p>
```

**Dashboard Metrics - Use Color Coding:**
```tsx
// Different colors for different metrics
<Card borderColor="crimson">      {/* Red for critical KPIs */}
  <h3>Total Disbursed</h3>
  <p className="text-2xl text-crimson">KES 162.5M</p>
</Card>

<Card borderColor="emerald">      {/* Green for success metrics */}
  <h3>Approved Loans</h3>
  <p className="text-2xl text-emerald">45 loans</p>
</Card>

<Card borderColor="amber">        {/* Amber for pending items */}
  <h3>Pending Review</h3>
  <p className="text-2xl text-amber">12 loans</p>
</Card>

<Card borderColor="violet">       {/* Purple for featured/special */}
  <h3>VIP Customers</h3>
  <p className="text-2xl text-violet">8 customers</p>
</Card>

<Card borderColor="indigo">       {/* Indigo for alternative data */}
  <h3>Active Accounts</h3>
  <p className="text-2xl text-indigo">28 accounts</p>
</Card>
```

**Form Elements - Use Color States:**
```tsx
// Input focus - Blue
<input className="focus-blue" placeholder="Enter amount" />

// Validation - Colors based on state
<input className="border-emerald" />    {/* Valid - Green */}
<input className="border-rose" />       {/* Error - Rose */}
<input className="border-amber" />      {/* Warning - Amber */}
<input className="border-sky" />        {/* Info - Sky */}
```

**Navigation & Links - Use Distinct Colors:**
```tsx
// Active navigation - Crimson
<a href="/loans" className="nav-link-active text-crimson">Loans</a>

// Hover state - Orange
<a href="/customers" className="nav-link-hover text-orange">Customers</a>

// Secondary link - Cyan
<a href="/reports" className="nav-link text-cyan">Reports</a>

// Help/Support link - Blue
<a href="/help" className="nav-link text-blue">Help</a>
```

### NEW: Global Styles (`app/globals.css`) - 1100+ Lines

**Enhanced Sections:**
- ✨ **Color Palette**: 12+ primary CSS variables + 12+ extended accent colors
- ✨ **Color Utility Classes**: `.text-[color]`, `.bg-[color]`, `.border-[color]` for all 12 colors
- ✨ **Icon Animations**: 8 new animation types
- ✨ **Record Tiles**: Shimmer effects, glow on hover, color-coded borders
- ✨ **Button Variants**: 7+ color variants (primary, secondary, tertiary, quaternary, info, success, danger)
- ✨ **Badge Variants**: 12+ semantic styles with distinct colors
- ✨ **Scrollbar**: Primary accent color with secondary hover
- ✨ **Alerts**: Multiple alert types with color differentiation

**CSS Variables Setup (app/globals.css):**
```css
:root {
  /* Primary Colors - Action & Status */
  --color-crimson: #DC2626;      /* Critical, primary CTA */
  --color-orange: #F97316;       /* Secondary, emphasis */
  --color-cyan: #06B6D4;         /* Tertiary, alternative */
  --color-violet: #A855F7;       /* Special, premium */
  --color-blue: #3B82F6;         /* Info, links */
  --color-emerald: #10B981;      /* Success, approved */
  --color-lime: #84CC16;         /* Active, growth */
  --color-amber: #F59E0B;        /* Warning, pending */
  --color-rose: #F43F5E;         /* Soft error, rejected */
  --color-fuchsia: #EC4899;      /* Accent, premium */
  --color-indigo: #6366F1;       /* Alternative primary */
  --color-sky: #0EA5E9;          /* Light info, secondary */

  /* Neutral Colors */
  --color-background: #0A0A0F;   /* Page background */
  --color-surface: #1A1A2A;      /* Card backgrounds */
  --color-elevated: #242438;     /* Hover states */
  --color-text: #F8FAFC;         /* Primary text */
  --color-text-muted: #94A3B8;   /* Secondary text */
  --color-border: #2D2D44;       /* Dividers */

  /* Aliases for semantic meaning */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #DC2626;
  --color-info: #3B82F6;
  --color-primary: #DC2626;
  --color-secondary: #F97316;
}
```

**Color Utility Classes (app/globals.css):**
```css
/* Text Color Utilities */
.text-crimson { color: var(--color-crimson); }
.text-orange { color: var(--color-orange); }
.text-cyan { color: var(--color-cyan); }
.text-violet { color: var(--color-violet); }
.text-blue { color: var(--color-blue); }
.text-emerald { color: var(--color-emerald); }
.text-lime { color: var(--color-lime); }
.text-amber { color: var(--color-amber); }
.text-rose { color: var(--color-rose); }
.text-fuchsia { color: var(--color-fuchsia); }
.text-indigo { color: var(--color-indigo); }
.text-sky { color: var(--color-sky); }

/* Background Color Utilities */
.bg-crimson { background-color: rgba(220, 38, 38, 0.1); }
.bg-orange { background-color: rgba(249, 115, 22, 0.1); }
.bg-cyan { background-color: rgba(6, 182, 212, 0.1); }
.bg-violet { background-color: rgba(168, 85, 247, 0.1); }
.bg-blue { background-color: rgba(59, 130, 246, 0.1); }
.bg-emerald { background-color: rgba(16, 185, 129, 0.1); }
.bg-lime { background-color: rgba(132, 204, 22, 0.1); }
.bg-amber { background-color: rgba(245, 158, 11, 0.1); }
.bg-rose { background-color: rgba(244, 63, 94, 0.1); }
.bg-fuchsia { background-color: rgba(236, 72, 153, 0.1); }
.bg-indigo { background-color: rgba(99, 102, 241, 0.1); }
.bg-sky { background-color: rgba(14, 165, 233, 0.1); }

/* Border Color Utilities */
.border-crimson { border-color: var(--color-crimson); }
.border-orange { border-color: var(--color-orange); }
.border-cyan { border-color: var(--color-cyan); }
.border-violet { border-color: var(--color-violet); }
.border-blue { border-color: var(--color-blue); }
.border-emerald { border-color: var(--color-emerald); }
.border-lime { border-color: var(--color-lime); }
.border-amber { border-color: var(--color-amber); }
.border-rose { border-color: var(--color-rose); }
.border-fuchsia { border-color: var(--color-fuchsia); }
.border-indigo { border-color: var(--color-indigo); }
.border-sky { border-color: var(--color-sky); }

/* Icon Color Utilities */
.icon-crimson { color: var(--color-crimson); }
.icon-orange { color: var(--color-orange); }
.icon-cyan { color: var(--color-cyan); }
.icon-violet { color: var(--color-violet); }
.icon-blue { color: var(--color-blue); }
.icon-emerald { color: var(--color-emerald); }
.icon-lime { color: var(--color-lime); }
.icon-amber { color: var(--color-amber); }
.icon-rose { color: var(--color-rose); }
.icon-fuchsia { color: var(--color-fuchsia); }
.icon-indigo { color: var(--color-indigo); }
.icon-sky { color: var(--color-sky); }

/* Hover Color Utilities */
.hover-text-crimson:hover { color: var(--color-crimson); }
.hover-text-orange:hover { color: var(--color-orange); }
.hover-text-cyan:hover { color: var(--color-cyan); }
.hover-text-violet:hover { color: var(--color-violet); }
.hover-text-blue:hover { color: var(--color-blue); }
.hover-text-emerald:hover { color: var(--color-emerald); }
.hover-text-lime:hover { color: var(--color-lime); }
.hover-text-amber:hover { color: var(--color-amber); }
.hover-text-rose:hover { color: var(--color-rose); }
.hover-text-fuchsia:hover { color: var(--color-fuchsia); }
.hover-text-indigo:hover { color: var(--color-indigo); }
.hover-text-sky:hover { color: var(--color-sky); }
```

### NEW: Icon Animation System

**Animation Types (Enhanced Component):**
- `spin` - Classic 360° rotation (1s)
- `spin-slow` - Slower rotation (3s)
- `spin-fast` - Fast rotation (0.6s)
- `pulse` - Opacity fade (1.5s)
- `bounce` - Vertical bounce (0.8s)
- `ping` - Pulsing glow ring (1s)
- `wobble` - Rotation wobble (0.6s)
- `glow` - Box shadow glow (2s)

**Updated Icon Component (`components/ui/Icon.tsx`):**
```tsx
interface IconProps {
  name: keyof typeof LucideIcons;
  size?: number;
  animate?: 'spin' | 'pulse' | 'bounce' | 'spin-slow' | 'spin-fast' | 'ping' | 'wobble' | 'glow';
  color?: 'primary' | 'secondary' | 'tertiary' | 'muted' | 'success' | 'warning' | 'error' | 'info' | 'default';
  strokeWidth?: number;
}
```

**Usage Examples:**
```tsx
// Spinning loader (fast)
<Icon name="Loader2" size={40} animate="spin-fast" color="primary" />

// Bouncing indicator
<Icon name="AlertCircle" size={24} animate="bounce" color="warning" />

// Glow effect
<Icon name="Zap" size={32} animate="glow" color="secondary" />

// Wobble animation
<Icon name="Settings" size={20} animate="wobble" color="muted" />

// Ping ring (notification)
<Icon name="Bell" size={24} animate="ping" color="info" />
```

### NEW: Advanced Animations in `globals.css`

**Keyframe Animations Added:**
```css
@keyframes scaleIn { /* Scale + fade entrance */ }
@keyframes slideInUp { /* Vertical slide entrance */ }
@keyframes bounce { /* Vertical bounce */ }
@keyframes ping { /* Pulsing glow effect */ }
@keyframes wobble { /* Rotation wobble */ }
@keyframes glow { /* Box shadow glow pulse */ }
```

**Utility Classes:**
- `.animate-scale-in` - Scale from 0.95 to 1 with fade
- `.animate-slide-in-up` - Slide up 20px with fade
- `.animate-bounce` - Continuous vertical bounce
- `.animate-ping` - Continuous ping glow
- `.animate-wobble` - Continuous rotation wobble
- `.animate-glow` - Continuous shadow glow

**Icon-Specific Classes:**
- `.icon-spin-slow` - 3s rotation
- `.icon-spin-fast` - 0.6s rotation
- `.icon-bounce` - Bouncing icon
- `.icon-pulse-ring` - Ping animation
- `.icon-wobble` - Wobble animation

### NEW: Enhanced Record Tile Layouts

**Shimmer Effect on Hover:**
```css
.record-tile::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
  transition: left 0.5s ease;
}

.record-tile:hover::before {
  left: 100%;
}
```

**Features:**
- Smooth shimmer effect on hover
- Crimson red glow on border
- Elevated background on hover
- Primary text color change on hover
- 4px upward translate on hover

### Dev Mode - Full Route Access

**Configuration (`.env.local`):**
```
NEXT_PUBLIC_DEV_MODE=true
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

**Benefits:**
- ✅ All routes accessible without login
- ✅ Admin dashboard always visible
- ✅ E2E testing enabled
- ✅ Demo data fallback for API failures
- ✅ Full customer and loan management access

### 🇰🇪 Kenyan Localization

**Currency: Kenyan Shilling (KES)**
- All monetary values displayed in KES
- Proper currency formatting: KES 1,250,000
- Demo data amounts scaled for Kenyan market

**Kenyan Names & Locations**

Mock data uses authentic Kenyan names and locations:

| Field | Examples |
|-------|----------|
| Names | Kamau Njoroge, Amara Hassan, Grace Wanjiru, James Kariuki, Fatima Mohamed |
| Locations | Nairobi, Kisumu, Mombasa, Nakuru |
| Email | firstname.lastname@example.com |
| Phone | +254 7XX XXX XXX |

**Sample Demo Users:**
- **Kamau Njoroge** - Software Engineer, Nairobi (KES 130,000/month)
- **Grace Wanjiru** - Healthcare Professional, Nairobi (KES 165,000/month)
- **James Kariuki** - Agriculture Expert, Nakuru (KES 98,000/month)
- **Fatima Mohamed** - Business Consultant, Mombasa (KES 145,000/month)
- **Peter Ochieng** - Finance Professional, Kisumu (KES 175,000/month)

**Demo Loan Amounts (KES):**
| Borrower | Amount | Status | Purpose |
|----------|--------|--------|---------|
| Kamau Njoroge | 650,000 | Pending | Business Expansion |
| Grace Wanjiru | 975,000 | Approved | Medical Equipment |
| James Kariuki | 390,000 | Under Review | Farm Equipment |
| Fatima Mohamed | 520,000 | Disbursed | Business Working Capital |
| Peter Ochieng | 780,000 | Disbursed | Home Improvement |

**Contact Format (Kenyan):**
- Phone: +254 7XX XXX XXX (Safaricom, Airtel, Equity Bank Mobile)
- Email: firstname.lastname@example.com
- Address: City/County, Kenya

**Admin Dashboard Fallback Data (KES):**
- Total Loans: 45
- Active Customers: 28
- Total Disbursed: KES 162,500,000 (162.5M)

**Sample Loan Status Distribution:**
- Pending: 8 loans
- Under Review: 12 loans  
- Approved: 15 loans
- Disbursed: 10 loans
- Closed: 3 loans

### Dev Mode - Full Route Access

### Color System - Complete Reference

| Component | Color | Hex | Primary Use | Secondary Use |
|-----------|-------|-----|-------------|---------------|
| Primary Actions | Crimson | #DC2626 | Critical CTAs, delete, errors | High priority badges |
| Secondary Actions | Orange | #F97316 | Important actions, emphasis | Medium priority |
| Tertiary Actions | Cyan | #06B6D4 | Alternative actions | Low priority |
| Special/Premium | Violet | #A855F7 | VIP customers, featured loans | Premium features |
| Info & Links | Blue | #3B82F6 | Information, help, links | Detail pages |
| Success States | Emerald | #10B981 | Approved loans, success | Active indicators |
| Active/Growth | Lime | #84CC16 | Live status, growth metrics | Active accounts |
| Warnings | Amber | #F59E0B | Pending items, cautions | Attention needed |
| Soft Errors | Rose | #F43F5E | Rejected loans, cancellations | Soft failures |
| Accent Highlights | Fuchsia | #EC4899 | Premium features, accents | Special callouts |
| Alternative Primary | Indigo | #6366F1 | Alternative CTA, secondary data | Backend processes |
| Light Info | Sky | #0EA5E9 | Secondary notifications, hints | New items |
| Page Background | Deep Dark | #0A0A0F | Canvas | — |
| Card Background | Dark | #1A1A2A | Container | — |
| Hover Background | Elevated | #242438 | Hover states | Focus states |
| Text Primary | Off-white | #F8FAFC | Main text | Readable |
| Text Secondary | Slate | #94A3B8 | Supporting text | Metadata |
| Borders | Subtle | #2D2D44 | Dividers | Outlines |

## Component Usage Examples

### Enhanced Icon Component - Diverse Color Usage
```tsx
// Different colors for different purposes
<Icon name="Loader2" size={40} animate="spin-fast" color="crimson" />    {/* Critical */}
<Icon name="Info" size={24} animate="ping" color="blue" />              {/* Information */}
<Icon name="AlertTriangle" size={32} animate="wobble" color="amber" />  {/* Warning */}
<Icon name="CheckCircle" size={28} animate="glow" color="emerald" />   {/* Success */}
<Icon name="Zap" size={32} animate="spin" color="orange" />             {/* Energy/Secondary */}
<Icon name="Star" size={24} animate="glow" color="violet" />           {/* Special/Premium */}
<Icon name="Activity" size={20} animate="pulse" color="lime" />        {/* Active */}
<Icon name="XCircle" size={28} animate="bounce" color="rose" />        {/* Error/Reject */}
<Icon name="Bell" size={24} animate="ping" color="sky" />              {/* Notification */}
<Icon name="Heart" size={20} animate="glow" color="fuchsia" />         {/* Favorite/Premium */}
<Icon name="Target" size={24} animate="spin-slow" color="indigo" />    {/* Goal */}
```

### Button Component - Varied Color Variants
```tsx
// Primary CTA - Crimson
<Button variant="primary" size="lg">
  <Icon name="Plus" size={18} color="primary" />
  <span>Create Loan</span>
</Button>

// Secondary CTA - Orange
<Button variant="secondary" size="md">
  <Icon name="Edit" size={16} color="secondary" />
  Edit Details
</Button>

// Tertiary CTA - Cyan
<Button variant="tertiary" size="md">
  View Details
</Button>

// Quaternary CTA - Violet
<Button variant="quaternary" size="md">
  <Icon name="Star" size={16} color="violet" />
  Mark Premium
</Button>

// Success CTA - Emerald
<Button variant="success" size="md">
  <Icon name="Check" size={16} color="emerald" />
  Approve
</Button>

// Danger CTA - Rose
<Button variant="danger" size="sm">
  <Icon name="Trash2" size={14} color="rose" />
  Delete
</Button>

// Info CTA - Sky
<Button variant="info" size="md">
  <Icon name="HelpCircle" size={16} color="sky" />
  Get Help
</Button>
```

### Card Component with Color-Coded Rendering
```tsx
// Urgent/Critical Loan - Crimson
<motion.div
  className="record-tile border-l-4 border-crimson"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.1 }}
>
  <div className="flex justify-between items-center">
    <h3 className="text-crimson font-bold">Urgent Loan</h3>
    <Icon name="AlertCircle" size={20} color="crimson" animate="bounce" />
  </div>
  <p className="text-lg text-crimson font-bold">KES 650,000</p>
</motion.div>

// Approved Loan - Emerald
<motion.div
  className="record-tile border-l-4 border-emerald"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.15 }}
>
  <div className="flex justify-between items-center">
    <h3 className="text-emerald font-bold">Approved Loan</h3>
    <Icon name="CheckCircle" size={20} color="emerald" animate="glow" />
  </div>
  <p className="text-lg text-emerald font-bold">KES 975,000</p>
  <Badge color="emerald">Approved</Badge>
</motion.div>

// Pending Review - Amber
<motion.div
  className="record-tile border-l-4 border-amber"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
>
  <div className="flex justify-between items-center">
    <h3 className="text-amber font-bold">Under Review</h3>
    <Icon name="Clock" size={20} color="amber" animate="spin-slow" />
  </div>
  <p className="text-lg text-amber font-bold">KES 390,000</p>
  <Badge color="amber">Pending</Badge>
</motion.div>

// VIP/Featured Customer - Violet
<motion.div
  className="record-tile border-l-4 border-violet"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.25 }}
>
  <div className="flex justify-between items-center">
    <h3 className="text-violet font-bold">VIP Customer</h3>
    <Icon name="Star" size={20} color="violet" animate="glow" />
  </div>
  <p className="text-violet text-sm">Premium Member</p>
  <Badge color="violet">VIP</Badge>
</motion.div>

// Active/Online - Lime
<motion.div
  className="record-tile border-l-4 border-lime"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
>
  <div className="flex justify-between items-center">
    <h3 className="text-lime font-bold">Active Account</h3>
    <Icon name="Activity" size={20} color="lime" animate="pulse" />
  </div>
  <span className="inline-block px-2 py-1 rounded text-sm font-medium bg-lime text-black">
    Online Now
  </span>
</motion.div>
```

### Badge Component - Full Color Range
```tsx
// Status Badges
<Badge color="crimson">Urgent</Badge>
<Badge color="emerald">Approved</Badge>
<Badge color="amber">Pending</Badge>
<Badge color="rose">Rejected</Badge>
<Badge color="sky">Under Review</Badge>
<Badge color="lime">Disbursed</Badge>

// Priority Badges
<Badge color="crimson">High Priority</Badge>
<Badge color="orange">Medium Priority</Badge>
<Badge color="cyan">Low Priority</Badge>

// Customer Type Badges
<Badge color="violet">VIP Customer</Badge>
<Badge color="fuchsia">Premium</Badge>
<Badge color="indigo">Standard</Badge>

// Account Status Badges
<Badge color="lime">Active</Badge>
<Badge color="amber">Inactive</Badge>
<Badge color="rose">Suspended</Badge>
```

### Staggered List Animations with Color Coding
```tsx
<motion.div
  className="record-grid"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
>
  {loans.map((loan, idx) => {
    // Determine color based on status
    const statusColors = {
      approved: 'emerald',
      pending: 'amber',
      rejected: 'rose',
      urgent: 'crimson',
      featured: 'violet',
      active: 'lime',
    };
    const color = statusColors[loan.status] || 'blue';

    return (
      <motion.div
        key={loan.id}
        className={`record-tile border-l-4 border-${color}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.05 }}
      >
        <h3 className={`text-${color}`}>{loan.borrowed_name}</h3>
        <p className={`text-lg text-${color} font-bold`}>
          {formatCurrency(loan.amount)}
        </p>
        <Badge color={color}>{loan.status}</Badge>
      </motion.div>
    );
  })}
</motion.div>
```

## Technical Stack (Enhanced)

### Frontend Dependencies

```json
{
  "framer-motion": "^10.16.0",      // Advanced animations
  "lucide-react": "^0.263.1",       // Enhanced icon library
  "recharts": "^2.10.0",            // Charts
  "next": "^14.0.0",                // React framework
  "typescript": "^5.3.0",           // Type safety
  "axios": "^1.6.0"                 // API client
}
```

### CSS Architecture - Enhanced

- **Single global CSS file**: `app/globals.css` (1100+ lines)
- **Color Palette**: 12 primary + 5 accent CSS variables
- **Animation System**: 8+ keyframe animations
- **Semantic class names**: BEM-like convention
- **Utility Classes**: 60+ reusable utilities
- **Icon Animation Classes**: 8+ animation types
- **Responsive Design**: Mobile-first approach
- **Dark Theme Only**: All backgrounds dark (#0A0A0F)

## File Structure

```
frontend/
├── app/
│   ├── globals.css          # All CSS (1100+ lines) ✨ REVAMPED
│   ├── layout.tsx           # Root layout with nav
│   ├── page.tsx             # Home/redirect
│   ├── login/
│   │   └── page.tsx         # Login form
│   ├── dashboard/
│   │   └── page.tsx         # Dashboard wrapper
│   ├── loans/
│   │   ├── page.tsx         # Loans list with animations
│   │   ├── new/
│   │   └── [id]/
│   └── customers/
│       ├── page.tsx         # Customers list
│       ├── new/
│       └── [id]/
├── components/
│   ├── ui/
│   │   ├── Icon.tsx         # ✨ ENHANCED - 8+ animations
│   │   ├── Button.tsx       # Updated colors
│   │   ├── Card.tsx         # Shimmer effects
│   │   ├── Modal.tsx        # Modal component
│   │   ├── Badge.tsx        # 8+ variants
│   │   └── Skeleton.tsx     # Skeleton loader
│   ├── AdminDashboard.tsx   # Animated stats
│   └── UserDashboard.tsx    # User stats
├── lib/
│   ├── apiClient.ts         # API calls
│   └── auth.ts              # Dev mode auth
├── .env.local               # Dev mode enabled
└── package.json             # Dependencies
```

## Deployment Checklist

- ✅ **Dev Mode**: NEXT_PUBLIC_DEV_MODE=true for testing
- ✅ **Color Scheme**: Crimson #DC2626 as primary
- ✅ **Icon Animations**: 8 new animation types implemented
- ✅ **Record Animations**: Stagger effects on render
- ✅ **Dark Theme**: All backgrounds dark (#0A0A0F)
- ✅ **Semantic Colors**: Proper contrast ratios (WCAG AA)
- ✅ **Responsive**: Mobile-first design
- ✅ **Performance**: CSS-in-CSS (no JS runtime styles)
- ✅ **Accessibility**: Focus states, ARIA labels, keyboard nav
- ✅ **Error Handling**: Alerts with icons
- ✅ **Loading States**: Skeleton screens with shimmer

## Animation Showcase

### Page Transitions
- Fade in: 0.3s ease-out
- Scale + Y translate: 0.4s ease
- Smooth header animations

### Record Render Animations
- Stagger children: 0.05s between items
- Individual delay: idx * 0.05s
- Scale 0.95 → 1 with fade
- Y translate 20px → 0

### Icon Animations
- Spin: 1s, 3s, or 0.6s duration options
- Bounce: 0.8s continuous
- Glow: 2s box-shadow pulse
- Wobble: 0.6s rotation wobble
- Ping: 1s opacity pulse

### Hover Effects
- Record tiles: -4px Y translate
- Crimson glow effect
- Shimmer overlay (linear gradient)
- Border color change

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- CSS Variables support required
- CSS Grid support required
- Backdrop-filter support recommended

## Performance Optimizations

- **Bundle Size**: Handcrafted CSS (no Tailwind)
- **Animations**: Hardware-accelerated transforms
- **Skeleton Screens**: Better perceived performance
- **Lazy Loading**: Images lazy load by default
- **Responsive**: Mobile-optimized
- **No Runtime Styles**: Pure CSS utilities

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Dev mode enabled: `NEXT_PUBLIC_DEV_MODE=true`
3. ✅ Run dev server: `npm run dev`
4. ✅ Test all animations: Check icon spinning, bouncing, glowing
5. ✅ Verify color scheme: Crimson primary throughout
6. ✅ E2E testing: All routes accessible without auth
7. Deploy to production (set NEXT_PUBLIC_DEV_MODE=false)

## 🇰🇪 Currency Localization Implementation

### Kenyan Shilling (KES) - Complete Implementation

**Official Currency:** Kenyan Shilling (KES)  
**Exchange Rate Reference:** ~1 USD ≈ 130 KES (used for demo data scaling)  
**Currency Symbol:** "KES " (with space) or "Ksh"  
**Formatting:** Number format with comma separators and 2 decimal places  
**Display Format:** `KES 1,234,567.89` or `KES 1.95M` for large amounts

### Currency Implementation Rules

**1. Display Formatting Function**

All monetary values across the frontend should use a standardized formatting function:

```typescript
// lib/currency.ts
export const formatCurrency = (amount: number, compact = false): string => {
  if (compact && amount >= 1000000) {
    return `KES ${(amount / 1000000).toFixed(1)}M`;
  }
  if (compact && amount >= 1000) {
    return `KES ${(amount / 1000).toFixed(0)}K`;
  }
  return `KES ${amount.toLocaleString('en-KE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

// Usage examples
formatCurrency(650000) // "KES 650,000"
formatCurrency(1950000, true) // "KES 1.95M"
formatCurrency(162500000, true) // "KES 162.5M"
formatCurrency(1234567.89) // "KES 1,234,567.89"
```

**2. API Response Handling**

Backend API returns amounts in KES (never convert from USD in frontend):

```typescript
// When fetching loans:
{
  "id": 1,
  "amount": 650000,  // Already in KES from backend
  "borrowed_name": "Kamau Njoroge",
  "monthly_income": 130000,  // KES per month
  "status": "approved",
  "currency": "KES"
}

// Frontend displays:
<span className="text-primary font-bold">
  {formatCurrency(loan.amount)} {/* "KES 650,000" */}
</span>
```

**3. Demo Data Amounts (All KES)**

| Category | Amount | Usage |
|----------|--------|-------|
| Large Loan | KES 975,000 | Grace Wanjiru (healthcare) |
| Standard Loan | KES 650,000 | Kamau Njoroge (business) |
| Small Loan | KES 390,000 | James Kariuki (agriculture) |
| Monthly Income | KES 130,000 - 175,000 | Customer profiles |
| Total Admin Disbursed | KES 162,500,000 | Dashboard KPI |
| User Total Borrowed | KES 1,950,000 | User dashboard |

**4. Component Currency Usage**

```typescript
// AdminDashboard.tsx - Total disbursed in KES
<Card>
  <h3>Total Disbursed</h3>
  <p className="text-2xl font-bold text-secondary">
    {formatCurrency(162500000, true)} {/* "KES 162.5M" */}
  </p>
</Card>

// Loans list card
<div className="record-tile">
  <h3>{loan.borrowed_name}</h3>
  <p className="text-lg text-primary font-bold">
    {formatCurrency(loan.amount)} {/* "KES 650,000" */}
  </p>
  <span className="text-muted text-sm">
    Rate: {loan.interest_rate}% • Term: {loan.term_months} months
  </span>
</div>

// Customer income display
<div>
  <label className="text-muted">Monthly Income</label>
  <p className="text-lg font-bold">
    {formatCurrency(customer.monthly_income)} {/* "KES 130,000" */}
  </p>
</div>
```

**5. Phone Number Localization (Kenyan Format)**

```typescript
export const formatPhoneKE = (phone: string): string => {
  // Convert to +254 format if 10-digit local number
  if (phone.match(/^07\d{8}$/)) {
    return `+254 ${phone.slice(1)}`;
  }
  return phone;
};

// Demo data phone format: +254 7XX XXX XXX
// Examples:
// +254 712 345 678 (Safaricom)
// +254 724 567 890 (Airtel)
// +254 741 234 567 (Equity Bank Mobile)
```

**6. Location Localization (Kenyan Cities)**

Demo data uses authentic Kenyan locations:

| Customer | Location | Region | 
|----------|----------|--------|
| Kamau Njoroge | Nairobi | Central |
| Grace Wanjiru | Nairobi | Central |
| James Kariuki | Nakuru | Rift Valley |
| Fatima Mohamed | Mombasa | Coast |
| Peter Ochieng | Kisumu | Western |

**7. Date Format (Kenyan)**

```typescript
export const formatDateKE = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-KE', {
    year: 'numeric',
    month: 'short',  // 'Mar'
    day: 'numeric',  // '14'
  }).format(new Date(date));
};

// Examples:
// "14 Mar 2026" (actual Kenyan format)
// "14 Mar 2025" (loan creation date)
```

**8. Localization Checklist**

- ✅ All monetary amounts in KES (minimum 0 decimals for display)
- ✅ Currency symbol "KES " prefixed to all amounts
- ✅ Phone numbers in +254 XXXXXXXXX format
- ✅ Cities: Nairobi, Kisumu, Mombasa, Nakuru (authentic Kenyan locations)
- ✅ Names: Kamau, Grace, James, Fatima, Peter (authentic Kenyan names)
- ✅ Date format: MMM DD, YYYY (e.g., "Mar 14, 2026")
- ✅ Locale for number formatting: 'en-KE'

---

## Environment Configuration

### Frontend Environment Variables (`.env.local`)

**Development Mode:**
```env
# Development environment (.env.local)
NEXT_PUBLIC_DEV_MODE=true
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_CURRENCY=KES
NEXT_PUBLIC_APP_NAME=Mkopo Kenya
NEXT_PUBLIC_LOCALE=en-KE
```

**Production Mode:**
```env
# Production environment (.env.production)
NEXT_PUBLIC_DEV_MODE=false
NEXT_PUBLIC_API_URL=https://api.mkopo.ke/api
NEXT_PUBLIC_CURRENCY=KES
NEXT_PUBLIC_APP_NAME=Mkopo Kenya
NEXT_PUBLIC_LOCALE=en-KE
```

**Environment-Specific Behavior:**
- `NEXT_PUBLIC_DEV_MODE=true`: All routes accessible, no login required, fallback data used on API errors
- `NEXT_PUBLIC_DEV_MODE=false`: Authentication required, login redirect enforced, no fallback data

### Backend Environment Variables

**Development Mode (`.env.local`)**
```env
# Django Core
DEBUG=True
DEVELOPMENT_MODE=True
SECRET_KEY=django-insecure-dev-only-change-in-production
ALLOWED_HOSTS=localhost,127.0.0.1,0.0.0.0

# Database - Development (SQLite)
DATABASE_URL=sqlite:///db.sqlite3

# CORS - Allow frontend dev server
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# API Configuration
REST_FRAMEWORK_DEFAULT_AUTHENTICATION=src.auth.DevAuthentication
REST_FRAMEWORK_DEFAULT_PERMISSION=src.permissions.DevPermission

# Logging & Error Reporting
LOG_LEVEL=DEBUG
ENABLE_ERROR_EMAIL=False
```

**Production Mode (`.env.production`)**
```env
# Django Core
DEBUG=False
DEVELOPMENT_MODE=False
SECRET_KEY=<strong-random-key-from-secrets-manager>
ALLOWED_HOSTS=api.mkopo.ke,mkopo.ke

# Database - PostgreSQL Production
DATABASE_URL=postgres://user:password@db-host:5432/mkopo_prod

# CORS - Only production frontend
CORS_ALLOWED_ORIGINS=https://mkopo.ke,https://www.mkopo.ke

# API Configuration
REST_FRAMEWORK_DEFAULT_AUTHENTICATION=rest_framework_simplejwt.authentication.JWTAuthentication
REST_FRAMEWORK_DEFAULT_PERMISSION=rest_framework.permissions.IsAuthenticated

# Logging & Error Reporting
LOG_LEVEL=WARNING
ENABLE_ERROR_EMAIL=True
ERROR_EMAIL_TO=ops@mkopo.ke

# JWT Settings
JWT_ALGORITHM=HS256
JWT_EXPIRATION_DELTA=3600

# SSL/Security
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
```

### Backend Development Mode Features

**1. DevAuthentication (Dev-Only)**

Located in `backend/src/auth.py`:
```python
class DevAuthentication(authentication.BaseAuthentication):
    """
    Allow all requests in development mode.
    Automatically creates a test user with admin privileges.
    """
    def authenticate(self, request):
        # In dev mode, skip JWT validation
        # Return a mock user object
        user = User.objects.filter(username='dev_admin').first()
        if not user:
            user = User.objects.create_superuser(
                username='dev_admin',
                email='dev@mkopo.local',
                password='dev123'
            )
        return (user, None)
```

**2. DevPermission (Dev-Only)**

Located in `backend/src/permissions.py`:
```python
class DevPermission(permissions.BasePermission):
    """
    Allow all operations in development mode.
    """
    def has_permission(self, request, view):
        return True  # Dev mode bypasses all permission checks

    def has_object_permission(self, request, view, obj):
        return True
```

**3. DevAuthMiddleware (Dev-Only)**

Located in `backend/src/middleware.py`:
```python
class DevAuthMiddleware:
    """
    Middleware to bypass authentication in development mode.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if settings.DEVELOPMENT_MODE:
            # Skip authentication checks in dev mode
            request.user = User.objects.filter(username='dev_admin').first()
        return self.get_response(request)
```

**4. Development Mode API Responses**

All API endpoints return mock data in development mode when database is unavailable:

```python
# Example: /api/loans/ endpoint
{
    "data": [
        {
            "id": 1,
            "borrowed_name": "Kamau Njoroge",
            "amount": 650000,  # KES
            "status": "approved",
            "interest_rate": 12.5,
            "term_months": 24,
            "monthly_payment": 30625,  # KES
            "currency": "KES"
        },
        {
            "id": 2,
            "borrowed_name": "Grace Wanjiru",
            "amount": 975000,  # KES
            "status": "approved",
            "interest_rate": 11.0,
            "term_months": 36,
            "monthly_payment": 31700,  # KES
            "currency": "KES"
        }
    ]
}
```

### Backend Production Mode Features

**1. JWT Authentication (Prod-Only)**

```python
# Production uses DRF-SimpleJWT
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
}

# JWT_SETTINGS in settings.py:
SIMPLE_JWT = {
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
}
```

**2. Production Permission Enforcement**

```python
class ProductionPermissions(permissions.BasePermission):
    """
    Production-only permissions:
    - All requests require JWT token
    - User can only access their own data
    - Loan officers can access customer data
    - Admins have full access
    """
    def has_permission(self, request, view):
        # Token required
        return bool(request.user and request.user.is_authenticated)

    def has_object_permission(self, request, view, obj):
        # Users can only access their own data
        if request.user.role == 'customer':
            return obj.user_id == request.user.id
        # Loan officers can access all customer data
        elif request.user.role == 'loan_officer':
            return True
        # Admins have full access
        return request.user.is_staff
```

**3. Production Database (PostgreSQL)**

Requires external PostgreSQL database in production:

```bash
# Production database setup
createdb mkopo_prod
python manage.py migrate --no-input
python manage.py collectstatic --no-input
gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 4
```

### API Communication Patterns

**Development Mode (Frontend → Backend)**

```typescript
// lib/apiClient.ts in frontend
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});

// No auth headers needed in dev mode
const response = await apiClient.get('/loans/');
// Returns mock data if API unavailable
```

**Production Mode (Frontend → Backend)**

```typescript
// Production uses JWT authentication
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 5000,
});

// Add JWT token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh token on 401 response
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        const newTokens = await apiClient.post('/token/refresh/', {
          refresh,
        });
        localStorage.setItem('access_token', newTokens.data.access);
        // Retry original request
        return apiClient(error.config);
      }
    }
    return Promise.reject(error);
  }
);
```

### Deployment Checklist

**Frontend Deployment**

- [ ] `NEXT_PUBLIC_DEV_MODE=false` in production env
- [ ] `NEXT_PUBLIC_API_URL` pointing to production backend
- [ ] Remove all console.log statements from production code
- [ ] Run `npm run build` and verify no errors
- [ ] Test all pages require authentication (login redirects work)
- [ ] Currency formatting set to KES
- [ ] Phone number format validation for +254 numbers
- [ ] Date formatting set to en-KE locale

**Backend Deployment**

- [ ] `DEBUG=False` in production
- [ ] `DEVELOPMENT_MODE=False` in production
- [ ] `SECRET_KEY` from secure secrets manager (not hardcoded)
- [ ] Database migrated with `python manage.py migrate --no-input`
- [ ] Static files collected with `python manage.py collectstatic --no-input`
- [ ] CORS_ALLOWED_ORIGINS limited to production frontend domain
- [ ] JWT authentication enforced (not DevAuthentication)
- [ ] SSL/HTTPS enabled (`SECURE_SSL_REDIRECT=True`)
- [ ] Database URL uses production PostgreSQL
- [ ] Error emails configured for production monitoring
- [ ] Run with gunicorn + nginx reverse proxy

---

## Color Diversity Guidelines - MANDATORY FOR ALL DEVELOPERS

### ❌ AVOID: Single Color for Everything

```tsx
// BAD: All buttons use the same color
<Button color="crimson">Create</Button>
<Button color="crimson">Edit</Button>
<Button color="crimson">Delete</Button>
<Button color="crimson">View</Button>

// BAD: All cards have identical styling
<Card border="crimson">Loan 1</Card>
<Card border="crimson">Loan 2</Card>
<Card border="crimson">Loan 3</Card>

// BAD: All badges are the same
<Badge color="primary">Status 1</Badge>
<Badge color="primary">Status 2</Badge>
<Badge color="primary">Status 3</Badge>
```

### ✅ DO: Use Diverse Colors Based on Context

**By Entity Status:**
```tsx
// Loan Status - Use color coding
<LoanCard status="approved" color="emerald" />   {/* Green #10B981 */}
<LoanCard status="pending" color="amber" />      {/* Amber #F59E0B */}
<LoanCard status="rejected" color="rose" />      {/* Rose #F43F5E */}
<LoanCard status="under-review" color="sky" />   {/* Sky #0EA5E9 */}
<LoanCard status="disbursed" color="lime" />     {/* Lime #84CC16 */}
<LoanCard status="urgent" color="crimson" />     {/* Crimson #DC2626 */}
```

**By Customer Type:**
```tsx
// Customer Type - Use color variation
<CustomerCard type="vip" color="violet" />       {/* Purple #A855F7 */}
<CustomerCard type="premium" color="fuchsia" />  {/* Pink #EC4899 */}
<CustomerCard type="standard" color="indigo" />  {/* Indigo #6366F1 */}
<CustomerCard type="new" color="sky" />          {/* Sky #0EA5E9 */}
<CustomerCard type="active" color="lime" />      {/* Lime #84CC16 */}
```

**By Action Type:**
```tsx
// Actions - Use semantic colors
<Button action="create" color="crimson" />       {/* Create = Red #DC2626 */}
<Button action="edit" color="orange" />          {/* Edit = Orange #F97316 */}
<Button action="view" color="cyan" />            {/* View = Cyan #06B6D4 */}
<Button action="approve" color="emerald" />      {/* Approve = Green #10B981 */}
<Button action="reject" color="rose" />          {/* Reject = Rose #F43F5E */}
<Button action="help" color="blue" />            {/* Help = Blue #3B82F6 */}
<Button action="featured" color="violet" />      {/* Featured = Purple #A855F7 */}
```

### Color Mapping Reference

**Loan Status** → Use color:
- approved → `emerald` (#10B981)
- pending → `amber` (#F59E0B)
- rejected → `rose` (#F43F5E)
- urgent → `crimson` (#DC2626)
- under_review → `sky` (#0EA5E9)
- disbursed → `lime` (#84CC16)
- featured → `violet` (#A855F7)

**Customer Status** → Use color:
- vip → `violet` (#A855F7)
- premium → `fuchsia` (#EC4899)
- standard → `indigo` (#6366F1)
- active → `lime` (#84CC16)
- inactive → slate (gray)
- new → `sky` (#0EA5E9)

**Priority Level** → Use color:
- critical/high → `crimson` (#DC2626)
- medium → `orange` (#F97316)
- low → `cyan` (#06B6D4)

**Action Impact** → Use color:
- destructive → `rose` or `crimson`
- positive → `emerald` or `lime`
- neutral → `cyan` or `blue`
- special → `violet` or `fuchsia`
- warning → `amber`
- info → `sky` or `blue`

### Implementation Checklist

- [ ] No component uses the same color for all instances
- [ ] Loan cards are color-coded by status (not all same color)
- [ ] Customer cards vary by customer type
- [ ] Action buttons use semantic colors (create=red, edit=orange, delete=crimson)
- [ ] Badge colors indicate meaning (success=green, warning=amber, error=red)
- [ ] Icons are color-coded to match their context
- [ ] All 12 colors in palette are used across the app
- [ ] Color choices help users quickly understand meaning
- [ ] No color is over-used (any single color max ~20% of interface)
- [ ] Color distribution is balanced across pages

### Examples by Page

**Loans Page** - Multiple colors:
```tsx
{loans.map(loan => (
  <motion.div
    key={loan.id}
    className={`record-tile border-l-4 border-${LoanStatusColorMap[loan.status]}`}
  >
    <h3 className={`text-${LoanStatusColorMap[loan.status]}`}>
      {loan.borrower_name}
    </h3>
    <Badge color={LoanStatusColorMap[loan.status]}>
      {loan.status}
    </Badge>
  </motion.div>
))}
```

**Customers Page** - Multiple colors:
```tsx
{customers.map(customer => (
  <motion.div
    key={customer.id}
    className={`record-tile border-l-4 border-${CustomerTypeColorMap[customer.type]}`}
  >
    <h3 className={`text-${CustomerTypeColorMap[customer.type]}`}>
      {customer.name}
    </h3>
    <Badge color={CustomerTypeColorMap[customer.type]}>
      {customer.type}
    </Badge>
  </motion.div>
))}
```

**Dashboard** - KPI colors:
```tsx
<Card borderColor="crimson">      {/* Critical: Total at Risk */}
  <h3>At Risk Amount</h3>
  <p className="text-crimson">KES 2.5M</p>
</Card>

<Card borderColor="emerald">      {/* Success: Total Approved */}
  <h3>Approved Loans</h3>
  <p className="text-emerald">45 loans</p>
</Card>

<Card borderColor="amber">        {/* Attention: Pending Items */}
  <h3>Pending Review</h3>
  <p className="text-amber">12 loans</p>
</Card>

<Card borderColor="violation">    {/* Special: Featured Count */}
  <h3>VIP Customers</h3>
  <p className="text-violet">8 customers</p>
</Card>
```

---

## DSS Compliance Checklist (v2.0)

- ✅ Crimson red primary color (#DC2626)
- ✅ Diverse accent palette (12 colors: orange, cyan, violet, blue, emerald, lime, amber, rose, fuchsia, indigo, sky)
- ✅ **ALL 12 colors used throughout the application (NOT single color)**
- ✅ **Color diversity enforced by status/type/context (mandatory)**
- ✅ **Loan cards color-coded by status (emerald/amber/rose/sky/lime/crimson/violet)**
- ✅ **Customer cards color-coded by type (violet/fuchsia/indigo/sky/lime)**
- ✅ **Action buttons use semantic colors (crimson/orange/cyan/emerald/rose/blue/violet)**
- ✅ **Badge variants use distinct colors based on meaning**
- ✅ **Icon colors match their context and urgency**
- ✅ Dark theme only (#0A0A0F backgrounds)
- ✅ No white backgrounds
- ✅ All colors from revamped DSS palette
- ✅ Semantic class names (no inline styles)
- ✅ Single global CSS file
- ✅ Lucide icons with 8+ animation types
- ✅ Modal transparency & glass morphism
- ✅ Loading states on all async operations
- ✅ Advanced animations with Framer Motion
- ✅ Icon animation utilities (spin, bounce, glow, wobble, ping)
- ✅ Record tile shimmer effects
- ✅ Staggered render animations
- ✅ Proper focus/accessibility states
- ✅ Hover effects on interactive elements
- ✅ Responsive utility classes
- ✅ Dark scrollbars (crimson accent)
- ✅ Consistent typography
- ✅ Dev mode fully enabled
- ✅ Currency localization (KES throughout)
- ✅ Kenyan formatting (phone, location, names)
- ✅ Backend dev/prod mode configuration
- ✅ Environment variables documented
- ✅ API communication patterns documented

---

### 1. Global Styles (`app/globals.css`)

**650+ lines** of CSS following the DSS specification:

- **Color Palette**: All 12 DSS colors as CSS variables
- **Typography**: Heading styles (h1-h6) and text utilities
- **Utilities**: Spacing, layout (flexbox/grid), sizing, text styling
- **Components**: Cards, buttons (4 variants), inputs, badges
- **Animations**: spin, pulse, shimmer, slideIn, fadeIn
- **Modal styling**: Dark backdrop with glass morphism effect
- **Tables**: Dark theme with hover effects
- **Accessibility**: Focus-visible states, scrollbar styling

### 2. Reusable UI Components (`components/ui/`)

#### **Icon.tsx**
- Lucide React icon wrapper
- Supports animation (spin, pulse)
- 5 color variants (primary, secondary, muted, success, error)
- Default 20px size, customizable

#### **Button.tsx**
- 4 variants: primary, secondary, tertiary, outline
- 3 sizes: sm, md, lg
- Loading state support
- Full width option

#### **Card.tsx**
- Surface component with optional hover effect
- Border and background colors from DSS
- Used for all data containers

#### **Modal.tsx**
- Framer Motion animations
- Semi-transparent backdrop with blur
- Smooth entrance/exit transitions
- Optional header with close button

#### **Badge.tsx**
- 5 semantic variants matching DSS colors
- Used for status indicators

#### **Skeleton.tsx**
- Shimmer animation loading state
- Customizable height and count
- Avatar variant for circular skeletons

### 3. Updated Pages

#### **login/page.tsx** ✨
- Icon-enhanced form fields
- Animated entrance (staggered motion)
- Error alert with icon
- Demo credentials displayed
- Loading button state

#### **page.tsx** (Home/Redirect)
- Animated loading spinner
- Smooth redirect animations
- Dark theme compliant

#### **dashboard/page.tsx** ✨
- Header with icon and description
- Skeleton loading states for stats
- Responsive layout
- Animated content reveal

#### **AdminDashboard.tsx** ✨
- 3 stat cards with icons (hover effect)
- Chart with DSS-themed colors
- Motion-sequenced animations
- Proper error handling

#### **UserDashboard.tsx** ✨
- 2 stat cards for user metrics
- Recent loans table with:
  - Motion-sequenced rows
  - Status badges with proper variants
  - Formatted dates and currency
  - Empty state message

#### **loans/page.tsx** ✨
- Filterable loan list by status
- Loan cards showing all key details
- Search/filter functionality
- Empty state with CTA
- Motion animations for list items

#### **customers/page.tsx** ✨
- Customer grid layout (2 columns)
- Search by name or email
- Customer cards with key info:
  - Name, email, phone
  - Employment status and income
  - Join date
  - View button for details
- Empty state with CTA

### 4. Layout Enhancement (`layout.tsx`)

- Navigation bar with DSS colors
- Semantic navigation links
- Sticky top positioning
- Proper container sizing
- Dark theme applied

## Technical Stack

### Frontend Dependencies

```json
{
  "framer-motion": "^10.16.0",      // Page transitions & animations
  "lucide-react": "^0.263.1",       // Icon library
  "recharts": "^2.10.0",            // Charts (already had)
  "next": "^14.0.0",                // React framework
  "typescript": "^5.3.0",           // Type safety
  "axios": "^1.6.0"                 // API client
}
```

### CSS Architecture

- **Single global CSS file**: `app/globals.css`
- **No CSS Modules or styled-components**: Everything uses semantic class names
- **CSS Variables**: 12 color variables for easy theming
- **BEM-like Naming**: `block__element--modifier` convention
- **Utility Classes**: 50+ reusable utilities (spacing, layout, text, etc.)

## Color System

| Role | Hex Code | Usage |
|------|----------|-------|
| Background | #0A0A0F | Primary page background |
| Surface | #1A1A2A | Cards, sidebars |
| Elevated | #242438 | Hover states, modals |
| Primary | #7C3AED | Vibrant purple buttons, links |
| Secondary | #EC4899 | Pink accents, highlights |
| Tertiary | #3B82F6| Blue info elements |
| Text | #F8FAFC | Off-white readable text |
| Text Muted | #94A3B8 | Secondary text |
| Border | #2D2D44 | Subtle dividers |
| Success | #10B981 | Green success states |
| Warning | #F59E0B | Amber warnings |
| Error | #EF4444 | Red errors |

## Animation System

### Keyframe Animations
- `spin`: 1s full rotation (used for loading spinners)
- `pulse`: 1.5s opacity pulse (idle indicators)
- `shimmer`: 2s gradient slide (skeleton loading)
- `slideIn`: 0.3s translateY + fade
- `fadeIn`: 0.3s opacity only

### Framer Motion Usage
- **Page Transitions**: Scale, opacity, and slide combined
- **Modal Entrance**: Spring animation with damping
- **List Items**: Staggered child animations
- **Stat Cards**: Sequential delay-based reveals

## Component Usage Examples

### Icon Component
```tsx
<Icon name="Banknote" size={24} color="primary" animate="spin" />
```

### Button Component
```tsx
<Button variant="primary" size="lg" isLoading={isLoading} fullWidth>
  <Icon name="Plus" size={18} />
  <span>Create Loan</span>
</Button>
```

### Modal Component
```tsx
<Modal isOpen={isOpen} onClose={onClose} title="Confirm Action" size="md">
  <p>Are you sure?</p>
  <div className="modal-footer">
    <Button variant="outline" onClick={onClose}>Cancel</Button>
    <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
  </div>
</Modal>
```

### Card Component
```tsx
<Card hoverable className="flex-between">
  <h3 className="text-lg font-bold text-primary">Total Loans</h3>
  <Icon name="Banknote" size={32} color="primary" />
</Card>
```

### Loading State
```tsx
{loading ? (
  <Skeleton count={5} height="1rem" />
) : (
  <div>{content}</div>
)}
```

## Development Guidelines

### Adding New Pages

1. Import motion from 'framer-motion'
2. Apply DSS classes (no inline styles)
3. Use reusable UI components
4. Wrap page in `motion.div` for animations
5. Add error handling with alert component

### Creating New Components

1. Create in `components/ui/` if reusable
2. Use DSS color utilities (text-primary, bg-surface, etc.)
3. Import Icon component for icons
4. Export TypeScript types for props

### Adding Animations

1. Use `.animate-spin`, `.animate-pulse` classes for CSS
2. Use Framer Motion for complex animations
3. Stagger children with `transition={{ delay }}`
4. Keep animations under 400ms for user interactions

### Handling Loading States

1. Use `<Skeleton>` component or loading spinners
2. Show shimmer animation during data fetch
3. Display error alerts for failed requests
4. Include motion animations for smooth transitions

## File Structure

```
frontend/
├── app/
│   ├── globals.css          # All CSS (650+ lines)
│   ├── layout.tsx           # Root layout with nav
│   ├── page.tsx             # Home/redirect
│   ├── login/
│   │   └── page.tsx         # Login form
│   ├── dashboard/
│   │   └── page.tsx         # Dashboard wrapper
│   ├── loans/
│   │   ├── page.tsx         # Loans list
│   │   ├── new/
│   │   └── [id]/
│   └── customers/
│       ├── page.tsx         # Customers list
│       ├── new/
│       └── [id]/
├── components/
│   ├── ui/
│   │   ├── Icon.tsx         # Icon wrapper
│   │   ├── Button.tsx       # Button component
│   │   ├── Card.tsx         # Card component
│   │   ├── Modal.tsx        # Modal component
│   │   ├── Badge.tsx        # Badge component
│   │   └── Skeleton.tsx     # Skeleton loader
│   ├── AdminDashboard.tsx   # Admin stats
│   └── UserDashboard.tsx    # User stats
├── lib/
│   ├── apiClient.ts         # API calls
│   └── auth.ts              # Auth utilities
└── package.json             # Dependencies
```

## Performance Optimizations

- **CSS-in-CSS**: Single global file (no JS runtime styles)
- **Utility Classes**: Reusable, no duplication
- **No Tailwind**: Lighter bundle (handcrafted utilities)
- **Framer Motion**: Only essential animations (optimized)
- **Skeleton Screens**: Better perceived performance
- **Image Lazy Loading**: Built into Next.js

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- CSS Variables support required

## Next Steps

1. Run `npm install` to install new dependencies
2. Run `npm run dev` to start dev server
3. Test all pages for visual consistency
4. Add page transition for remaining pages (loans/customers detail pages)
5. Implement form styling for `new/` pages

## DSS Compliance Checklist

- ✅ Dark theme only (#0A0A0F backgrounds)
- ✅ No white backgrounds
- ✅ All colors from DSS palette
- ✅ Semantic class names (no inline styles)
- ✅ Single global CSS file
- ✅ Lucide icons for consistency
- ✅ Modal transparency & glass morphism
- ✅ Loading states on all async operations
- ✅ Smooth animations with Framer Motion
- ✅ Proper focus/accessibility states
- ✅ Hover effects on interactive elements
- ✅ Responsive utility classes
- ✅ Dark scrollbars
- ✅ Consistent typography

---
1. Refine Grid & Tile Sizing for Records
Your current implementation uses a simple grid for customers and cards for loans. To make it truly logical and scalable:

Use a responsive CSS Grid with grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) so tiles automatically adjust to screen size. For tables, consider a min-width on columns to avoid squashing.

Establish a consistent sizing scale based on a 4px or 8px grid. For example:

Tile padding: p-6 (1.5rem / 24px)

Tile border radius: rounded-xl (1rem / 16px)

Gap between tiles: gap-6

Differentiate tile types visually:

Customer tiles: include avatar placeholder, name, email, and key metrics.

Loan tiles: show amount, status, term, and a progress bar for repayment.

For data‑dense views (e.g., loans table), keep the table but add:

Sticky header

Horizontal scroll on mobile

Row hover effect with subtle background change

Example CSS addition (to globals.css):

css
.record-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.record-tile {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  padding: 1.5rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.record-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
}
2. Elevate Color Implementation for Text & Backgrounds
Your current palette is strong, but we can apply it more systematically to improve readability and visual weight.

Text contrast: Ensure all text on colored backgrounds meets WCAG AA standards. Use rgba overlays for backgrounds if needed.

Semantic color mapping:

Primary text (headings, important labels) → var(--color-text)

Secondary text (metadata, hints) → var(--color-text-muted)

Status badges: success (var(--color-success)), warning (var(--color-warning)), error (var(--color-error))

Background layering:

Page background: var(--color-background)

Cards/surfaces: var(--color-surface)

Hover states: var(--color-elevated)

Modals: var(--color-surface) with backdrop-filter: blur(8px) on the overlay

Accent colors should be used sparingly—only for primary actions, active states, and key data points.

Example badge refinement:

css
.badge-success {
  background: rgba(16, 185, 129, 0.15); /* 15% opacity for subtlety */
  color: var(--color-success);
  border: 1px solid rgba(16, 185, 129, 0.3);
}
This keeps the badge readable without overwhelming the card.

3. Enhance Typography Hierarchy
Define a type scale (e.g., 1.25 ratio):

h1: 2.5rem / 40px

h2: 2rem / 32px

h3: 1.5rem / 24px

body: 1rem / 16px

small: 0.875rem / 14px

Use font weight to differentiate: bold (600) for headings, medium (500) for active items, regular (400) for body.

Line height: 1.5 for body, 1.2 for headings.

Letter spacing: headings -0.02em for tighter look.

Add these as utility classes in globals.css (you already have some, but ensure consistency).

4. Improve Data Presentation & Empty States
Format all monetary values with currency symbol and two decimals (e.g., $12,345.67).

Dates should be human‑readable: MMM DD, YYYY (e.g., Mar 14, 2026).

Add icons to data fields for quick recognition (e.g., calendar for date, money icon for amount).

Empty states:

Show an illustration or icon (use Lucide Inbox or FolderOpen)

Friendly message: “No loans found” + a CTA button to create one

Keep the same card style to maintain layout integrity

Example empty state component (reusable):

tsx
<Card className="text-center py-12">
  <Icon name="Inbox" size={48} color="muted" className="mx-auto mb-4" />
  <h3 className="text-lg font-medium text-muted">No records yet</h3>
  <p className="text-muted mt-2">Get started by creating your first loan.</p>
  <Button variant="primary" className="mt-6">Create Loan</Button>
</Card>
5. Loading & Error States – Make Them Seamless
Skeleton screens should mimic the final layout exactly (same dimensions, border radius).

Use a shimmer effect that moves across the placeholder.

Error alerts:

Use a banner at the top of the relevant section, not a modal (unless critical).

Include a retry button.

Color: var(--color-error) with a light red background (10% opacity).

Example error banner:

css
.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border-left: 4px solid var(--color-error);
  color: var(--color-error);
  padding: 1rem;
  border-radius: 0.5rem;
}
6. Add Interactive Polish
Hover effects:

Buttons: slight scale (transform: scale(1.02)) and brighter background.

Cards: shadow increase and border color change.

Focus states for accessibility: use a box-shadow ring in primary color.

Transitions on all interactive elements: transition: all 0.2s ease.

7. Implement Advanced List Features (Optional but Powerful)
To truly “improve ten fold”, consider adding:

Sorting: Clickable table headers to sort by amount, date, status.

Filtering: Dropdown or chip filters for status, date range.

Pagination or infinite scroll for large datasets.

Search with debounced input to reduce API calls.

These can be built with React hooks and your existing API client.

8. Accessibility Audit
Ensure all color contrasts meet WCAG AA (use tools like Contrast Checker).

Add aria-labels to icon buttons.

Make sure focus indicators are visible.

Test keyboard navigation (Tab through the page).

9. Performance Optimizations
Lazy load images and components below the fold.

Use React.memo for pure components that render often.

Debounce search inputs.

Virtualize long lists with react-window if needed.

10. Consistency Across All Pages
Apply the same tile/card design to loans, customers, and any future entities.

Use the same spacing, border radius, and hover effects everywhere.

Create a design tokens section in your CSS to enforce consistency.

Summary of Code Additions to globals.css
css
/* Add to your existing globals.css */

/* Record Grid */
.record-grid { ... }
.record-tile { ... }

/* Typography scale */
.text-display { font-size: 2.5rem; line-height: 1.2; font-weight: 600; }
.text-title   { font-size: 2rem; line-height: 1.3; font-weight: 600; }
.text-heading { font-size: 1.5rem; line-height: 1.4; font-weight: 500; }
.text-body    { font-size: 1rem; line-height: 1.5; }
.text-small   { font-size: 0.875rem; line-height: 1.5; color: var(--color-text-muted); }

/* Empty state */
.empty-state { ... }

/* Error alert */
.alert-error { ... }

/* Enhanced badge variants */
.badge-success { background: rgba(16, 185, 129, 0.15); color: var(--color-success); border: 1px solid rgba(16, 185, 129, 0.3); }
.badge-warning { background: rgba(245, 158, 11, 0.15); color: var(--color-warning); border: 1px solid rgba(245, 158, 11, 0.3); }
.badge-error   { background: rgba(239, 68, 68, 0.15); color: var(--color-error); border: 1px solid rgba(239, 68, 68, 0.3); }