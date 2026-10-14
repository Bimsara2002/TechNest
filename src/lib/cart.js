import { payablePrice } from "./products.js";

/**
 * Delivery rules. These will come from the `settings` table once the admin
 * settings page exists; the keys already match (`delivery_fee`,
 * `free_delivery_from`).
 */
export const DELIVERY_FEE = 450;
export const FREE_DELIVERY_FROM = 50000;

/**
 * Totals for DISPLAY ONLY.
 *
 * The order total that is actually charged is recomputed inside the
 * place_order() database function from the real prices in the catalogue.
 * Nothing calculated here is ever sent to the server as money.
 */
export function cartTotals(lines) {
  const subtotal = lines.reduce(
    (sum, line) => sum + payablePrice(line.product) * line.quantity,
    0,
  );

  const qualifiesFree = subtotal >= FREE_DELIVERY_FROM;
  const deliveryFee = lines.length === 0 || qualifiesFree ? 0 : DELIVERY_FEE;

  return {
    subtotal,
    deliveryFee,
    total: subtotal + deliveryFee,
    qualifiesFree,
    awayFromFree: Math.max(0, FREE_DELIVERY_FROM - subtotal),
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
  };
}
