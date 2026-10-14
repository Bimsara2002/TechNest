import { useParams } from "react-router-dom";
import Container from "../components/ui/Container.jsx";
import Button from "../components/ui/Button.jsx";
import Reveal3D from "../components/ui/Reveal3D.jsx";
import { LoadingState } from "../components/ui/States.jsx";
import { EmptyState } from "../components/ui/States.jsx";
import { CashIcon, TruckIcon } from "../components/icons.jsx";
import { formatPrice } from "../lib/format.js";
import { useOrder } from "../hooks/useOrders.js";

export default function OrderSuccess() {
  const { id } = useParams();
  const { data: order, isPending, isError } = useOrder(id);

  if (isPending) return <LoadingState label="Loading your order" />;

  if (isError) {
    return (
      <Container className="py-16">
        <EmptyState
          title="Order not found"
          message="We could not find that order. Check My orders for your latest purchases."
          actionLabel="Go to my orders"
          actionTo="/orders"
        />
      </Container>
    );
  }

  return (
    <Container className="py-12 xl:py-16">
      <div className="mx-auto max-w-lg text-center">
        {/* Confirmation mark, drawn in rather than popped */}
        <span className="animate-pop mx-auto flex size-20 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-emerald-200">
          <svg viewBox="0 0 48 48" className="size-10" aria-hidden="true">
            <path
              d="M14 24.5 21 31.5 34 18.5"
              fill="none"
              stroke="#059669"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="0"
              style={{ animation: "sweep 0.6s ease-out 0.2s both" }}
            />
          </svg>
        </span>

        <Reveal3D>
          <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
            Thank you! Your order is in.
          </h1>
          <p className="mt-2 text-slate-600">
            We have sent your order to the shop. You will get a call to confirm
            delivery.
          </p>

          <p className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm">
            Order number
            <span className="font-bold tracking-wide text-brand-dark">
              {order.order_number}
            </span>
          </p>
        </Reveal3D>
      </div>

      <Reveal3D className="mx-auto mt-10 max-w-lg rounded-2xl bg-white p-5 ring-1 ring-slate-200">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          What happens next
        </h2>

        <ul className="mt-4 space-y-4">
          <li className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <TruckIcon className="size-5" />
            </span>
            <div>
              <p className="font-semibold">We pack and dispatch</p>
              <p className="text-sm text-slate-600">
                Usually within 24 hours. You can follow the status under My orders.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand">
              <CashIcon className="size-5" />
            </span>
            <div>
              <p className="font-semibold">
                Pay {formatPrice(order.total)} on delivery
              </p>
              <p className="text-sm text-slate-600">
                Cash to the courier when your order arrives.
              </p>
            </div>
          </li>
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button to={`/orders/${order.id}`} className="flex-1">
            View order
          </Button>
          <Button to="/products" variant="secondary" className="flex-1">
            Keep shopping
          </Button>
        </div>
      </Reveal3D>
    </Container>
  );
}
