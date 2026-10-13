import PagePlaceholder from "../components/PagePlaceholder.jsx";

export default function Products() {
  return (
    <PagePlaceholder
      title="Products"
      summary="Browse the catalogue with search, filters and sorting."
      step="5"
      features={[
        "Grid: 2 columns mobile, 3 tablet, 4 laptop",
        "Card: image, name, price, stock badge, Add to Cart",
        "Search by product name with instant results",
        "Filters: category, brand, price range (slide-up panel on mobile)",
        "Sort: newest, price low to high, price high to low",
        "Pagination or Load More",
        "Skeleton loading, error message, No products found",
      ]}
    />
  );
}
