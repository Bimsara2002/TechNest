const rupees = new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 });

/**
 * The single place prices become text. Always "Rs. 249,900" - never "LKR" or "$".
 * Prices are stored as numbers; format only at render time.
 */
export const formatPrice = (amount) => `Rs. ${rupees.format(amount ?? 0)}`;

const dateFormatter = new Intl.DateTimeFormat("en-LK", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

export const formatDate = (value) => dateFormatter.format(new Date(value));
