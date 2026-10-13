import PagePlaceholder from "../../components/PagePlaceholder.jsx";

export default function Reports() {
  return (
    <PagePlaceholder
      title="Reports"
      summary="How the shop is performing."
      step="Phase 2"
      features={[
        "Revenue by day, week or month with CSV export",
        "Best sellers and slow movers",
      ]}
    />
  );
}
