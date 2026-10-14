import Container from "../components/ui/Container.jsx";
import Breadcrumbs from "../components/ui/Breadcrumbs.jsx";
import Button from "../components/ui/Button.jsx";
import Reveal3D from "../components/ui/Reveal3D.jsx";
import Stagger from "../components/ui/Stagger.jsx";
import { CashIcon, ShieldIcon, TruckIcon } from "../components/icons.jsx";

const values = [
  {
    Icon: ShieldIcon,
    title: "Genuine stock only",
    body: "Every phone, laptop and accessory we list is genuine and carries a warranty. No grey imports, no surprises.",
  },
  {
    Icon: CashIcon,
    title: "Pay when it arrives",
    body: "Most of our customers prefer cash. Pay the courier at your door — no card needed, no deposit up front.",
  },
  {
    Icon: TruckIcon,
    title: "Anywhere in Sri Lanka",
    body: "From Colombo to Jaffna. Dispatch is usually within 24 hours, and delivery is free above Rs. 50,000.",
  },
];

const stats = [
  { value: "500+", label: "Products in stock" },
  { value: "25", label: "Districts covered" },
  { value: "24h", label: "Typical dispatch" },
  { value: "4.8★", label: "Customer rating" },
];

export default function About() {
  return (
    <>
      <Container className="py-6 xl:py-10">
        <Breadcrumbs trail={[{ label: "Home", to: "/" }, { label: "About" }]} />

        <div className="mt-4 max-w-2xl">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl xl:text-4xl">
            Tech worth trusting, at a price worth paying.
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">
            TechNest is an online shop for mobiles, laptops, tablets and the
            accessories that go with them. We started because buying a phone online
            in Sri Lanka usually meant choosing between a fair price and knowing what
            you would actually receive.
          </p>
        </div>
      </Container>

      {/* Stats band */}
      <div className="bg-brand-dark text-white">
        <Container>
          <Stagger className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </Stagger>
        </Container>
      </div>

      <Container className="py-12">
        <Reveal3D>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            What we stand by
          </h2>
        </Reveal3D>

        <Stagger className="mt-6 grid gap-4 md:grid-cols-3">
          {values.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="rounded-2xl bg-white p-6 ring-1 ring-slate-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand">
                <Icon className="size-6" />
              </span>
              <h3 className="mt-4 font-bold">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
            </div>
          ))}
        </Stagger>

        <Reveal3D className="mt-12 rounded-3xl bg-linear-to-br from-brand-700 via-brand to-brand-900 p-8 text-center text-white sm:p-10">
          <h2 className="text-2xl font-bold tracking-tight">Ready to look around?</h2>
          <p className="mx-auto mt-2 max-w-md text-brand-100">
            Five hundred products, all in stock, all under warranty.
          </p>
          <Button
            to="/products"
            variant="secondary"
            className="mt-6 bg-white text-brand-dark hover:bg-brand-50 hover:text-brand-dark"
          >
            Browse the shop
          </Button>
        </Reveal3D>
      </Container>
    </>
  );
}
