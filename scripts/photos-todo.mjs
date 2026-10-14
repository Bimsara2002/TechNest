/**
 * Lists every product that does not yet have its own photograph, with the
 * exact filename it expects.
 *
 *   npm run photos:todo            every product still missing one
 *   npm run photos:todo -- Acer    just that brand
 *
 * Reads the catalogue files as text rather than importing them: they import
 * .webp assets, which only Vite can resolve.
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetsDir = path.join(root, "src/assets/products");

// Must stay in step with productSlug() in src/lib/productPhotos.js.
const slugify = (brand, name) => {
  const b = brand.toLowerCase();
  const n = name.toLowerCase();
  const combined = n.startsWith(b) ? n : `${b}-${n}`;
  return combined.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
};

/** Curated entries: full objects, so pull brand + name + any `image` key. */
async function readCurated() {
  const text = await readFile(path.join(root, "src/lib/sampleProducts.js"), "utf8");
  const blocks = text.split("\n  {").slice(1);

  return blocks
    .filter((block) => block.includes("category:"))
    .map((block) => ({
      name: block.match(/name: "([^"]+)"/)?.[1],
      brand: block.match(/brand: "([^"]+)"/)?.[1],
      image: block.match(/image: "([^"]+)"/)?.[1] ?? null,
    }))
    .filter((product) => product.name && product.brand);
}

/** Generated entries: a `Brand: [[name, category, price], ...]` table. */
async function readGenerated() {
  const text = await readFile(path.join(root, "src/lib/generatedProducts.js"), "utf8");
  const start = text.indexOf("const models = {");
  const table = text.slice(start, text.indexOf("\n};", start));

  return [...table.matchAll(/^ {2}([A-Za-z]+): \[([\s\S]*?)^ {2}\],/gm)].flatMap(
    ([, brand, body]) =>
      [...body.matchAll(/\["([^"]+)", "[a-z]+", \d+\]/g)].map(([, name]) => ({
        brand,
        name,
        image: null,
      })),
  );
}

const have = new Set(
  (await readdir(assetsDir).catch(() => [])).map((file) =>
    file.replace(/\.[^.]+$/, ""),
  ),
);

const products = [...(await readCurated()), ...(await readGenerated())];
const filter = process.argv[2]?.toLowerCase();

const missing = products
  .filter((product) => !filter || product.brand.toLowerCase() === filter)
  .filter((product) => {
    const slug = slugify(product.brand, product.name);
    return !have.has(slug) && !(product.image && have.has(product.image));
  });

const byBrand = missing.reduce((acc, product) => {
  (acc[product.brand] ??= []).push(product);
  return acc;
}, {});

const total = products.filter((p) => !filter || p.brand.toLowerCase() === filter).length;

console.log(
  `\n${total - missing.length} of ${total} products have their own photo.` +
    ` ${missing.length} still need one.\n`,
);

for (const [brand, items] of Object.entries(byBrand).sort()) {
  console.log(`${brand} (${items.length})`);
  for (const item of items) {
    console.log(`   src/assets/products/${slugify(brand, item.name)}.webp   ${item.name}`);
  }
  console.log("");
}

if (missing.length) {
  console.log("Drop a file at any path above and that product picks it up.");
  console.log("No code change needed. WebP, around 800x800.\n");
}
