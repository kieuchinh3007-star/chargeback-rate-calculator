# Chargeback Rate Calculator — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a free, public-facing Chargeback Rate Calculator tool (two tabs: Rate Calculator + Cost Calculator) as a single-page HTML application for blockifyapp.com, following Blockify brand guidelines.

**Architecture:** Single HTML file with embedded CSS and vanilla JavaScript. No frameworks, no backend, no API calls. All calculation logic is client-side. The page includes: sticky nav, hero/H1 section, two-tab calculator widget, reference data tables, FAQ accordion, and footer CTA. Fully responsive (single-column under 600px).

**Tech Stack:** HTML5, CSS3 (custom properties), vanilla JavaScript (ES6+), Google Fonts (Syne for headings, DM Sans for body).

---

## Blockify Brand Guidelines — Quick Reference

All UI decisions below are derived from the Blockify Brand Guidelines v1.0:

| Token | Value | Usage |
|---|---|---|
| `--ink` | `#1A1714` | Headlines, body text, nav, CTA buttons, footer bg |
| `--accent-orange` | `#E8390E` | Primary CTA hover, active states, brand accents, highlights |
| `--bg` | `#F5F2ED` | Page background, input fill, section alternation |
| `--white` | `#FFFFFF` | Card surfaces, modal backgrounds |
| `--text-muted` | `#7A7168` | Supporting text, metadata, captions |
| `--border` | `#E0DAD2` | Dividers, input borders, card outlines |
| `--success` | `#1A7F4E` | Safe / positive states |
| `--info-blue` | `#185FA5` | Links, informational states |
| `--danger` | `#C41C00` | Error / high-risk indicators |
| `--warning-amber` | `#B85C00` | Warning states |
| `--ink-secondary` | `#5C5750` | Secondary text |
| `--surface` | `#F7F4F0` | Elevated surface areas |
| Font Display | Syne (Google Fonts) | Bold, headings, stat numbers |
| Font Body | DM Sans (Google Fonts) | Body, labels, nav, buttons |
| Border radius | 8–12px elements, 20px large cards | Moderate rounding |
| Shadows | Minimal or absent | Clean, flat design |
| Primary CTA | Ink bg → Orange hover, white text, 14–16px 24–28px padding, 8px radius | |
| Secondary CTA | Transparent bg, ink border, ink text | |
| Nav CTA | Ink bg, white text, pill shape (radius 99px) | |

---

## File Structure

```
tool1/
├── index.html              # Single-page application (all HTML structure)
├── css/
│   └── styles.css          # All styles — brand tokens, layout, components, responsive
├── js/
│   ├── calculator.js       # Core calculation logic (rate + cost formulas)
│   ├── thresholds.js       # Hardcoded reference data (network thresholds, industry benchmarks)
│   ├── ui.js               # DOM manipulation, tab switching, form handling, result rendering
│   └── analytics.js        # Event tracking stubs (calculator_submit, tab_switch, cta_click)
└── assets/
    └── favicon.svg         # Blockify favicon placeholder
```

**Why this split:**
- `calculator.js` is pure logic, no DOM — easy to test and reason about.
- `thresholds.js` is pure data — easy to update when network thresholds change.
- `ui.js` handles all DOM interaction — separated from logic so calculation formulas stay clean.
- `analytics.js` is a thin wrapper — easy to swap tracking provider later.
- `styles.css` in its own file keeps the HTML clean and cacheable.

---

## Task 1: Project Scaffolding & HTML Structure

**Files:**
- Create: `index.html`
- Create: `css/styles.css` (empty placeholder)
- Create: `js/calculator.js` (empty placeholder)
- Create: `js/thresholds.js` (empty placeholder)
- Create: `js/ui.js` (empty placeholder)
- Create: `js/analytics.js` (empty placeholder)

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p css js assets
```

- [ ] **Step 2: Create `index.html` with full HTML structure**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Chargeback Rate Calculator — Free Tool for Online Sellers | Blockify</title>
  <meta name="description" content="Calculate your chargeback rate instantly. See if you're above Visa or Mastercard thresholds. Free tool — no signup needed.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://blockifyapp.com/chargeback-rate-calculator">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>

  <!-- Sticky Navigation -->
  <nav class="nav" id="nav">
    <div class="nav__container">
      <a href="https://blockifyapp.com" class="nav__logo" aria-label="Blockify Home">
        <span class="nav__wordmark">Blockify</span>
      </a>
      <a href="https://apps.shopify.com/blockify" class="nav__cta" target="_blank" rel="noopener">
        Protect Your Store &rarr;
      </a>
    </div>
  </nav>

  <!-- Hero / H1 Section -->
  <header class="hero">
    <div class="container">
      <p class="hero__label">Free Tool</p>
      <h1 class="hero__title">Chargeback Rate Calculator</h1>
      <p class="hero__subtitle">
        Calculate your chargeback rate instantly, compare it against Visa, Mastercard, and PayPal thresholds, and understand the true financial cost of your chargebacks. Works for any online seller — Shopify, WooCommerce, Wix, or standalone.
      </p>
    </div>
  </header>

  <!-- Calculator Widget -->
  <main class="calculator-section">
    <div class="container">
      <div class="calculator" id="calculator">

        <!-- Tab Navigation -->
        <div class="calculator__tabs" role="tablist">
          <button class="calculator__tab calculator__tab--active" role="tab" aria-selected="true" aria-controls="panel-rate" id="tab-rate" data-tab="rate">
            Rate Calculator
          </button>
          <button class="calculator__tab" role="tab" aria-selected="false" aria-controls="panel-cost" id="tab-cost" data-tab="cost">
            Cost Calculator
          </button>
        </div>

        <!-- Tab 1: Rate Calculator -->
        <div class="calculator__panel calculator__panel--active" role="tabpanel" id="panel-rate" aria-labelledby="tab-rate">
          <form class="calculator__form" id="form-rate" novalidate>
            <div class="form-grid">

              <div class="form-group">
                <label for="total-orders" class="form-label">Total Orders This Month <span class="form-required">*</span></label>
                <input type="number" id="total-orders" class="form-input" min="0" step="1" placeholder="e.g. 1000" required>
              </div>

              <div class="form-group">
                <label for="chargebacks" class="form-label">Chargebacks / Disputes <span class="form-required">*</span></label>
                <input type="number" id="chargebacks" class="form-input" min="0" step="1" placeholder="e.g. 5" required>
              </div>

              <div class="form-group">
                <label for="card-network" class="form-label">Card Network <span class="form-required">*</span></label>
                <select id="card-network" class="form-select" required>
                  <option value="all">All Networks</option>
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="paypal">PayPal</option>
                </select>
              </div>

              <div class="form-group">
                <label for="industry" class="form-label">Industry <span class="form-optional">(Optional)</span></label>
                <select id="industry" class="form-select">
                  <option value="general">General Ecommerce</option>
                  <option value="digital">Digital Goods / SaaS</option>
                  <option value="fashion">Fashion / Apparel</option>
                  <option value="travel">Travel & Hospitality</option>
                  <option value="food">Food & Beverage</option>
                  <option value="luxury">Luxury Goods</option>
                </select>
              </div>

              <!-- Mastercard: previous month transactions (shown conditionally) -->
              <div class="form-group form-group--hidden" id="prev-month-group">
                <label for="prev-month-orders" class="form-label">Previous Month Transactions <span class="form-required">*</span></label>
                <input type="number" id="prev-month-orders" class="form-input" min="0" step="1" placeholder="e.g. 950">
                <p class="form-hint">Mastercard uses last month's transaction count.</p>
              </div>

              <!-- PayPal: 3-month totals (shown conditionally) -->
              <div class="form-group form-group--hidden" id="paypal-orders-group">
                <label for="paypal-total-orders" class="form-label">Total Transactions (Rolling 3 Months) <span class="form-required">*</span></label>
                <input type="number" id="paypal-total-orders" class="form-input" min="0" step="1" placeholder="e.g. 3000">
                <p class="form-hint">PayPal uses a rolling 3-month window.</p>
              </div>

              <div class="form-group form-group--hidden" id="paypal-disputes-group">
                <label for="paypal-total-disputes" class="form-label">Total Disputes (Rolling 3 Months) <span class="form-required">*</span></label>
                <input type="number" id="paypal-total-disputes" class="form-input" min="0" step="1" placeholder="e.g. 15">
              </div>

            </div>

            <button type="submit" class="btn btn--primary" id="btn-calculate-rate">Calculate Chargeback Rate</button>
          </form>

          <!-- Rate Result (hidden until calculated) -->
          <div class="result result--hidden" id="result-rate">
            <div class="result__rate">
              <span class="result__percentage" id="rate-percentage">0.00%</span>
              <span class="result__verdict" id="rate-verdict">Safe</span>
            </div>

            <!-- Visual Gauge -->
            <div class="gauge" id="rate-gauge">
              <div class="gauge__track">
                <div class="gauge__fill" id="gauge-fill"></div>
                <div class="gauge__marker" id="gauge-marker"></div>
              </div>
              <div class="gauge__labels">
                <span>0%</span>
                <span>0.65%</span>
                <span>0.90%</span>
                <span>1.50%</span>
                <span>2.00%</span>
              </div>
            </div>

            <!-- Threshold Cards -->
            <div class="threshold-cards" id="threshold-cards">
              <!-- Populated by JS -->
            </div>

            <!-- CTA Block -->
            <div class="cta-block">
              <p class="cta-block__text">Reduce chargebacks automatically — Block fraudulent orders before they happen with Blockify</p>
              <a href="https://apps.shopify.com/blockify" class="btn btn--cta" target="_blank" rel="noopener">Try Blockify Free &rarr;</a>
            </div>
          </div>
        </div>

        <!-- Tab 2: Cost Calculator -->
        <div class="calculator__panel" role="tabpanel" id="panel-cost" aria-labelledby="tab-cost" hidden>
          <form class="calculator__form" id="form-cost" novalidate>
            <div class="form-grid">

              <div class="form-group">
                <label for="monthly-revenue" class="form-label">Monthly Revenue ($) <span class="form-required">*</span></label>
                <input type="number" id="monthly-revenue" class="form-input" min="0" step="0.01" placeholder="e.g. 50000" required>
              </div>

              <div class="form-group">
                <label for="monthly-chargebacks" class="form-label">Chargebacks per Month <span class="form-required">*</span></label>
                <input type="number" id="monthly-chargebacks" class="form-input" min="0" step="1" placeholder="e.g. 10" required>
              </div>

              <div class="form-group">
                <label for="avg-order-value" class="form-label">Average Order Value ($) <span class="form-required">*</span></label>
                <input type="number" id="avg-order-value" class="form-input" min="0" step="0.01" placeholder="e.g. 75" required>
              </div>

              <div class="form-group">
                <label for="chargeback-fee" class="form-label">Chargeback Fee per Case ($) <span class="form-required">*</span></label>
                <input type="number" id="chargeback-fee" class="form-input" min="0" step="0.01" placeholder="25" value="25" required>
                <p class="form-hint">Default: $25. Stripe: $15, Banks: $25–$100.</p>
              </div>

            </div>

            <button type="submit" class="btn btn--primary" id="btn-calculate-cost">Calculate True Cost</button>
          </form>

          <!-- Cost Result (hidden until calculated) -->
          <div class="result result--hidden" id="result-cost">
            <div class="cost-cards">
              <div class="cost-card">
                <p class="cost-card__label">Direct Loss / Month</p>
                <p class="cost-card__value" id="cost-direct">$0</p>
              </div>
              <div class="cost-card cost-card--highlight">
                <p class="cost-card__label">True Cost / Month</p>
                <p class="cost-card__value" id="cost-true">$0</p>
              </div>
              <div class="cost-card">
                <p class="cost-card__label">Annual Loss Estimate</p>
                <p class="cost-card__value" id="cost-annual">$0</p>
              </div>
              <div class="cost-card">
                <p class="cost-card__label">% of Revenue Lost</p>
                <p class="cost-card__value" id="cost-revenue-pct">0%</p>
              </div>
            </div>

            <!-- Hidden Cost Info Box -->
            <div class="info-box">
              <p class="info-box__title">Why is the "true cost" so much higher?</p>
              <p class="info-box__text">
                According to LexisNexis (2024), every $1 lost to fraud actually costs merchants $4.61 when you factor in lost merchandise, shipping, processing fees, operational costs, and penalty fees. This multiplier is applied to the order value portion of each chargeback.
              </p>
            </div>

            <!-- CTA Block -->
            <div class="cta-block">
              <p class="cta-block__text">Reduce chargebacks automatically — Block fraudulent orders before they happen with Blockify</p>
              <a href="https://apps.shopify.com/blockify" class="btn btn--cta" target="_blank" rel="noopener">Try Blockify Free &rarr;</a>
            </div>
          </div>
        </div>

      </div>
    </div>
  </main>

  <!-- Reference Tables Section -->
  <section class="reference-section" id="thresholds">
    <div class="container">
      <h2 class="section-title">Network Chargeback Thresholds</h2>
      <p class="section-subtitle">Card networks impose monitoring programs when your chargeback rate exceeds these levels.</p>
      <div class="table-wrapper">
        <table class="data-table" id="table-thresholds">
          <thead>
            <tr>
              <th>Network</th>
              <th>Program</th>
              <th>Threshold</th>
              <th>Consequence</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Visa</td>
              <td>Early Warning</td>
              <td>0.65%</td>
              <td>Monitored — no fines yet</td>
            </tr>
            <tr>
              <td>Visa</td>
              <td>Standard</td>
              <td>0.90%</td>
              <td>Fines up to $25,000/month</td>
            </tr>
            <tr>
              <td>Visa</td>
              <td>Excessive</td>
              <td>1.80%</td>
              <td>Risk of account termination</td>
            </tr>
            <tr>
              <td>Mastercard</td>
              <td>Monitored</td>
              <td>1.00%</td>
              <td>Fines from $1,000/month</td>
            </tr>
            <tr>
              <td>Mastercard</td>
              <td>Excessive</td>
              <td>1.50%</td>
              <td>Higher fines, possible termination</td>
            </tr>
            <tr>
              <td>PayPal</td>
              <td>High Volume Fee</td>
              <td>1.50%</td>
              <td>Extra dispute fee applied per case</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 class="section-title" style="margin-top: 3rem;">Industry Benchmarks</h2>
      <p class="section-subtitle">Average chargeback rates by industry, for comparison.</p>
      <div class="table-wrapper">
        <table class="data-table" id="table-benchmarks">
          <thead>
            <tr>
              <th>Industry</th>
              <th>Average Chargeback Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>General Ecommerce</td><td>0.60%</td></tr>
            <tr><td>Digital Goods / SaaS</td><td>0.80%</td></tr>
            <tr><td>Fashion / Apparel</td><td>0.75%</td></tr>
            <tr><td>Travel & Hospitality</td><td>0.89–1.10%</td></tr>
            <tr><td>Food & Beverage</td><td>0.12%</td></tr>
            <tr><td>Luxury Goods</td><td>0.70%</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- FAQ Section -->
  <section class="faq-section" id="faq">
    <div class="container">
      <h2 class="section-title">Frequently Asked Questions</h2>
      <div class="faq-list" id="faq-list">

        <details class="faq-item">
          <summary class="faq-question">How do I calculate my chargeback rate?</summary>
          <p class="faq-answer">Divide the number of chargebacks by the total number of transactions in the same period, then multiply by 100. Visa uses the current month's transactions; Mastercard uses the previous month's count.</p>
        </details>

        <details class="faq-item">
          <summary class="faq-question">What is a good chargeback rate?</summary>
          <p class="faq-answer">For most ecommerce sellers, keeping your rate below 0.65% is the safe zone. Between 0.65% and 0.90% is a warning zone for Visa. Above 0.90% places you in Visa's standard monitoring program, which carries financial penalties.</p>
        </details>

        <details class="faq-item">
          <summary class="faq-question">What happens if my chargeback rate is too high?</summary>
          <p class="faq-answer">Card networks place you in a monitoring program with monthly fines — Visa can charge up to $25,000/month, Mastercard starts at $1,000/month. Persistent high rates can result in your merchant account being terminated.</p>
        </details>

        <details class="faq-item">
          <summary class="faq-question">Does winning a chargeback dispute lower my rate?</summary>
          <p class="faq-answer">No. Card networks count every chargeback filed against you, regardless of outcome. This is why preventing chargebacks from being filed in the first place is far more valuable than winning disputes after the fact.</p>
        </details>

        <details class="faq-item">
          <summary class="faq-question">How is Mastercard chargeback rate different from Visa?</summary>
          <p class="faq-answer">Mastercard divides chargebacks filed this month by transactions processed last month. Visa divides chargebacks this month by transactions this month. This means a sudden increase in orders (e.g. after a sale) can cause your Mastercard rate to spike the following month.</p>
        </details>

        <details class="faq-item">
          <summary class="faq-question">What is the fastest way to lower my chargeback rate?</summary>
          <p class="faq-answer">Block high-risk orders before fulfillment using fraud prevention tools, use IP and email verification at checkout, set up chargeback alert services to refund before disputes escalate, and ensure clear billing descriptors so customers recognize charges.</p>
        </details>

      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <p class="footer__text">
        Built by <a href="https://blockifyapp.com" class="footer__link">Blockify</a> — Trusted by 20,000+ merchants worldwide. Protect your store from entry to checkout.
      </p>
    </div>
  </footer>

  <script src="js/thresholds.js"></script>
  <script src="js/calculator.js"></script>
  <script src="js/analytics.js"></script>
  <script src="js/ui.js"></script>

</body>
</html>
```

- [ ] **Step 3: Create empty placeholder files**

```bash
touch css/styles.css js/calculator.js js/thresholds.js js/ui.js js/analytics.js
```

- [ ] **Step 4: Verify HTML opens in browser without errors**

Open `index.html` in a browser. Expected: unstyled but structurally correct page with all sections visible. No console errors.

- [ ] **Step 5: Commit**

```bash
git init
git add index.html css/styles.css js/calculator.js js/thresholds.js js/ui.js js/analytics.js
git commit -m "feat: scaffold HTML structure and empty asset files"
```

---

## Task 2: Reference Data — `js/thresholds.js`

**Files:**
- Create: `js/thresholds.js`

- [ ] **Step 1: Write thresholds data module**

```javascript
/**
 * Hardcoded reference data for network thresholds and industry benchmarks.
 * Source: Visa, Mastercard, PayPal public documentation (2024–2025).
 */

const NETWORK_THRESHOLDS = {
  visa: [
    { program: 'Early Warning', rate: 0.65, consequence: 'Monitored — no fines yet' },
    { program: 'Standard', rate: 0.90, consequence: 'Fines up to $25,000/month' },
    { program: 'Excessive', rate: 1.80, consequence: 'Risk of account termination' }
  ],
  mastercard: [
    { program: 'Monitored', rate: 1.00, consequence: 'Fines from $1,000/month' },
    { program: 'Excessive', rate: 1.50, consequence: 'Higher fines, possible termination' }
  ],
  paypal: [
    { program: 'High Volume Fee', rate: 1.50, consequence: 'Extra dispute fee applied per case' }
  ]
};

// "All networks" uses Visa thresholds as the most conservative baseline
const ALL_NETWORK_THRESHOLDS = NETWORK_THRESHOLDS.visa;

const INDUSTRY_BENCHMARKS = {
  general:  { label: 'General Ecommerce',    rate: 0.60 },
  digital:  { label: 'Digital Goods / SaaS',  rate: 0.80 },
  fashion:  { label: 'Fashion / Apparel',     rate: 0.75 },
  travel:   { label: 'Travel & Hospitality',  rate: 1.00 },
  food:     { label: 'Food & Beverage',       rate: 0.12 },
  luxury:   { label: 'Luxury Goods',          rate: 0.70 }
};

// LexisNexis 2024 fraud cost multiplier
const FRAUD_COST_MULTIPLIER = 4.61;
```

- [ ] **Step 2: Verify data loads without errors**

Open `index.html` in browser, open console, type `NETWORK_THRESHOLDS.visa[0].rate` — expected output: `0.65`.

- [ ] **Step 3: Commit**

```bash
git add js/thresholds.js
git commit -m "feat: add hardcoded network thresholds and industry benchmarks"
```

---

## Task 3: Calculation Logic — `js/calculator.js`

**Files:**
- Create: `js/calculator.js`

- [ ] **Step 1: Write rate calculation functions**

```javascript
/**
 * Pure calculation functions. No DOM access.
 */

/**
 * Calculate chargeback rate based on network.
 * @param {string} network - 'visa' | 'mastercard' | 'paypal' | 'all'
 * @param {object} inputs - { chargebacks, totalOrders, prevMonthOrders, paypalTotalOrders, paypalTotalDisputes }
 * @returns {number} Rate as percentage (e.g. 0.80 for 0.80%)
 */
function calculateChargebackRate(network, inputs) {
  switch (network) {
    case 'mastercard': {
      if (!inputs.prevMonthOrders || inputs.prevMonthOrders <= 0) return 0;
      return (inputs.chargebacks / inputs.prevMonthOrders) * 100;
    }
    case 'paypal': {
      if (!inputs.paypalTotalOrders || inputs.paypalTotalOrders <= 0) return 0;
      return (inputs.paypalTotalDisputes / inputs.paypalTotalOrders) * 100;
    }
    case 'visa':
    case 'all':
    default: {
      if (!inputs.totalOrders || inputs.totalOrders <= 0) return 0;
      return (inputs.chargebacks / inputs.totalOrders) * 100;
    }
  }
}

/**
 * Determine risk level from rate and network thresholds.
 * @param {number} rate - Chargeback rate percentage
 * @param {Array} thresholds - Array of threshold objects sorted by rate ascending
 * @returns {{ level: string, color: string, verdict: string }}
 */
function getRiskLevel(rate, thresholds) {
  if (thresholds.length === 0) {
    return { level: 'unknown', color: 'muted', verdict: 'No threshold data available' };
  }

  const warningThreshold = thresholds[0].rate;
  const standardThreshold = thresholds.length > 1 ? thresholds[1].rate : thresholds[0].rate;
  const excessiveThreshold = thresholds.length > 2 ? thresholds[2].rate : standardThreshold;

  if (rate < warningThreshold) {
    return { level: 'safe', color: 'success', verdict: 'Safe — Below threshold' };
  } else if (rate < standardThreshold) {
    return { level: 'warning', color: 'warning', verdict: 'Warning zone — Monitor closely' };
  } else if (rate < excessiveThreshold) {
    return { level: 'high', color: 'danger', verdict: 'High risk — Action required' };
  } else {
    return { level: 'excessive', color: 'danger', verdict: 'Excessive — Account at risk' };
  }
}

/**
 * Get applicable thresholds for a network.
 * @param {string} network - 'visa' | 'mastercard' | 'paypal' | 'all'
 * @returns {Array} Array of threshold objects
 */
function getThresholdsForNetwork(network) {
  if (network === 'all') return ALL_NETWORK_THRESHOLDS;
  return NETWORK_THRESHOLDS[network] || ALL_NETWORK_THRESHOLDS;
}

/**
 * Calculate chargeback costs.
 * @param {object} inputs - { monthlyRevenue, monthlyChargebacks, avgOrderValue, chargebackFee }
 * @returns {{ directLoss, trueCost, annualLoss, revenuePercent }}
 */
function calculateChargebackCost(inputs) {
  const { monthlyRevenue, monthlyChargebacks, avgOrderValue, chargebackFee } = inputs;

  // Direct loss: chargebacks * (AOV + fee)
  const directLoss = monthlyChargebacks * (avgOrderValue + chargebackFee);

  // True cost: chargebacks * AOV * 4.61 + chargebacks * fee
  const trueCost = (monthlyChargebacks * avgOrderValue * FRAUD_COST_MULTIPLIER) + (monthlyChargebacks * chargebackFee);

  // Annual
  const annualLoss = trueCost * 12;

  // % of revenue
  const revenuePercent = monthlyRevenue > 0 ? (trueCost / monthlyRevenue) * 100 : 0;

  return {
    directLoss: directLoss,
    trueCost: trueCost,
    annualLoss: annualLoss,
    revenuePercent: revenuePercent
  };
}
```

- [ ] **Step 2: Test calculation logic in browser console**

Open `index.html`, then in the console:

```javascript
// Visa: 5 chargebacks / 1000 orders = 0.50%
calculateChargebackRate('visa', { chargebacks: 5, totalOrders: 1000 })
// Expected: 0.5

// Mastercard: 10 chargebacks / 900 prev month = 1.11%
calculateChargebackRate('mastercard', { chargebacks: 10, prevMonthOrders: 900 })
// Expected: 1.1111...

// Cost: 10 chargebacks, $75 AOV, $25 fee, $50000 revenue
calculateChargebackCost({ monthlyRevenue: 50000, monthlyChargebacks: 10, avgOrderValue: 75, chargebackFee: 25 })
// Expected: directLoss=1000, trueCost=3707.5, annualLoss=44490, revenuePercent=7.415
```

- [ ] **Step 3: Commit**

```bash
git add js/calculator.js
git commit -m "feat: implement rate and cost calculation logic"
```

---

## Task 4: Analytics Stubs — `js/analytics.js`

**Files:**
- Create: `js/analytics.js`

- [ ] **Step 1: Write analytics event tracking stubs**

```javascript
/**
 * Analytics event tracking.
 * Replace the body of trackEvent() with your analytics provider (GA4, Plausible, etc.)
 */

function trackEvent(eventName, eventData) {
  // Google Analytics 4 (uncomment when GA is installed):
  // if (typeof gtag === 'function') {
  //   gtag('event', eventName, eventData);
  // }

  // Debug logging (remove in production):
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    console.log('[Analytics]', eventName, eventData);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add js/analytics.js
git commit -m "feat: add analytics tracking stubs"
```

---

## Task 5: UI Logic — `js/ui.js`

**Files:**
- Create: `js/ui.js`

- [ ] **Step 1: Write tab switching logic**

```javascript
/**
 * UI controller — DOM manipulation, event binding, result rendering.
 * Runs after thresholds.js, calculator.js, and analytics.js are loaded.
 */

(function () {
  'use strict';

  // ── Tab Switching ──

  const tabs = document.querySelectorAll('.calculator__tab');
  const panels = document.querySelectorAll('.calculator__panel');

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      const targetTab = this.getAttribute('data-tab');

      tabs.forEach(function (t) {
        t.classList.remove('calculator__tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      this.classList.add('calculator__tab--active');
      this.setAttribute('aria-selected', 'true');

      panels.forEach(function (p) {
        p.classList.remove('calculator__panel--active');
        p.hidden = true;
      });
      var activePanel = document.getElementById('panel-' + targetTab);
      activePanel.classList.add('calculator__panel--active');
      activePanel.hidden = false;

      trackEvent('tab_switch', { tab: targetTab });
    });
  });

  // ── Network-Specific Field Visibility ──

  var networkSelect = document.getElementById('card-network');
  var prevMonthGroup = document.getElementById('prev-month-group');
  var paypalOrdersGroup = document.getElementById('paypal-orders-group');
  var paypalDisputesGroup = document.getElementById('paypal-disputes-group');
  var totalOrdersInput = document.getElementById('total-orders');
  var chargebacksInput = document.getElementById('chargebacks');

  networkSelect.addEventListener('change', function () {
    var network = this.value;

    // Hide all conditional fields
    prevMonthGroup.classList.add('form-group--hidden');
    paypalOrdersGroup.classList.add('form-group--hidden');
    paypalDisputesGroup.classList.add('form-group--hidden');

    // Show relevant fields
    if (network === 'mastercard') {
      prevMonthGroup.classList.remove('form-group--hidden');
    } else if (network === 'paypal') {
      paypalOrdersGroup.classList.remove('form-group--hidden');
      paypalDisputesGroup.classList.remove('form-group--hidden');
    }
  });

  // ── Rate Calculator Form ──

  var formRate = document.getElementById('form-rate');
  var resultRate = document.getElementById('result-rate');

  formRate.addEventListener('submit', function (e) {
    e.preventDefault();

    var network = networkSelect.value;
    var inputs = {
      chargebacks: parseFloat(chargebacksInput.value) || 0,
      totalOrders: parseFloat(totalOrdersInput.value) || 0,
      prevMonthOrders: parseFloat(document.getElementById('prev-month-orders').value) || 0,
      paypalTotalOrders: parseFloat(document.getElementById('paypal-total-orders').value) || 0,
      paypalTotalDisputes: parseFloat(document.getElementById('paypal-total-disputes').value) || 0
    };

    // Validation
    if (network === 'mastercard' && inputs.prevMonthOrders <= 0) {
      alert('Please enter the previous month\'s transaction count for Mastercard.');
      return;
    }
    if (network === 'paypal' && (inputs.paypalTotalOrders <= 0 || inputs.paypalTotalDisputes < 0)) {
      alert('Please enter the rolling 3-month totals for PayPal.');
      return;
    }
    if (network !== 'paypal' && inputs.totalOrders <= 0) {
      alert('Please enter your total orders this month.');
      return;
    }

    var rate = calculateChargebackRate(network, inputs);
    var thresholds = getThresholdsForNetwork(network);
    var risk = getRiskLevel(rate, thresholds);
    var industry = document.getElementById('industry').value;
    var benchmark = INDUSTRY_BENCHMARKS[industry];

    renderRateResult(rate, risk, thresholds, benchmark);

    resultRate.classList.remove('result--hidden');

    trackEvent('calculator_submit', {
      type: 'rate',
      network: network,
      rate: rate.toFixed(2),
      risk_level: risk.level
    });

    // Smooth scroll to result
    resultRate.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ── Rate Result Rendering ──

  function renderRateResult(rate, risk, thresholds, benchmark) {
    // Rate percentage
    var percentageEl = document.getElementById('rate-percentage');
    percentageEl.textContent = rate.toFixed(2) + '%';
    percentageEl.className = 'result__percentage result__percentage--' + risk.color;

    // Verdict
    var verdictEl = document.getElementById('rate-verdict');
    verdictEl.textContent = risk.verdict;
    verdictEl.className = 'result__verdict result__verdict--' + risk.color;

    // Gauge
    var gaugeFill = document.getElementById('gauge-fill');
    var gaugeMarker = document.getElementById('gauge-marker');
    var gaugePercent = Math.min((rate / 2) * 100, 100); // 0–2% mapped to 0–100%
    gaugeFill.style.width = gaugePercent + '%';
    gaugeMarker.style.left = gaugePercent + '%';

    // Color the gauge fill
    if (risk.color === 'success') {
      gaugeFill.className = 'gauge__fill gauge__fill--success';
    } else if (risk.color === 'warning') {
      gaugeFill.className = 'gauge__fill gauge__fill--warning';
    } else {
      gaugeFill.className = 'gauge__fill gauge__fill--danger';
    }

    // Threshold cards
    var cardsContainer = document.getElementById('threshold-cards');
    cardsContainer.innerHTML = '';

    thresholds.forEach(function (t) {
      var isAbove = rate >= t.rate;
      var card = document.createElement('div');
      card.className = 'threshold-card' + (isAbove ? ' threshold-card--above' : ' threshold-card--below');
      card.innerHTML =
        '<p class="threshold-card__program">' + escapeHtml(t.program) + '</p>' +
        '<p class="threshold-card__rate">' + t.rate.toFixed(2) + '%</p>' +
        '<p class="threshold-card__status">' + (isAbove ? 'Above' : 'Below') + '</p>';
      cardsContainer.appendChild(card);
    });

    // Industry benchmark card
    if (benchmark) {
      var isAbove = rate >= benchmark.rate;
      var card = document.createElement('div');
      card.className = 'threshold-card' + (isAbove ? ' threshold-card--above' : ' threshold-card--below');
      card.innerHTML =
        '<p class="threshold-card__program">' + escapeHtml(benchmark.label) + ' Avg</p>' +
        '<p class="threshold-card__rate">' + benchmark.rate.toFixed(2) + '%</p>' +
        '<p class="threshold-card__status">' + (isAbove ? 'Above' : 'Below') + '</p>';
      cardsContainer.appendChild(card);
    }
  }

  // ── Cost Calculator Form ──

  var formCost = document.getElementById('form-cost');
  var resultCost = document.getElementById('result-cost');

  formCost.addEventListener('submit', function (e) {
    e.preventDefault();

    var inputs = {
      monthlyRevenue: parseFloat(document.getElementById('monthly-revenue').value) || 0,
      monthlyChargebacks: parseFloat(document.getElementById('monthly-chargebacks').value) || 0,
      avgOrderValue: parseFloat(document.getElementById('avg-order-value').value) || 0,
      chargebackFee: parseFloat(document.getElementById('chargeback-fee').value) || 0
    };

    if (inputs.monthlyRevenue <= 0 || inputs.monthlyChargebacks <= 0 || inputs.avgOrderValue <= 0) {
      alert('Please fill in all required fields with values greater than zero.');
      return;
    }

    var result = calculateChargebackCost(inputs);

    document.getElementById('cost-direct').textContent = formatCurrency(result.directLoss);
    document.getElementById('cost-true').textContent = formatCurrency(result.trueCost);
    document.getElementById('cost-annual').textContent = formatCurrency(result.annualLoss);
    document.getElementById('cost-revenue-pct').textContent = result.revenuePercent.toFixed(2) + '%';

    resultCost.classList.remove('result--hidden');

    trackEvent('calculator_submit', {
      type: 'cost',
      true_cost: result.trueCost.toFixed(2),
      revenue_percent: result.revenuePercent.toFixed(2)
    });

    resultCost.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // ── CTA Click Tracking ──

  document.querySelectorAll('.btn--cta, .nav__cta').forEach(function (btn) {
    btn.addEventListener('click', function () {
      trackEvent('cta_click', { location: this.closest('.cta-block') ? 'result' : 'nav' });
    });
  });

  // ── Utilities ──

  function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

})();
```

- [ ] **Step 2: Verify tab switching works**

Open `index.html` in browser. Click "Cost Calculator" tab — panel should switch. Click "Rate Calculator" — should switch back. Console should show `[Analytics] tab_switch` events.

- [ ] **Step 3: Verify rate calculation renders**

Enter: Total Orders = 1000, Chargebacks = 5, Network = Visa, Industry = General. Click Calculate. Expected: 0.50% displayed in green, "Safe — Below threshold", gauge at 25% width, three Visa threshold cards all showing "Below", one industry card showing "Below".

- [ ] **Step 4: Verify Mastercard conditional field**

Select Mastercard from dropdown. Expected: "Previous Month Transactions" field appears. Enter 900, chargebacks = 10, orders = 1000. Calculate. Expected: 1.11% (10/900 * 100).

- [ ] **Step 5: Verify PayPal conditional fields**

Select PayPal from dropdown. Expected: two rolling 3-month fields appear. Enter 3000 total orders, 45 disputes. Calculate. Expected: 1.50%.

- [ ] **Step 6: Verify cost calculation renders**

Switch to Cost tab. Enter: Revenue = 50000, Chargebacks = 10, AOV = 75, Fee = 25. Calculate. Expected: Direct = $1,000, True Cost = $3,708, Annual = $44,490, Revenue % = 7.42%.

- [ ] **Step 7: Commit**

```bash
git add js/ui.js
git commit -m "feat: implement UI logic — tabs, forms, result rendering, analytics tracking"
```

---

## Task 6: Styles — Brand Foundation & Layout (`css/styles.css` Part 1)

**Files:**
- Create: `css/styles.css`

- [ ] **Step 1: Write CSS custom properties and reset**

```css
/* ============================================================
   Blockify Chargeback Rate Calculator — Styles
   Brand: Blockify Brand Guidelines v1.0
   Fonts: Syne (headings), DM Sans (body)
   ============================================================ */

/* ── CSS Custom Properties (Brand Tokens) ── */

:root {
  /* Primary */
  --ink: #1A1714;
  --accent-orange: #E8390E;
  --bg: #F5F2ED;
  --white: #FFFFFF;

  /* Secondary */
  --text-muted: #7A7168;
  --border: #E0DAD2;
  --success: #1A7F4E;
  --info-blue: #185FA5;
  --ink-secondary: #5C5750;
  --surface: #F7F4F0;

  /* Semantic */
  --danger: #C41C00;
  --warning-amber: #B85C00;

  /* Typography */
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;

  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
}

/* ── Reset ── */

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  color: var(--ink);
  background-color: var(--bg);
}

img, svg {
  display: block;
  max-width: 100%;
}

a {
  color: var(--ink);
  text-decoration: none;
}

/* ── Container ── */

.container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
}
```

- [ ] **Step 2: Write navigation styles**

Append to `css/styles.css`:

```css
/* ── Navigation (Sticky) ── */

.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--white);
  border-bottom: 1px solid var(--border);
}

.nav__container {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 var(--space-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
}

.nav__logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.nav__wordmark {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 22px;
  color: var(--ink);
  letter-spacing: -0.01em;
}

.nav__cta {
  display: inline-flex;
  align-items: center;
  padding: 8px 20px;
  background-color: var(--ink);
  color: var(--white);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  border-radius: 99px;
  transition: background-color 0.2s ease;
}

.nav__cta:hover {
  background-color: var(--accent-orange);
  color: var(--white);
}
```

- [ ] **Step 3: Write hero section styles**

Append to `css/styles.css`:

```css
/* ── Hero Section ── */

.hero {
  padding: var(--space-4xl) 0 var(--space-3xl);
  text-align: center;
}

.hero__label {
  display: inline-block;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent-orange);
  margin-bottom: var(--space-md);
}

.hero__title {
  font-family: var(--font-display);
  font-size: 44px;
  font-weight: 800;
  color: var(--ink);
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin-bottom: var(--space-lg);
}

.hero__subtitle {
  font-size: 17px;
  line-height: 1.7;
  color: var(--ink-secondary);
  max-width: 680px;
  margin: 0 auto;
}
```

- [ ] **Step 4: Commit**

```bash
git add css/styles.css
git commit -m "feat: add CSS brand tokens, reset, nav, and hero styles"
```

---

## Task 7: Styles — Calculator Widget (`css/styles.css` Part 2)

**Files:**
- Modify: `css/styles.css`

- [ ] **Step 1: Write calculator card and tab styles**

Append to `css/styles.css`:

```css
/* ── Calculator Section ── */

.calculator-section {
  padding: 0 0 var(--space-4xl);
}

.calculator {
  background-color: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

/* ── Tabs ── */

.calculator__tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
}

.calculator__tab {
  flex: 1;
  padding: var(--space-md) var(--space-lg);
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-muted);
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease;
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
}

.calculator__tab:hover {
  color: var(--ink);
}

.calculator__tab--active {
  color: var(--ink);
  border-bottom-color: var(--accent-orange);
}

/* ── Panels ── */

.calculator__panel {
  display: none;
  padding: var(--space-xl);
}

.calculator__panel--active {
  display: block;
}
```

- [ ] **Step 2: Write form input styles**

Append to `css/styles.css`:

```css
/* ── Form ── */

.calculator__form {
  margin-bottom: var(--space-xl);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.form-group--hidden {
  display: none;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--ink);
}

.form-required {
  color: var(--accent-orange);
}

.form-optional {
  font-weight: 400;
  color: var(--text-muted);
  font-size: 13px;
}

.form-input,
.form-select {
  padding: 12px 14px;
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--ink);
  background-color: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  appearance: none;
  -webkit-appearance: none;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--accent-orange);
  box-shadow: 0 0 0 3px rgba(232, 57, 14, 0.1);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1.5l5 5 5-5' stroke='%237A7168' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  padding-right: 36px;
}

.form-hint {
  font-size: 13px;
  color: var(--text-muted);
  line-height: 1.5;
}
```

- [ ] **Step 3: Write button styles**

Append to `css/styles.css`:

```css
/* ── Buttons ── */

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.01em;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.btn:active {
  transform: scale(0.98);
}

.btn--primary {
  width: 100%;
  padding: 14px var(--space-xl);
  background-color: var(--ink);
  color: var(--white);
  border-radius: var(--radius-sm);
}

.btn--primary:hover {
  background-color: var(--accent-orange);
}

.btn--cta {
  padding: 14px 28px;
  background-color: var(--accent-orange);
  color: var(--white);
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.btn--cta:hover {
  background-color: #d03009;
}
```

- [ ] **Step 4: Commit**

```bash
git add css/styles.css
git commit -m "feat: add calculator card, form, and button styles"
```

---

## Task 8: Styles — Results, Gauge & Threshold Cards (`css/styles.css` Part 3)

**Files:**
- Modify: `css/styles.css`

- [ ] **Step 1: Write rate result and gauge styles**

Append to `css/styles.css`:

```css
/* ── Results ── */

.result {
  padding-top: var(--space-xl);
  border-top: 1px solid var(--border);
}

.result--hidden {
  display: none;
}

.result__rate {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.result__percentage {
  display: block;
  font-family: var(--font-display);
  font-size: 56px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.result__percentage--success { color: var(--success); }
.result__percentage--warning { color: var(--warning-amber); }
.result__percentage--danger  { color: var(--danger); }
.result__percentage--muted   { color: var(--text-muted); }

.result__verdict {
  display: inline-block;
  margin-top: var(--space-sm);
  font-size: 16px;
  font-weight: 600;
  padding: 6px 16px;
  border-radius: 99px;
}

.result__verdict--success {
  color: var(--success);
  background-color: rgba(26, 127, 78, 0.08);
}

.result__verdict--warning {
  color: var(--warning-amber);
  background-color: rgba(184, 92, 0, 0.08);
}

.result__verdict--danger {
  color: var(--danger);
  background-color: rgba(196, 28, 0, 0.08);
}

.result__verdict--muted {
  color: var(--text-muted);
  background-color: var(--surface);
}

/* ── Gauge ── */

.gauge {
  margin-bottom: var(--space-xl);
}

.gauge__track {
  position: relative;
  height: 12px;
  background-color: var(--surface);
  border-radius: 99px;
  overflow: visible;
}

.gauge__fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s ease;
}

.gauge__fill--success { background-color: var(--success); }
.gauge__fill--warning { background-color: var(--warning-amber); }
.gauge__fill--danger  { background-color: var(--danger); }

.gauge__marker {
  position: absolute;
  top: -4px;
  width: 4px;
  height: 20px;
  background-color: var(--ink);
  border-radius: 2px;
  transform: translateX(-50%);
  transition: left 0.6s ease;
}

.gauge__labels {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-sm);
  font-size: 12px;
  color: var(--text-muted);
}
```

- [ ] **Step 2: Write threshold card styles**

Append to `css/styles.css`:

```css
/* ── Threshold Cards ── */

.threshold-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.threshold-card {
  padding: var(--space-md);
  border-radius: var(--radius-md);
  border: 1px solid var(--border);
  text-align: center;
}

.threshold-card--below {
  background-color: rgba(26, 127, 78, 0.04);
  border-color: rgba(26, 127, 78, 0.2);
}

.threshold-card--above {
  background-color: rgba(196, 28, 0, 0.04);
  border-color: rgba(196, 28, 0, 0.2);
}

.threshold-card__program {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: var(--space-xs);
}

.threshold-card__rate {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 700;
  color: var(--ink);
  margin-bottom: var(--space-xs);
}

.threshold-card__status {
  font-size: 13px;
  font-weight: 600;
}

.threshold-card--below .threshold-card__status {
  color: var(--success);
}

.threshold-card--above .threshold-card__status {
  color: var(--danger);
}
```

- [ ] **Step 3: Write cost result cards and CTA block styles**

Append to `css/styles.css`:

```css
/* ── Cost Cards ── */

.cost-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

.cost-card {
  padding: var(--space-lg);
  background-color: var(--surface);
  border-radius: var(--radius-md);
  text-align: center;
}

.cost-card--highlight {
  background-color: var(--ink);
}

.cost-card__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: var(--space-sm);
}

.cost-card--highlight .cost-card__label {
  color: rgba(255, 255, 255, 0.7);
}

.cost-card__value {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--ink);
}

.cost-card--highlight .cost-card__value {
  color: var(--accent-orange);
}

/* ── Info Box ── */

.info-box {
  padding: var(--space-lg);
  background-color: rgba(24, 95, 165, 0.05);
  border-left: 3px solid var(--info-blue);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  margin-bottom: var(--space-xl);
}

.info-box__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: var(--space-sm);
}

.info-box__text {
  font-size: 14px;
  line-height: 1.7;
  color: var(--ink-secondary);
}

/* ── CTA Block ── */

.cta-block {
  background-color: var(--ink);
  padding: var(--space-xl);
  border-radius: var(--radius-md);
  text-align: center;
}

.cta-block__text {
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: var(--space-md);
}
```

- [ ] **Step 4: Commit**

```bash
git add css/styles.css
git commit -m "feat: add result, gauge, threshold cards, cost cards, and CTA styles"
```

---

## Task 9: Styles — Reference Tables, FAQ & Footer (`css/styles.css` Part 4)

**Files:**
- Modify: `css/styles.css`

- [ ] **Step 1: Write reference table styles**

Append to `css/styles.css`:

```css
/* ── Reference Section ── */

.reference-section {
  padding: var(--space-4xl) 0;
  background-color: var(--white);
}

.section-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.01em;
  margin-bottom: var(--space-sm);
}

.section-subtitle {
  font-size: 16px;
  color: var(--ink-secondary);
  margin-bottom: var(--space-xl);
}

.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table thead {
  background-color: var(--surface);
}

.data-table th {
  text-align: left;
  padding: 12px 16px;
  font-weight: 600;
  color: var(--ink);
  border-bottom: 2px solid var(--border);
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border);
  color: var(--ink-secondary);
}

.data-table tbody tr:last-child td {
  border-bottom: none;
}

.data-table tbody tr:hover {
  background-color: var(--surface);
}
```

- [ ] **Step 2: Write FAQ styles**

Append to `css/styles.css`:

```css
/* ── FAQ Section ── */

.faq-section {
  padding: var(--space-4xl) 0;
}

.faq-list {
  max-width: 720px;
  margin: 0 auto;
}

.faq-item {
  border-bottom: 1px solid var(--border);
}

.faq-item:first-child {
  border-top: 1px solid var(--border);
}

.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg) 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
  list-style: none;
}

.faq-question::-webkit-details-marker {
  display: none;
}

.faq-question::after {
  content: '+';
  font-size: 20px;
  font-weight: 400;
  color: var(--text-muted);
  transition: transform 0.2s ease;
  flex-shrink: 0;
  margin-left: var(--space-md);
}

.faq-item[open] .faq-question::after {
  content: '−';
}

.faq-answer {
  padding: 0 0 var(--space-lg);
  font-size: 15px;
  line-height: 1.7;
  color: var(--ink-secondary);
}
```

- [ ] **Step 3: Write footer styles**

Append to `css/styles.css`:

```css
/* ── Footer ── */

.footer {
  padding: var(--space-xl) 0;
  background-color: var(--ink);
  text-align: center;
}

.footer__text {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.footer__link {
  color: var(--white);
  font-weight: 600;
  transition: color 0.2s ease;
}

.footer__link:hover {
  color: var(--accent-orange);
}
```

- [ ] **Step 4: Commit**

```bash
git add css/styles.css
git commit -m "feat: add reference tables, FAQ accordion, and footer styles"
```

---

## Task 10: Styles — Responsive (Mobile) (`css/styles.css` Part 5)

**Files:**
- Modify: `css/styles.css`

- [ ] **Step 1: Write responsive breakpoints**

Append to `css/styles.css`:

```css
/* ── Responsive — Mobile (max-width: 600px) ── */

@media (max-width: 600px) {
  .hero {
    padding: var(--space-3xl) 0 var(--space-2xl);
  }

  .hero__title {
    font-size: 32px;
  }

  .hero__subtitle {
    font-size: 15px;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }

  .calculator__panel {
    padding: var(--space-lg);
  }

  .calculator__tab {
    font-size: 14px;
    padding: var(--space-md);
  }

  .result__percentage {
    font-size: 44px;
  }

  .threshold-cards {
    grid-template-columns: 1fr;
  }

  .cost-cards {
    grid-template-columns: 1fr;
  }

  .cost-card__value {
    font-size: 24px;
  }

  .cta-block {
    padding: var(--space-lg);
  }

  .section-title {
    font-size: 24px;
  }

  .data-table {
    font-size: 13px;
  }

  .data-table th,
  .data-table td {
    padding: 10px 12px;
  }
}

/* ── Responsive — Tablet (max-width: 768px) ── */

@media (max-width: 768px) and (min-width: 601px) {
  .hero__title {
    font-size: 36px;
  }

  .form-grid {
    grid-template-columns: 1fr 1fr;
  }

  .threshold-cards {
    grid-template-columns: 1fr 1fr;
  }
}
```

- [ ] **Step 2: Test responsive layout**

Open `index.html`, use browser DevTools to toggle mobile view (375px wide). Expected:
- Single-column form fields
- Threshold cards stack vertically
- Cost cards stack vertically
- Hero title is 32px
- No horizontal overflow

- [ ] **Step 3: Commit**

```bash
git add css/styles.css
git commit -m "feat: add responsive styles for mobile and tablet"
```

---

## Task 11: Final Integration Testing

**Files:** None (testing only)

- [ ] **Step 1: Full Rate Calculator flow — Visa**

Open `index.html`. Enter: Orders = 2000, Chargebacks = 15, Network = Visa, Industry = Fashion.

Expected:
- Rate: 0.75%
- Verdict: "Warning zone — Monitor closely" (amber)
- Gauge at ~37.5% width, amber color
- Visa Early Warning card: "Above" (red border)
- Visa Standard card: "Below" (green border)
- Visa Excessive card: "Below" (green border)
- Fashion Avg card: "Above" (red border, since 0.75% = 0.75%)
- CTA block visible at bottom

- [ ] **Step 2: Full Rate Calculator flow — Mastercard (high risk)**

Select Mastercard. Enter: Orders = 500, Chargebacks = 8, Prev Month = 600.

Expected:
- Rate: 1.33% (8/600 * 100)
- Verdict: "High risk — Action required" (red)
- Mastercard Monitored: "Above"
- Mastercard Excessive: "Below"

- [ ] **Step 3: Full Cost Calculator flow**

Switch to Cost Calculator tab. Enter: Revenue = $100,000, Chargebacks = 20, AOV = $150, Fee = $25.

Expected:
- Direct Loss: $3,500 (20 × ($150 + $25))
- True Cost: $14,330 (20 × $150 × 4.61 + 20 × $25)
- Annual: $171,960
- Revenue %: 14.33%
- Info box explains the $4.61 multiplier

- [ ] **Step 4: Accessibility check**

- Tab through all form fields — focus should be visible (orange ring)
- Screen reader: all inputs have labels
- Color is not the only indicator — verdict text accompanies color everywhere
- FAQ accordion is keyboard-accessible via `<details>`

- [ ] **Step 5: Performance check**

Open DevTools Network tab. Expected:
- Only external requests: Google Fonts (2 font files)
- Total page weight: under 100KB (excluding fonts)
- No API calls
- DOMContentLoaded under 500ms on broadband

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: final integration verification — all tests pass"
```

---

## Summary

| Task | Description | Est. Steps |
|------|-------------|------------|
| 1 | Project scaffolding & HTML structure | 5 |
| 2 | Reference data (`thresholds.js`) | 3 |
| 3 | Calculation logic (`calculator.js`) | 3 |
| 4 | Analytics stubs (`analytics.js`) | 2 |
| 5 | UI logic (`ui.js`) — tabs, forms, rendering | 7 |
| 6 | CSS — brand tokens, reset, nav, hero | 4 |
| 7 | CSS — calculator card, forms, buttons | 4 |
| 8 | CSS — results, gauge, threshold/cost cards | 4 |
| 9 | CSS — tables, FAQ, footer | 4 |
| 10 | CSS — responsive mobile/tablet | 3 |
| 11 | Integration testing | 6 |
| **Total** | | **45 steps** |
