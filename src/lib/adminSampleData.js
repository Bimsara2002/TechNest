/**
 * TEMPORARY content for the two admin screens that cannot read real rows yet.
 *
 * Coupons, banners, messages, customers and settings now come from Supabase
 * through src/lib/admin.js. What is left here needs the catalogue to exist in
 * the database first:
 *
 * - sampleReviews: a review belongs to a product and a delivered order, so
 *   there can be none until roadmap step 5 seeds products and step 8 writes
 *   orders.
 * - monthlyRevenue / topSellers: both are aggregates over real orders.
 */

export const sampleReviews = [
  {
    id: "r1",
    product: "Galaxy S24 Ultra 5G",
    author: "Nimal P.",
    rating: 5,
    comment:
      "Camera is unreal and delivery took two days to Kandy. Packaging was sealed, phone was genuine.",
    approved: false,
    created_at: "2026-10-11T09:20:00Z",
  },
  {
    id: "r2",
    product: "WH-1000XM5 Headphones",
    author: "Sanduni W.",
    rating: 4,
    comment:
      "Noise cancelling is excellent. Took a week to arrive which is the only reason this is not five stars.",
    approved: true,
    created_at: "2026-10-06T14:02:00Z",
  },
  {
    id: "r3",
    product: "65W GaN Fast Charger",
    author: "Ruwan J.",
    rating: 2,
    comment: "Charges fine but gets quite warm with a laptop plugged in.",
    approved: false,
    created_at: "2026-10-02T18:45:00Z",
  },
];

/** Last six months of revenue, for the reports page. */
export const monthlyRevenue = [
  { month: "May", revenue: 1240000, orders: 18 },
  { month: "Jun", revenue: 1685000, orders: 24 },
  { month: "Jul", revenue: 1420000, orders: 21 },
  { month: "Aug", revenue: 2180000, orders: 31 },
  { month: "Sep", revenue: 2640000, orders: 38 },
  { month: "Oct", revenue: 1980000, orders: 27 },
];

export const topSellers = [
  { name: "Galaxy S24 Ultra 5G", units: 34, revenue: 11968000 },
  { name: "Redmi-class mid range", units: 28, revenue: 2517000 },
  { name: "TUF Gaming A15", units: 19, revenue: 6631000 },
  { name: "65W GaN Fast Charger", units: 86, revenue: 851400 },
  { name: "Tune 770NC", units: 41, revenue: 1430900 },
];
