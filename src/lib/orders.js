import { z } from "zod";
import { sampleProducts } from "./sampleProducts.js";
import { payablePrice } from "./products.js";

/**
 * Orders data layer.
 *
 * TEMPORARY: placeOrder() fabricates a local order so checkout can be designed
 * and walked through. At roadmap step 8 its body becomes a single call to the
 * place_order() Postgres function, which reads the real prices, checks stock,
 * computes the total and writes the row. The cart only ever sends product ids
 * and quantities — never prices.
 */
const FAKE_LATENCY_MS = 650;

/** Districts used for the delivery address. */
export const districts = [
  "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya",
  "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar",
  "Vavuniya", "Mullaitivu", "Batticaloa", "Ampara", "Trincomalee",
  "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla",
  "Monaragala", "Ratnapura", "Kegalle",
];

/**
 * Checkout validation. Shared between the form and (later) the server, so the
 * rules are written once. The browser check is for a fast, clear error message;
 * the database is what actually enforces it.
 */
export const checkoutSchema = z.object({
  full_name: z
    .string()
    .trim()
    .min(3, "Please enter your full name")
    .max(80, "That name is too long"),
  address: z
    .string()
    .trim()
    .min(8, "Please enter a full delivery address")
    .max(200, "That address is too long"),
  city: z.string().trim().min(1, "Please choose your district"),
  phone: z
    .string()
    .trim()
    .regex(
      /^(?:\+94|0)[1-9]\d{8}$/,
      "Enter a Sri Lankan number, like 0771234567",
    ),
  note: z.string().trim().max(300, "Please keep the note under 300 characters").optional(),
});

const ORDER_STATUSES = ["pending", "confirmed", "packed", "shipped", "delivered"];

export const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const statusTones = {
  pending: "warning",
  confirmed: "brand",
  packed: "brand",
  shipped: "brand",
  delivered: "success",
  cancelled: "danger",
};

export const orderTimeline = ORDER_STATUSES;

/** A couple of past orders so the order pages can be designed against content. */
const seededOrders = [
  {
    id: "a1",
    order_number: "TN-00042",
    created_at: "2026-09-28T10:12:00Z",
    status: "delivered",
    payment_method: "cod",
    payment_status: "paid",
    full_name: "K.A Bimsara Kaushal",
    address: "128 Galle Road, Dehiwala",
    city: "Colombo",
    phone: "0771234567",
    delivery_fee: 0,
    items: [
      { product_id: 2, name: "Galaxy S24 Ultra 5G", quantity: 1, price: 352000 },
      { product_id: 10, name: "65W GaN Fast Charger", quantity: 2, price: 9900 },
    ],
  },
  {
    id: "a2",
    order_number: "TN-00051",
    created_at: "2026-10-09T15:40:00Z",
    status: "shipped",
    payment_method: "cod",
    payment_status: "unpaid",
    full_name: "K.A Bimsara Kaushal",
    address: "128 Galle Road, Dehiwala",
    city: "Colombo",
    phone: "0771234567",
    delivery_fee: 450,
    items: [{ product_id: 8, name: "WH-1000XM5 Headphones", quantity: 1, price: 134000 }],
  },
];

const withTotal = (order) => ({
  ...order,
  subtotal: order.items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  total:
    order.items.reduce((sum, i) => sum + i.price * i.quantity, 0) + order.delivery_fee,
});

/** Orders created during this session, so a placed order appears in the list. */
const sessionOrders = [];

const settle = (value, ms = 220) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export async function fetchOrders() {
  const all = [...sessionOrders, ...seededOrders].map(withTotal);
  all.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return settle(all);
}

export async function fetchOrderById(id) {
  const order = [...sessionOrders, ...seededOrders].find((o) => o.id === id);
  if (!order) throw new Error("Order not found");
  return settle(withTotal(order));
}

export async function placeOrder({ details, items, deliveryFee }) {
  const lines = Object.entries(items)
    .map(([id, quantity]) => {
      const product = sampleProducts.find((p) => String(p.id) === String(id));
      if (!product) return null;
      return {
        product_id: product.id,
        name: product.name,
        quantity,
        // Step 8: the server reads this price, not the browser.
        price: payablePrice(product),
      };
    })
    .filter(Boolean);

  if (lines.length === 0) throw new Error("Your cart is empty");

  const sequence = 52 + sessionOrders.length;
  const order = {
    id: `s${sequence}`,
    order_number: `TN-${String(sequence).padStart(5, "0")}`,
    created_at: new Date().toISOString(),
    status: "pending",
    payment_method: "cod",
    payment_status: "unpaid",
    ...details,
    delivery_fee: deliveryFee,
    items: lines,
  };

  sessionOrders.unshift(order);
  return settle(withTotal(order), FAKE_LATENCY_MS);
}
