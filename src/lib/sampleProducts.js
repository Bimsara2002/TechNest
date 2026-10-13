/**
 * TEMPORARY sample data so the design can be built and reviewed before the
 * database exists. Delete this file at roadmap step 3/5, when products come
 * from Supabase through src/hooks.
 *
 * Shapes match the `products` table in the feature guide, so swapping the
 * source does not change any component.
 */

export const categories = [
  { slug: "mobiles", name: "Mobiles", blurb: "Flagships to budget" },
  { slug: "laptops", name: "Laptops", blurb: "Work and gaming" },
  { slug: "tablets", name: "Tablets", blurb: "Draw, read, watch" },
  { slug: "accessories", name: "Accessories", blurb: "Cases and chargers" },
  { slug: "audio", name: "Audio", blurb: "Buds and headphones" },
  { slug: "watches", name: "Smart Watches", blurb: "Track every day" },
];

export const sampleProducts = [
  {
    id: 1,
    name: "Galaxy S24 Ultra 5G",
    brand: "Samsung",
    category: "mobiles",
    price: 389000,
    discount_price: 352000,
    stock: 7,
    rating: 4.8,
    reviews: 126,
  },
  {
    id: 2,
    name: "MacBook Air 13 M3",
    brand: "Apple",
    category: "laptops",
    price: 498000,
    discount_price: null,
    stock: 4,
    rating: 4.9,
    reviews: 83,
  },
  {
    id: 3,
    name: "Redmi Note 13 Pro",
    brand: "Xiaomi",
    category: "mobiles",
    price: 97500,
    discount_price: 89900,
    stock: 23,
    rating: 4.5,
    reviews: 341,
  },
  {
    id: 4,
    name: "Pavilion 15 Core i5",
    brand: "HP",
    category: "laptops",
    price: 268000,
    discount_price: null,
    stock: 2,
    rating: 4.3,
    reviews: 57,
  },
  {
    id: 5,
    name: "Galaxy Tab S9 FE",
    brand: "Samsung",
    category: "tablets",
    price: 172000,
    discount_price: 159000,
    stock: 9,
    rating: 4.6,
    reviews: 48,
  },
  {
    id: 6,
    name: "WH-1000XM5 Headphones",
    brand: "Sony",
    category: "audio",
    price: 134000,
    discount_price: null,
    stock: 0,
    rating: 4.9,
    reviews: 212,
  },
  {
    id: 7,
    name: "Watch Series 9 45mm",
    brand: "Apple",
    category: "watches",
    price: 186000,
    discount_price: 174500,
    stock: 11,
    rating: 4.7,
    reviews: 95,
  },
  {
    id: 8,
    name: "65W GaN Fast Charger",
    brand: "Anker",
    category: "accessories",
    price: 12900,
    discount_price: 9900,
    stock: 46,
    rating: 4.4,
    reviews: 178,
  },
];
