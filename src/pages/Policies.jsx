import Container from "../components/ui/Container.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import Reveal from "../components/ui/Reveal.jsx";

/**
 * Delivery, returns, warranty, privacy and terms on one page with jump links.
 * The pre-launch checklist requires all five to be published before launch —
 * the text below is a working draft and should be reviewed before going live.
 */
const sections = [
  {
    id: "delivery",
    title: "Delivery policy",
    paragraphs: [
      "We deliver to all 25 districts of Sri Lanka. Orders placed before 2pm on a working day are usually dispatched the same day; everything else goes out the next working day.",
      "Delivery costs Rs. 450 island-wide and is free on orders above Rs. 50,000. Most deliveries arrive within 2 to 4 working days. Colombo and Gampaha are often next day.",
      "The courier will call the phone number on your order before delivery, so please make sure it is one you can answer.",
    ],
  },
  {
    id: "returns",
    title: "Return policy",
    paragraphs: [
      "Unopened items in their original packaging can be returned within 7 days of delivery for a full refund. Return postage is paid by the customer unless the item was faulty or incorrect.",
      "Opened items can only be returned if they are faulty. Software issues, accidental damage and water damage are not covered by a return.",
      "Refunds are issued within 7 working days of us receiving the item back and checking its condition.",
    ],
  },
  {
    id: "warranty",
    title: "Warranty",
    paragraphs: [
      "Warranty length is listed in the specifications on every product page, and is typically 1 year for phones, laptops and tablets.",
      "Warranty covers manufacturing defects. It does not cover physical damage, liquid damage, or damage caused by unauthorised repairs.",
      "To make a claim, contact us with your order number and a description of the fault. Keep the original box and accessories where possible.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy policy",
    paragraphs: [
      "We collect only what we need to fulfil your order: your name, delivery address, phone number and email address. Your password is handled by our authentication provider and is never stored or visible to us.",
      "We share your name, address and phone number with the courier delivering your order. We do not sell your data to anyone.",
      "You can ask us to delete your account and personal data at any time by contacting us.",
    ],
  },
  {
    id: "terms",
    title: "Terms and conditions",
    paragraphs: [
      "Prices are in Sri Lankan Rupees and include taxes. We make every effort to keep prices and stock accurate, but if an item is mispriced or unavailable we will contact you before dispatch rather than charging you.",
      "Placing an order is an offer to buy. The order is accepted once we confirm it. We may cancel an order if the item is out of stock or if we cannot verify the delivery details.",
      "The final order total is calculated by us from the prices in our catalogue at the time the order is placed.",
    ],
  },
];

export default function Policies() {
  return (
    <Container className="py-6 xl:py-10">
      <Breadcrumbs trail={[{ label: "Home", to: "/" }, { label: "Policies" }]} />

      <div className="mt-4 max-w-2xl">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Policies
        </h1>
        <p className="mt-2 text-slate-600">
          Delivery, returns, warranty, privacy and the terms you agree to when you
          order.
        </p>
      </div>

      <div className="mt-8 grid gap-10 xl:grid-cols-[220px_1fr] xl:items-start">
        {/* Jump links, sticky on laptop */}
        <nav aria-label="Policies" className="xl:sticky xl:top-24">
          <ul className="flex flex-wrap gap-2 xl:flex-col xl:gap-1">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-brand-dark"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-10">
          {sections.map((section) => (
            <Reveal
              key={section.id}
              as="section"
              className="scroll-mt-28 rounded-2xl bg-white p-5 ring-1 ring-slate-200 sm:p-6"
            >
              <h2 id={section.id} className="scroll-mt-28 text-lg font-bold">
                {section.title}
              </h2>
              <div className="mt-3 space-y-3">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="leading-relaxed text-slate-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          ))}

          <p className="text-sm text-slate-500">
            These policies are a working draft and should be reviewed before launch.
          </p>
        </div>
      </div>
    </Container>
  );
}
