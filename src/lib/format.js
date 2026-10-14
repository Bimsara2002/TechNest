const rupees = new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 });

/**
 * The single place prices become text. Always "Rs. 249,900" - never "LKR" or "$".
 * Prices are stored as numbers; format only at render time.
 */
export const formatPrice = (amount) => `Rs. ${rupees.format(amount ?? 0)}`;

/**
 * Short form for chart axes, where "Rs. 2,640,000" would collide with its
 * neighbours. Full precision still appears in tooltips and the table view.
 */
export const formatCompactPrice = (amount) => {
  if (Math.abs(amount) >= 1_000_000) return `Rs. ${(amount / 1_000_000).toFixed(1)}M`;
  if (Math.abs(amount) >= 1_000) return `Rs. ${Math.round(amount / 1_000)}k`;
  return `Rs. ${amount}`;
};

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export const formatDate = (value) => dateFormatter.format(new Date(value));
