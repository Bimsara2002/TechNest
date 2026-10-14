import { useQuery } from "@tanstack/react-query";
import {
  fetchCartLines,
  fetchProductById,
  fetchProducts,
  fetchRelatedProducts,
} from "../lib/products.js";

/**
 * TanStack Query wrappers around src/lib/products.
 *
 * Query keys are declared here and nowhere else, so cache invalidation stays
 * in one layer. Pages and components import these, never the lib functions and
 * never the Supabase client directly.
 */

export const productKeys = {
  all: ["products"],
  list: (filters) => ["products", "list", filters],
  detail: (id) => ["products", "detail", String(id)],
  related: (id) => ["products", "related", String(id)],
  cart: (items) => ["cart", "lines", items],
};

export function useProducts(filters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
    placeholderData: (previous) => previous, // keeps the grid steady while filtering
  });
}

export function useProduct(id) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProductById(id),
    enabled: Boolean(id),
    retry: false, // "not found" is not worth retrying
  });
}

export function useRelatedProducts(product) {
  return useQuery({
    queryKey: productKeys.related(product?.id),
    queryFn: () => fetchRelatedProducts(product),
    enabled: Boolean(product),
  });
}

export function useCartLines(items) {
  return useQuery({
    queryKey: productKeys.cart(items),
    queryFn: () => fetchCartLines(items),
  });
}
