import PagePlaceholder from "../../components/PagePlaceholder.jsx";

export default function Coupons() {
  return (
    <PagePlaceholder
      title="Coupons"
      summary="Discount codes."
      step="Phase 2"
      features={["Percentage or fixed amount", "Expiry date", "Usage limit and count"]}
    />
  );
}
