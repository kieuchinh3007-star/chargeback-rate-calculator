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
