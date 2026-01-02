// repair_identity.js
// THE STEVE JOBS PROTOCOL: IDENTITY PHASE CSS REPAIR
// Usage: node repair_identity.js

const fs = require('fs');
const path = require('path');

const CSS_FILE = 'src/web/Project/react-vite/src/styles/index.css';

console.log("🍎 INITIATING STEVE JOBS PROTOCOL (IDENTITY EDITION)...");

// Read current CSS
let cssContent = fs.readFileSync(CSS_FILE, 'utf8');

// Check if identity-specific classes already exist
if (cssContent.includes('.form-group')) {
    console.log("✅ Identity CSS classes already present.");
} else {
    // Append identity-specific styles
    const identityStyles = `

/* ================================================
   IDENTITY PHASE COMPONENTS (Phase 2)
   ================================================ */

/* FORM ELEMENTS */
.form-group {
  @apply space-y-2;
}

.label {
  @apply block text-sm font-medium text-slate-300 uppercase tracking-wider;
}

.input-underline {
  @apply w-full bg-transparent border-0 border-b-2 border-slate-700 px-0 py-3;
  @apply text-slate-100 text-lg placeholder-slate-600 outline-none;
  @apply focus:border-brass transition-all duration-300;
}

/* VA BLUE BUTTON STYLE */
.btn-va-blue {
  @apply inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl cursor-pointer;
  @apply font-medium text-sm tracking-wide uppercase transition-all duration-300 ease-apple-ease;
  @apply bg-blue-600 text-white border border-blue-500;
  @apply hover:bg-blue-500 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)];
}

/* BUTTON SIZES */
.btn-sm {
  @apply px-4 py-2 text-xs;
}

.btn-lg {
  @apply px-8 py-4 text-base;
}

/* TACTICAL BUTTON VARIANTS (Landing Page) */
.btn-tactical {
  @apply inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl;
  @apply font-medium text-sm tracking-wide uppercase transition-all duration-300 ease-apple-ease;
}

.btn-tactical-advance {
  @apply bg-slate-50 text-slate-950;
  @apply hover:bg-white hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.3)];
}

.btn-tactical-retreat {
  @apply text-slate-300 border border-slate-700/50;
  @apply hover:bg-slate-800/40 hover:text-white hover:border-slate-500;
}

/* GLASS PANEL TACTICAL (Workflow Cards) */
.glass-panel-tactical {
  @apply glass-premium rounded-3xl p-8 transition-all duration-500 ease-apple-ease;
}

.glass-panel-tactical:hover {
  transform: translateY(-2px) scale(1.002);
  box-shadow: 0 40px 80px -12px rgba(0, 0, 0, 0.7);
  border-top-color: rgba(255, 255, 255, 0.2);
}

/* LAYOUT UTILITIES */
.container-wide {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* EYEBROW / CHIP TEXT */
.eyebrow {
  @apply inline-block px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider;
  @apply bg-brass/10 text-brass border border-brass/20;
}

/* LIQUID TITLE (Hero Headlines) */
.liquid-title {
  @apply font-serif text-slate-50 leading-tight tracking-tight;
}

/* HERO SILHOUETTE (Landing Background) */
.hero-silhouette {
  @apply absolute inset-0 z-0 pointer-events-none opacity-40;
}

/* ANIMATIONS */
.animate-fade-up {
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out forwards;
}

.animate-delay-100 { animation-delay: 0.1s; }
.animate-delay-200 { animation-delay: 0.2s; }
.animate-delay-300 { animation-delay: 0.3s; }
.animate-delay-400 { animation-delay: 0.4s; }
.animate-delay-500 { animation-delay: 0.5s; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* SKIP LINK (Accessibility) */
.skip-link {
  @apply sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50;
  @apply focus:px-4 focus:py-2 focus:bg-brass focus:text-slate-950 focus:rounded-lg;
}
`;

    cssContent += identityStyles;
    fs.writeFileSync(CSS_FILE, cssContent);
    console.log("✅ Identity CSS: INJECTED (Form Groups, Labels, Buttons, Animations).");
}

console.log("🚀 IDENTITY REPAIR COMPLETE. PLEASE RESTART DEV SERVER.");
