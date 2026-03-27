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
        t.setAttribute('tabindex', '-1');
      });
      this.classList.add('calculator__tab--active');
      this.setAttribute('aria-selected', 'true');
      this.setAttribute('tabindex', '0');
      this.focus();

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

  var rateError = document.getElementById('rate-error');

  formRate.addEventListener('submit', function (e) {
    e.preventDefault();

    rateError.textContent = '';

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
      rateError.textContent = 'Please enter the previous month\'s transaction count for Mastercard.';
      return;
    }
    if (network === 'paypal' && (inputs.paypalTotalOrders <= 0 || inputs.paypalTotalDisputes < 0)) {
      rateError.textContent = 'Please enter the rolling 3-month totals for PayPal.';
      return;
    }
    if (network !== 'paypal' && inputs.totalOrders <= 0) {
      rateError.textContent = 'Please enter your total orders this month.';
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
  var costError = document.getElementById('cost-error');

  formCost.addEventListener('submit', function (e) {
    e.preventDefault();

    costError.textContent = '';

    var inputs = {
      monthlyRevenue: parseFloat(document.getElementById('monthly-revenue').value) || 0,
      monthlyChargebacks: parseFloat(document.getElementById('monthly-chargebacks').value) || 0,
      avgOrderValue: parseFloat(document.getElementById('avg-order-value').value) || 0,
      chargebackFee: parseFloat(document.getElementById('chargeback-fee').value) || 0
    };

    if (inputs.monthlyRevenue <= 0 || inputs.monthlyChargebacks <= 0 || inputs.avgOrderValue <= 0) {
      costError.textContent = 'Please fill in all required fields with values greater than zero.';
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
