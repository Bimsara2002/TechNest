import PagePlaceholder from "../components/PagePlaceholder.jsx";

export default function Checkout() {
  return (
    <PagePlaceholder
      title="Checkout"
      summary="Delivery details and order confirmation. Cash on Delivery for version 1."
      step="8"
      features={[
        "Login required; return here after signing in with the cart intact",
        "Delivery details: name, address, city, Sri Lankan phone format",
        "Delivery fee from shop rules",
        "Order review before confirming",
        "Total is calculated on the server, never trusted from the browser",
      ]}
    />
  );
}
