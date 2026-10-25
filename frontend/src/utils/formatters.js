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

/**
 * Robust comparator to sort transactions/items latest first (newest to oldest).
 * Compares date, then createdAt, then MongoDB ObjectId timestamp.
 */
export const compareLatestFirst = (a, b) => {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;

  // 1. Compare 'date' property
  const timeA = new Date(a.date || a.createdAt || a.startDate || 0).getTime() || 0;
  const timeB = new Date(b.date || b.createdAt || b.startDate || 0).getTime() || 0;

  if (timeB !== timeA) {
    return timeB - timeA;
  }

  // 2. If dates are equal (e.g. same day 00:00:00), compare createdAt timestamp
  const createdA = new Date(a.createdAt || a.date || 0).getTime() || 0;
  const createdB = new Date(b.createdAt || b.date || 0).getTime() || 0;

  if (createdB !== createdA) {
    return createdB - createdA;
  }

  // 3. Fallback to MongoDB ObjectId timestamp if available
  const idA = typeof a._id === 'string' && a._id.length === 24 ? parseInt(a._id.substring(0, 8), 16) : 0;
  const idB = typeof b._id === 'string' && b._id.length === 24 ? parseInt(b._id.substring(0, 8), 16) : 0;

  return idB - idA;
};

