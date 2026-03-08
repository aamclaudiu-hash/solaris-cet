/**
 * SOLARIS CET - Application Styles
 * Stiluri complete pentru platformă
 */

/* ============================================
   CSS VARIABLES - SOLARIS THEME
   ============================================ */
:root {
  --bg-primary: #05060B;
  --bg-secondary: #0a0a0f;
  --bg-tertiary: #12121a;
  --gold: #F2C94C;
  --gold-light: #ffec8b;
  --gold-dark: #b8860b;
  --cyan: #00f5ff;
  --purple: #a855f7;
  --emerald: #10b981;
  --pink: #ec4899;
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.5);
}

/* ============================================
   BASE STYLES
   ============================================ */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
  overflow-x: hidden;
}

/* ============================================
   TYPOGRAPHY
   ============================================ */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  line-height: 1.2;
}

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}

/* ============================================
   ANIMATIONS
   ============================================ */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes gradient-shift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes quantum-flux {
  0%, 100% {
    opacity: 0.3;
    filter: blur(80px);
  }
  50% {
    opacity: 0.6;
    filter: blur(100px);
  }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulse-glow 3s ease-in-out infinite;
}

.animate-gradient {
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

.animate-spin-slow {
  animation: spin-slow 8s linear infinite;
}

.animate-quantum-flux {
  animation: quantum-flux 4s ease-in-out infinite;
}

/* ============================================
   GLASS MORPHISM
   ============================================ */
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: all 0.3s ease;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

/* ============================================
   GLOW EFFECTS
   ============================================ */
.glow-gold {
  box-shadow: 0 0 40px rgba(242, 201, 76, 0.3);
}

.glow-cyan {
  box-shadow: 0 0 40px rgba(0, 245, 255, 0.3);
}

.glow-purple {
  box-shadow: 0 0 40px rgba(168, 85, 247, 0.3);
}

/* ============================================
   GRADIENT TEXT
   ============================================ */
.gradient-text-gold {
  background: linear-gradient(135deg, var(--gold) 0%, var(--gold-light) 50%, var(--gold-dark) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.gradient-text-aurora {
  background: linear-gradient(135deg, var(--gold) 0%, var(--cyan) 50%, var(--purple) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ============================================
   BUTTONS
   ============================================ */
.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: var(--gold);
  color: var(--bg-primary);
  font-weight: 600;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: var(--gold-light);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(242, 201, 76, 0.3);
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
  font-weight: 600;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

/* ============================================
   INPUTS
   ============================================ */
.input-quantum {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.input-quantum:focus {
  outline: none;
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(242, 201, 76, 0.1);
}

.input-quantum::placeholder {
  color: var(--text-muted);
}

/* ============================================
   QUANTUM VISUALIZATIONS
   ============================================ */
.qubit-visual {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    var(--gold),
    var(--cyan),
    var(--purple),
    var(--gold)
  );
  animation: spin-slow 4s linear infinite;
}

.qubit-visual::before {
  content: '';
  position: absolute;
  inset: 4px;
  border-radius: 50%;
  background: var(--bg-primary);
}

.entanglement-line {
  position: absolute;
  height: 2px;
  background: linear-gradient(90deg, var(--gold), var(--cyan));
  opacity: 0.5;
  animation: pulse-glow 2s ease-in-out infinite;
}

/* ============================================
   SCROLLBAR
   ============================================ */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: rgba(242, 201, 76, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(242, 201, 76, 0.5);
}

/* ============================================
   SELECTION
   ============================================ */
::selection {
  background: rgba(242, 201, 76, 0.3);
  color: var(--text-primary);
}

/* ============================================
   RESPONSIVE
   ============================================ */
@media (max-width: 768px) {
  .hero-title h1 {
    font-size: 2.5rem;
  }
  
  .hero-subtitle p {
    font-size: 1.25rem;
  }
  
  .section-animate {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* ============================================
   ACCESSIBILITY
   ============================================ */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* ============================================
   TOKEN TIER BADGES
   ============================================ */
.tier-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
}

.tier-observer {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
}

.tier-explorer {
  background: rgba(0, 245, 255, 0.1);
  color: var(--cyan);
}

.tier-innovator {
  background: rgba(242, 201, 76, 0.1);
  color: var(--gold);
}

.tier-architect {
  background: rgba(168, 85, 247, 0.1);
  color: var(--purple);
}

.tier-master {
  background: linear-gradient(135deg, rgba(242, 201, 76, 0.2), rgba(168, 85, 247, 0.2));
  color: var(--gold);
  border: 1px solid rgba(242, 201, 76, 0.3);
}

/* ============================================
   QUANTUM METRICS
   ============================================ */
.metric-bar {
  height: 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
}

.metric-bar-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.metric-bar-fill.coherence {
  background: linear-gradient(90deg, var(--cyan), var(--cyan-light, #80faff));
}

.metric-bar-fill.entanglement {
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
}

/* ============================================
   AI AGENT CARDS
   ============================================ */
.agent-card {
  position: relative;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: all 0.3s ease;
  overflow: hidden;
}

.agent-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.agent-card:hover::before {
  opacity: 1;
}

.agent-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* ============================================
   CODE BLOCKS
   ============================================ */
.code-block {
  background: #0a0a0f;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.code-block-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.code-block-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.code-block-dot.red {
  background: #ff5f56;
}

.code-block-dot.yellow {
  background: #ffbd2e;
}

.code-block-dot.green {
  background: #27c93f;
}

.code-block pre {
  padding: 1rem;
  overflow-x: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--text-secondary);
}

/* Syntax highlighting colors */
.code-keyword {
  color: #c792ea;
}

.code-string {
  color: #c3e88d;
}

.code-function {
  color: #82aaff;
}

.code-comment {
  color: #676e95;
}

/* ============================================
   LOADING STATES
   ============================================ */
.loading-pulse {
  animation: pulse-glow 1.5s ease-in-out infinite;
}

.loading-skeleton {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: gradient-shift 1.5s ease infinite;
  border-radius: 8px;
}

/* ============================================
   NOTIFICATIONS
   ============================================ */
.notification {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  padding: 1rem 1.5rem;
  background: var(--bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  animation: slide-in 0.3s ease;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.notification.success {
  border-color: var(--emerald);
}

.notification.error {
  border-color: #ef4444;
}

.notification.warning {
  border-color: var(--gold);
}

/* ============================================
   WALLET CONNECT
   ============================================ */
.wallet-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

.wallet-button.connected {
  background: rgba(16, 185, 129, 0.1);
  color: var(--emerald);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.wallet-button.disconnected {
  background: var(--gold);
  color: var(--bg-primary);
}

.wallet-button.disconnected:hover {
  background: var(--gold-light);
}

/* ============================================
   QUANTUM PARTICLE EFFECT
   ============================================ */
.particle-field {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--gold);
  border-radius: 50%;
  opacity: 0.5;
  animation: float 6s ease-in-out infinite;
}

/* ============================================
   HOVER EFFECTS
   ============================================ */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
}

.hover-glow:hover {
  box-shadow: 0 0 30px rgba(242, 201, 76, 0.2);
}

/* ============================================
   FOCUS STATES
   ============================================ */
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
}

/* ============================================
   PRINT STYLES
   ============================================ */
@media print {
  .no-print {
    display: none !important;
  }
  
  body {
    background: white;
    color: black;
  }
}
