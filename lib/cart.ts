import api from "./api";

export async function fetchCart() {
  const { data } = await api.get("/cart");
  return data?.data?.cart || [];
}

export async function addToCart(productId: string, quantity = 1, size?: string, color?: string) {
  const { data } = await api.post("/cart", { productId, quantity, size, color });
  return data?.data?.cart || [];
}

export async function updateCartItem(itemId: string, quantity: number) {
  const { data } = await api.put(`/cart/${itemId}`, { quantity });
  return data?.data?.cart || [];
}

export async function removeFromCart(itemId: string) {
  const { data } = await api.delete(`/cart/${itemId}`);
  return data?.data?.cart || [];
}

export async function clearCart() {
  const { data } = await api.delete("/cart");
  return data?.data?.cart || [];
}
