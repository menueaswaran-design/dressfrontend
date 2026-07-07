export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

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
  { id: "credit_card", label: "Credit Card", icon: "credit-card" },
  { id: "debit_card", label: "Debit Card", icon: "credit-card" },
  { id: "wallet", label: "Wallet", icon: "wallet" },
  { id: "net_banking", label: "Net Banking", icon: "building" },
  { id: "cod", label: "Cash on Delivery", icon: "banknote" },
];


