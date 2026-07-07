import api from "./api";

export async function fetchWishlist() {
  const { data } = await api.get("/wishlist");
  return data?.data?.wishlist || [];
}

export async function addToWishlist(productId: string) {
  const { data } = await api.post("/wishlist", { productId });
  return data?.data?.wishlist || [];
}

export async function removeFromWishlist(productId: string) {
  const { data } = await api.delete(`/wishlist/${productId}`);
  return data?.data?.wishlist || [];
}
