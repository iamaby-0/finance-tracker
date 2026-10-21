/**
 * Formats an amount as Indian Rupee (INR) currency string
 * e.g., 124520 => "₹1,24,520"
 */
export const formatCurrency = (amount, includeSign = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '₹0';
  }
  
  const num = Math.abs(Number(amount));
  const formatted = num.toLocaleString('en-IN', {
    maximumFractionDigits: 0
  });

  const sign = includeSign ? (amount > 0 ? '+ ' : amount < 0 ? '- ' : '') : '';
  return `${sign}₹${formatted}`;
};

/**
 * Formats a date string or Date object to "MMM DD, YYYY" format
 * e.g., "2026-10-20" => "Oct 20, 2026"
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

/**
 * Calculates percentage from spent and total amounts
 */
export const calculatePercentage = (spent, total) => {
  if (!total || total <= 0) return 0;
  return Math.min(100, Math.round((spent / total) * 100));
};
