export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export const COLOR_PALETTE = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Olive", hex: "#808000" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Navy", hex: "#000080" },
  { name: "Gray", hex: "#808080" },
  { name: "Beige", hex: "#F5F5DC" },
  { name: "Green", hex: "#228B22" },
  { name: "Red", hex: "#DC143C" },
  { name: "Blue", hex: "#4169E1" },
  { name: "Pink", hex: "#FF69B4" },
  { name: "Purple", hex: "#800080" },
  { name: "Maroon", hex: "#800000" },
  { name: "Teal", hex: "#008080" },
  { name: "Coral", hex: "#FF7F50" },
  { name: "Khaki", hex: "#C3B091" },
  { name: "Indigo", hex: "#4B0082" },
  { name: "Gold", hex: "#FFD700" },
  { name: "Silver", hex: "#C0C0C0" },
  { name: "Cream", hex: "#FFFDD0" },
];

export const SORT_OPTIONS = [
  { label: "Latest", value: "-createdAt" },
  { label: "Popular", value: "-sold" },
  { label: "Best Selling", value: "-discount" },
  { label: "Price: Low to High", value: "sellingPrice" },
  { label: "Price: High to Low", value: "-sellingPrice" },
];

export const ORDER_STATUS = {
  pending: "Pending",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
  refunded: "Refunded",
};

export const PAYMENT_METHODS = [
  { id: "upi", label: "UPI", icon: "smartphone" },
];


