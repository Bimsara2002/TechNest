/**
 * TEMPORARY content for the admin screens that have no customer-facing source
 * yet. Replaced by the coupons, banners, reviews, messages and settings tables
 * at roadmap step 9 / Phase 2.
 */

export const sampleCoupons = [
  {
    id: 1,
    code: "NEWNEST10",
    type: "percentage",
    value: 10,
    expires_at: "2026-12-31T00:00:00Z",
    usage_limit: 200,
    used_count: 47,
    is_active: true,
  },
  {
    id: 2,
    code: "FREEDEL",
    type: "fixed",
    value: 450,
    expires_at: "2026-11-30T00:00:00Z",
    usage_limit: null,
    used_count: 118,
    is_active: true,
  },
  {
    id: 3,
    code: "AVURUDU24",
    type: "percentage",
    value: 15,
    expires_at: "2026-04-20T00:00:00Z",
    usage_limit: 500,
    used_count: 500,
    is_active: false,
  },
];

export const sampleBanners = [
  {
    id: 1,
    headline: "The tech you want, delivered",
    link: "/products",
    sort_order: 1,
    is_active: true,
  },
  {
    id: 2,
    headline: "Galaxy S Ultra lineup",
    link: "/products?category=mobiles",
    sort_order: 2,
    is_active: true,
  },
  {
    id: 3,
    headline: "Gaming laptops from Rs. 298,000",
    link: "/products?category=laptops",
    sort_order: 3,
    is_active: false,
  },
];

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

export const sampleMessages = [
  {
    id: "m1",
    name: "Dinuka Perera",
    email: "dinuka@example.lk",
    message:
      "Do you have the Legion Pro 5i in the 32GB configuration, and can you deliver to Matara this week?",
    is_read: false,
    created_at: "2026-10-12T11:30:00Z",
  },
  {
    id: "m2",
    name: "Harini S.",
    email: "harini@example.lk",
    message:
      "My order TN-00042 arrived yesterday. The warranty card was missing from the box, can you send it?",
    is_read: false,
    created_at: "2026-10-11T16:12:00Z",
  },
  {
    id: "m3",
    name: "Kasun A.",
    email: "kasun@example.lk",
    message: "Is the S23 Ultra price negotiable if I buy two?",
    is_read: true,
    created_at: "2026-10-08T08:05:00Z",
  },
];

export const sampleSettings = {
  shop_name: "TechNest",
  shop_phone: "+94 11 000 0000",
  shop_email: "hello@technest.lk",
  shop_address: "128 Galle Road, Dehiwala, Colombo",
  delivery_fee: 450,
  free_delivery_from: 50000,
  cod_enabled: true,
  payhere_enabled: false,
  bank_transfer_enabled: false,
};

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
