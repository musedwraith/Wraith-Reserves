export const fmt = (n) =>
  (n || 0).toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });
