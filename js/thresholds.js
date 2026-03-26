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
