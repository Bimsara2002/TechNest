import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBanner,
  createCoupon,
  deleteBanner,
  deleteCoupon,
  deleteMessage,
  fetchBanners,
  fetchCoupons,
  fetchCustomers,
  fetchMessages,
  fetchSettings,
  saveSettings,
  setCustomerBlocked,
  setCustomerRole,
  setMessageRead,
  updateBanner,
  updateCoupon,
} from "../lib/admin.js";

/**
 * TanStack Query wrappers around src/lib/admin.
 *
 * Admin lists are short and change while you are looking at them, so these
 * drop the app-wide 60s staleTime and refetch on mount. Every mutation
 * invalidates its own list rather than writing into the cache by hand: the
 * database fills in defaults (used_count, created_at, the order number) and
 * guessing them locally is how a screen ends up disagreeing with the table.
 */

export const adminKeys = {
  all: ["admin"],
  customers: ["admin", "customers"],
  messages: ["admin", "messages"],
  coupons: ["admin", "coupons"],
  banners: ["admin", "banners"],
  settings: ["admin", "settings"],
};

const liveList = (queryKey, queryFn) => ({
  queryKey,
  queryFn,
  staleTime: 15_000,
  retry: false,
});

// ------------------------------------------------------------- customers ----

export function useCustomers() {
  return useQuery(liveList(adminKeys.customers, fetchCustomers));
}

export function useSetCustomerBlocked() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setCustomerBlocked,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: adminKeys.customers }),
  });
}

export function useSetCustomerRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setCustomerRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.customers });
      // Promoting or demoting someone changes what they may see, and that
      // someone could be the person in another tab.
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
}

// -------------------------------------------------------------- messages ----

export function useMessages() {
  return useQuery(liveList(adminKeys.messages, fetchMessages));
}

export function useSetMessageRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setMessageRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.messages }),
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.messages }),
  });
}

// --------------------------------------------------------------- coupons ----

export function useCoupons() {
  return useQuery(liveList(adminKeys.coupons, fetchCoupons));
}

export function useSaveCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    // One hook for both: the form is the same, and whether it is an insert or
    // an update is just whether an id came with it.
    mutationFn: (values) =>
      values.id ? updateCoupon(values) : createCoupon(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.coupons }),
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.coupons }),
  });
}

// --------------------------------------------------------------- banners ----

export function useBanners() {
  return useQuery(liveList(adminKeys.banners, fetchBanners));
}

export function useSaveBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values) =>
      values.id ? updateBanner(values) : createBanner(values),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.banners }),
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: adminKeys.banners }),
  });
}

// -------------------------------------------------------------- settings ----

export function useSettings() {
  return useQuery({
    queryKey: adminKeys.settings,
    queryFn: fetchSettings,
    staleTime: 60_000,
    retry: false,
  });
}

export function useSaveSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveSettings,
    onSuccess: (values) => queryClient.setQueryData(adminKeys.settings, values),
  });
}
