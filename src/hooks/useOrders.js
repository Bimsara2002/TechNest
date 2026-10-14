import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchOrderById, fetchOrders, placeOrder } from "../lib/orders.js";

export const orderKeys = {
  all: ["orders"],
  list: () => ["orders", "list"],
  detail: (id) => ["orders", "detail", String(id)],
};

export function useOrders() {
  return useQuery({ queryKey: orderKeys.list(), queryFn: fetchOrders });
}

export function useOrder(id) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrderById(id),
    enabled: Boolean(id),
    retry: false,
  });
}

export function usePlaceOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: placeOrder,
    onSuccess: () => {
      // The new order must appear in "My orders" immediately.
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
