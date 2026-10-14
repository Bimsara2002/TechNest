/**
 * Breadth catalogue: the rest of the range, so every brand has a real shelf.
 *
 * TEMPORARY, like sampleProducts.js, and replaced wholesale when a supplier
 * feed arrives. Two things to understand before trusting anything here:
 *
 * 1. Prices are plausible Sri Lankan market figures, not quotes. Set real ones.
 * 2. Images are CATEGORY-REPRESENTATIVE, not model-exact — a real photograph of
 *    a laptop stands in for a laptop. The curated products in sampleProducts.js
 *    are the ones with verified model-specific photography. See CREDITS.md.
 */
import ph1 from "../assets/pool/ph1.webp";
import ph2 from "../assets/pool/ph2.webp";
import ph3 from "../assets/pool/ph3.webp";
import ph4 from "../assets/pool/ph4.webp";
import ph5 from "../assets/pool/ph5.webp";
import ph6 from "../assets/pool/ph6.webp";
import ph7 from "../assets/pool/ph7.webp";
import ph8 from "../assets/pool/ph8.webp";
import lp1 from "../assets/pool/lp1.webp";
import lp2 from "../assets/pool/lp2.webp";
import lp3 from "../assets/pool/lp3.webp";
import lp4 from "../assets/pool/lp4.webp";
import lp5 from "../assets/pool/lp5.webp";
import au1 from "../assets/pool/au1.webp";
import au2 from "../assets/pool/au2.webp";
import au3 from "../assets/pool/au3.webp";
import au4 from "../assets/pool/au4.webp";
import au5 from "../assets/pool/au5.webp";
import au6 from "../assets/pool/au6.webp";
import au7 from "../assets/pool/au7.webp";
import ac1 from "../assets/pool/ac1.webp";
import ac2 from "../assets/pool/ac2.webp";
import ac3 from "../assets/pool/ac3.webp";
import ac4 from "../assets/pool/ac4.webp";
import ac5 from "../assets/pool/ac5.webp";
import ac6 from "../assets/pool/ac6.webp";
import ac7 from "../assets/pool/ac7.webp";
import tb1 from "../assets/pool/tb1.webp";
import wt1 from "../assets/pool/wt1.webp";
import wt2 from "../assets/pool/wt2.webp";
import brandGoogle from "../assets/pool/brand-google.webp";
import brandBose from "../assets/pool/brand-bose.webp";
import brandBose2 from "../assets/pool/brand-bose2.webp";
import brandRgb from "../assets/pool/brand-rgb.webp";
import brandRgb2 from "../assets/pool/brand-rgb2.webp";
import brandAcer from "../assets/pool/brand-acer.webp";
import brandDell from "../assets/pool/brand-dell.webp";
import brandLenovo from "../assets/pool/brand-lenovo.webp";

const pools = {
  mobiles: [ph1, ph2, ph3, ph4, ph5, ph6, ph7, ph8],
  laptops: [lp1, lp2, lp3, lp4, lp5],
  audio: [au1, au2, au3, au4, au5, au6, au7],
  accessories: [ac1, ac2, ac3, ac4, ac5, ac6, ac7],
  tablets: [tb1],
  watches: [wt1, wt2],
};

/**
 * Brand-specific photography, used ahead of the generic category pool.
 *
 * Each has the manufacturer's own mark legible in the shot — a Pixel with the
 * G logo, BOSE on the earcup — so a Google product shows a Google phone rather
 * than "a phone".
 *
 * Deliberately mixed with neutral images rather than used alone. A brand photo
 * repeated across ten models puts, say, a Nitro render on a Swift Go listing:
 * right brand, wrong product, which is worse than an obvious stand-in. Mixing
 * also stops four identical cards appearing side by side in a filtered grid.
 *
 * The real fix is a per-product photo — see src/lib/productPhotos.js, which
 * beats everything here. Run `npm run photos:todo` for what is still missing.
 */
const brandImages = {
  "Google:mobiles": [brandGoogle, ph2, ph5],
  "Bose:audio": [brandBose, brandBose2, au2, au3],
  "Razer:laptops": [brandRgb, brandRgb2, lp4],
  "MSI:laptops": [brandRgb2, brandRgb, lp5],
  "Acer:laptops": [brandAcer, lp1, lp3, lp5],
  "Dell:laptops": [brandDell, lp2, lp4],
  "Lenovo:laptops": [brandLenovo, lp3, lp1],
};

/** Spec sheets by category. Enough to populate the product page table. */
const specTemplates = {
  mobiles: { Screen: "6.7 inch AMOLED, 120Hz", Storage: "256GB", Battery: "5000mAh", Warranty: "1 year" },
  laptops: { RAM: "16GB", Storage: "512GB SSD", Screen: "15.6 inch FHD", Warranty: "1 year" },
  tablets: { Storage: "128GB", Screen: "11 inch, 90Hz", Battery: "7000mAh", Warranty: "1 year" },
  audio: { Type: "Wireless", Battery: "Up to 30 hours", "Noise cancelling": "Yes", Warranty: "1 year" },
  watches: { Screen: "AMOLED", Battery: "Up to 2 days", "Water resistance": "5ATM", Warranty: "1 year" },
  accessories: { Compatibility: "USB-C devices", Warranty: "1 year" },
};

const blurbs = {
  mobiles: "Genuine stock with warranty, delivered anywhere in Sri Lanka. Pay cash when it arrives.",
  laptops: "Ready to work out of the box, with warranty and island-wide delivery.",
  tablets: "Big screen, long battery, and warranty included.",
  audio: "Proper sound without the showroom markup. Warranty included.",
  watches: "Tracks the day without needing a charger every night.",
  accessories: "The small thing that makes the expensive thing usable.",
};

/**
 * [name, category, price] per brand. Keeping it to a table rather than full
 * objects is what makes two hundred products reviewable at a glance.
 */
const models = {
  Samsung: [
    ["Galaxy Z Flip6", "mobiles", 395000], ["Galaxy A55 5G", "mobiles", 132000],
    ["Galaxy Tab S9 FE", "tablets", 172000],
  ],
  Xiaomi: [
    ["Xiaomi 14 Ultra", "mobiles", 345000], ["Xiaomi 14T Pro", "mobiles", 198000],
    ["Redmi Note 14 Pro+ 5G", "mobiles", 112000], ["POCO X7 Pro", "mobiles", 98000],
    ["Redmi Note 14", "mobiles", 72500], ["Redmi 14C", "mobiles", 42500],
    ["Redmi Pad SE", "tablets", 58000], ["Smart Band 9", "watches", 14500],
    ["Redmi Buds 6", "audio", 9800], ["Xiaomi 67W Charger", "accessories", 7500],
  ],
  Google: [
    ["Pixel 9 Pro Fold", "mobiles", 685000], ["Pixel 9 Pro XL", "mobiles", 415000],
    ["Pixel 9 Pro", "mobiles", 365000], ["Pixel 8 Pro", "mobiles", 298000],
    ["Pixel 9", "mobiles", 268000], ["Pixel 8a", "mobiles", 172000],
    ["Pixel Tablet", "tablets", 148000], ["Pixel Watch 3", "watches", 112000],
    ["Pixel Buds Pro 2", "audio", 68000], ["Pixel 30W Charger", "accessories", 9500],
  ],
  OnePlus: [
    ["OnePlus 13", "mobiles", 298000], ["OnePlus 12", "mobiles", 245000],
    ["OnePlus 13R", "mobiles", 178000], ["OnePlus 12R", "mobiles", 148000],
    ["Nord 4", "mobiles", 128000], ["Nord CE4", "mobiles", 86000],
    ["OnePlus Pad 2", "tablets", 165000], ["OnePlus Watch 2", "watches", 92000],
    ["Buds Pro 3", "audio", 42000], ["100W SuperVOOC Charger", "accessories", 12500],
  ],
  OPPO: [
    ["Find X8 Pro", "mobiles", 325000], ["Find X8", "mobiles", 268000],
    ["Reno 12 Pro", "mobiles", 165000], ["Reno 12", "mobiles", 128000],
    ["OPPO A80", "mobiles", 68000], ["OPPO A60", "mobiles", 52000],
    ["OPPO Pad 3", "tablets", 142000], ["Enco X3", "audio", 38000],
    ["Enco Air 4 Pro", "audio", 18500], ["SUPERVOOC 80W Charger", "accessories", 11500],
  ],
  vivo: [
    ["X200 Pro", "mobiles", 318000], ["X200", "mobiles", 258000],
    ["V40 Pro", "mobiles", 168000], ["V40", "mobiles", 132000],
    ["vivo Y39", "mobiles", 58000], ["vivo Y29", "mobiles", 44500],
    ["vivo Pad 3", "tablets", 138000], ["Watch GT", "watches", 42000],
    ["TWS 3e Earbuds", "audio", 12500], ["80W FlashCharge Adapter", "accessories", 9800],
  ],
  Huawei: [
    ["Mate 70 Pro", "mobiles", 345000], ["Mate 70", "mobiles", 285000],
    ["nova 13 Pro", "mobiles", 168000], ["nova 13", "mobiles", 132000],
    ["MatePad 11.5", "tablets", 148000], ["Watch GT 5 Pro", "watches", 132000],
    ["Watch Fit 3", "watches", 48000], ["FreeBuds Pro 4", "audio", 58000],
    ["FreeBuds SE 3", "audio", 16500], ["SuperCharge 88W Adapter", "accessories", 13500],
  ],
  HP: [
    ["OMEN 16 RTX 4070", "laptops", 585000], ["EliteBook 840 G11", "laptops", 625000],
    ["Envy x360 14", "laptops", 452000], ["ProBook 450 G10", "laptops", 398000],
    ["Victus 15 RTX 4050", "laptops", 345000], ["Pavilion Aero 13", "laptops", 312000],
    ["Pavilion 15 Core i5", "laptops", 268000], ["HP 15s Ryzen 5", "laptops", 198000],
    ["HP 65W USB-C Adapter", "accessories", 14500], ["Wireless Mouse 220", "accessories", 4500],
  ],
  Dell: [
    ["Alienware m16 R2", "laptops", 985000], ["XPS 15 9530", "laptops", 825000],
    ["XPS 13 9340", "laptops", 685000], ["Latitude 5450", "laptops", 548000],
    ["G15 Gaming RTX 4060", "laptops", 425000], ["Inspiron 14 5440", "laptops", 285000],
    ["Inspiron 15 3530", "laptops", 232000], ["Vostro 3530", "laptops", 215000],
    ["Dell 65W USB-C Adapter", "accessories", 13500], ["MS3320W Mouse", "accessories", 7500],
  ],
  Lenovo: [
    ["ThinkPad X1 Carbon Gen 12", "laptops", 785000], ["Legion Slim 5 16", "laptops", 495000],
    ["Yoga 7i 2-in-1", "laptops", 425000], ["LOQ 15 RTX 4060", "laptops", 385000],
    ["ThinkPad E14 Gen 6", "laptops", 365000], ["IdeaPad Slim 5 14", "laptops", 245000],
    ["IdeaPad Slim 3 15", "laptops", 178000], ["Tab M11 with Pen", "tablets", 86000],
    ["Lenovo 65W USB-C Adapter", "accessories", 11500],
  ],
  Asus: [
    ["ROG Zephyrus G14", "laptops", 695000], ["ROG Strix G16", "laptops", 585000],
    ["Zenbook 14 OLED", "laptops", 425000], ["ROG Ally X", "accessories", 395000],
    ["TUF Gaming F15", "laptops", 342000], ["Vivobook S14 OLED", "laptops", 298000],
    ["ExpertBook B1", "laptops", 268000], ["Vivobook 15 Core i5", "laptops", 215000],
    ["Asus 65W Adapter", "accessories", 10500],
  ],
  MSI: [
    ["Raider GE78 HX", "laptops", 1150000], ["Stealth 16 AI Studio", "laptops", 985000],
    ["Vector 16 HX RTX 4080", "laptops", 895000], ["Sword 16 HX RTX 4070", "laptops", 485000],
    ["Prestige 13 AI Evo", "laptops", 465000], ["Thin 15 RTX 4060", "laptops", 328000],
    ["Cyborg 15 RTX 4050", "laptops", 285000], ["Modern 14 Core i5", "laptops", 198000],
    ["MSI 120W Adapter", "accessories", 16500],
  ],
  Acer: [
    ["Predator Triton 14", "laptops", 785000], ["Predator Helios Neo 16", "laptops", 565000],
    ["Nitro 5 RTX 4060", "laptops", 365000], ["Swift Go 14 OLED", "laptops", 312000],
    ["TravelMate P2 14", "laptops", 268000], ["Aspire 5 Core i5", "laptops", 225000],
    ["Aspire 3 Ryzen 5", "laptops", 165000], ["Chromebook Plus 515", "laptops", 142000],
    ["Acer 65W Adapter", "accessories", 9500],
  ],
  Sony: [
    ["WF-1000XM5 Earbuds", "audio", 98000], ["WH-ULT900N", "audio", 72000],
    ["INZONE H5 Headset", "audio", 62000], ["SRS-XG300", "audio", 112000],
    ["ULT FIELD 1", "audio", 48000], ["WH-CH720N", "audio", 42000],
    ["WF-C710N Earbuds", "audio", 38000], ["SRS-XE200", "audio", 38000],
  ],
  JBL: [
    ["Boombox 3", "audio", 198000], ["Charge 5", "audio", 68000],
    ["Live 660NC", "audio", 52000], ["Tune 520BT", "audio", 18500],
    ["Quantum 200 Headset", "audio", 16500], ["Go 4", "audio", 14500],
  ],
  Bose: [
    ["Smart Soundbar 600", "audio", 285000], ["QuietComfort Ultra Headphones", "audio", 158000],
    ["SoundLink Home", "audio", 138000], ["SoundLink Revolve+ II", "audio", 128000],
    ["QuietComfort Ultra Earbuds", "audio", 128000], ["QuietComfort Headphones", "audio", 112000],
    ["Ultra Open Earbuds", "audio", 112000], ["QuietComfort Earbuds II", "audio", 92000],
    ["SoundLink Flex", "audio", 62000], ["SoundLink Micro", "audio", 42000],
  ],
  LG: [
    ["gram 16", "laptops", 685000], ["gram 14", "laptops", 585000],
    ["UltraWide 34WQ60C", "accessories", 225000], ["UltraGear 27GP850", "accessories", 185000],
    ["Soundbar S65Q", "audio", 148000], ["XBOOM 360 XO3", "audio", 78000],
    ["TONE Free T90S", "audio", 68000], ["XBOOM Go XG7", "audio", 52000],
    ["TONE Free T80", "audio", 48000], ["TONE Free FP5", "audio", 38000],
  ],
  Razer: [
    ["Blade 16 RTX 4080", "laptops", 1285000], ["Blade 14 RTX 4070", "laptops", 985000],
    ["Huntsman V3 Pro", "accessories", 85000], ["BlackShark V2 Pro", "audio", 68000],
    ["BlackWidow V4 Keyboard", "accessories", 68000], ["Viper V3 Pro Mouse", "accessories", 58000],
    ["DeathAdder V3 Pro Mouse", "accessories", 52000], ["Kraken V3 Headset", "audio", 42000],
    ["Kishi V2 Controller", "accessories", 32000], ["Basilisk V3 Mouse", "accessories", 24500],
  ],
  Anker: [
    ["Soundcore Liberty 4 NC", "audio", 32000], ["Soundcore Life Q30", "audio", 28500],
    ["Soundcore Motion 300", "audio", 24500], ["MagGo Wireless Charger", "accessories", 16500],
    ["20000mAh Power Bank", "accessories", 14500], ["65W GaN Fast Charger", "accessories", 12900],
    ["100W Car Charger", "accessories", 11500], ["10000mAh Nano", "accessories", 9500],
    ["7-in-1 USB-C Hub", "accessories", 9800], ["PowerLine III USB-C Cable", "accessories", 3500],
  ],
};

/**
 * Deterministic pseudo-random from the product id, so stock levels, ratings
 * and discounts look varied but never change between renders or reloads.
 */
const vary = (seed, salt) => {
  const n = Math.sin(seed * 9301 + salt * 49297) * 233280;
  return n - Math.floor(n);
};

let nextId = 1000;

export const generatedProducts = Object.entries(models).flatMap(([brand, rows]) =>
  rows.map(([name, category, price], index) => {
    const id = (nextId += 1);
    // A verified brand photo wins over the generic category pool.
    const pool = brandImages[`${brand}:${category}`] ?? pools[category] ?? pools.accessories;

    // Offsetting by the running id rather than the per-brand index stops the
    // same photo landing on neighbouring cards in a mixed grid.
    const image = pool[(id + index) % pool.length];

    const discounted = vary(id, 1) > 0.55;
    const stockRoll = vary(id, 2);

    return {
      id,
      name,
      brand,
      category,
      imageSrc: image,
      price,
      discount_price: discounted ? Math.round((price * 0.92) / 500) * 500 : null,
      stock: stockRoll > 0.93 ? 0 : Math.max(1, Math.round(stockRoll * 24)),
      rating: Math.round((4 + vary(id, 3) * 0.9) * 10) / 10,
      reviews: Math.round(12 + vary(id, 4) * 320),
      description: `${name} from ${brand}. ${blurbs[category]}`,
      specs: specTemplates[category],
    };
  }),
);
