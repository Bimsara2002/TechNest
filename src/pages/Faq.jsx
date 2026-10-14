import Container from "../components/ui/Container.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import Button from "../components/ui/Button.jsx";
import Reveal3D from "../components/ui/Reveal3D.jsx";
import Accordion from "../components/ui/Accordion.jsx";

const faqs = [
  {
    question: "How long does delivery take?",
    answer:
      "Orders are usually dispatched within 24 hours and reach most of Sri Lanka in 2 to 4 working days. Colombo and Gampaha are often next day.",
  },
  {
    question: "How much is delivery?",
    answer:
      "Rs. 450 island-wide, and free on orders above Rs. 50,000. You will see the exact fee at checkout before you confirm anything.",
  },
  {
    question: "Can I pay cash?",
    answer:
      "Yes. Cash on Delivery is our main payment method — you pay the courier when the order reaches you. Card payment through PayHere is coming soon.",
  },
  {
    question: "Are the products genuine?",
    answer:
      "Every item we sell is genuine stock with a warranty. The warranty period is listed in the specifications on each product page.",
  },
  {
    question: "What if something arrives damaged?",
    answer:
      "Contact us within 48 hours of delivery with a photo and we will arrange a replacement or a refund. Please keep the original packaging.",
  },
  {
    question: "Can I return something I changed my mind about?",
    answer:
      "Unopened items in their original packaging can be returned within 7 days. Opened items can only be returned if they are faulty.",
  },
  {
    question: "Do you have a physical shop?",
    answer:
      "We are online only for now, which is how we keep prices down. You can reach us by phone or through the contact form any working day.",
  },
];

export default function Faq() {
  return (
    <Container className="py-6 xl:py-10">
      <Breadcrumbs trail={[{ label: "Home", to: "/" }, { label: "FAQ" }]} />

      <div className="mx-auto max-w-3xl">
        <div className="mt-4">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Frequently asked questions
          </h1>
          <p className="mt-2 text-slate-600">
            Delivery, payment, warranty and returns — the things customers ask most.
          </p>
        </div>

        <Reveal3D className="mt-8">
          <Accordion items={faqs} />
        </Reveal3D>

        <Reveal3D className="mt-10 rounded-2xl bg-brand-50 p-6 text-center ring-1 ring-brand-100">
          <h2 className="font-bold">Still have a question?</h2>
          <p className="mt-1 text-sm text-slate-600">
            We answer messages within a working day.
          </p>
          <Button to="/contact" className="mt-4">
            Contact us
          </Button>
        </Reveal3D>
      </div>
    </Container>
  );
}
