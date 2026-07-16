"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  UilMobileAndroid, UilCheckCircle, UilArrowRight, UilArrowLeft,
  UilExclamationCircle, UilShieldCheck, UilMoneyBill, UilCopy,
  UilExternalLinkAlt, UilBuilding, UilQrcodeScan, UilWallet, UilLock
} from "@iconscout/react-unicons";
import { useCartStore } from "@/store/cart";
import { useAuthStore } from "@/store/auth";
import { formatPrice } from "@/lib/utils";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { GooglePayIcon, PhonePeIcon, PaytmIcon, BHIMIcon, UPI_APP_ICONS } from "@/components/ui/UpiAppIcons";

const STORE_UPI_ID = "dressstore@upi";
const STORE_UPI_NAME = "Dress Store";

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", icon: GooglePayIcon, color: "#4285F4" },
  { id: "phonepe", name: "PhonePe", icon: PhonePeIcon, color: "#5F259F" },
  { id: "paytm", name: "Paytm", icon: PaytmIcon, color: "#00BAF2" },
  { id: "bhim", name: "BHIM", icon: BHIMIcon, color: "#1A8B4C" },
];

declare global {
  interface Window { Razorpay: any; }
}

function QrCodeGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 180;
    const cell = size / 25;
    canvas.width = size;
    canvas.height = size;

    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, size, size);

    const positions: [number, number][] = [];
    for (let r = 0; r < 25; r++) {
      for (let c = 0; c < 25; c++) {
        if (Math.random() > 0.45) positions.push([r, c]);
      }
    }

    const corners = [
      { r: 0, c: 0 }, { r: 0, c: 1 }, { r: 0, c: 2 }, { r: 0, c: 3 }, { r: 0, c: 4 }, { r: 0, c: 5 }, { r: 0, c: 6 },
      { r: 1, c: 0 }, { r: 1, c: 6 }, { r: 2, c: 0 }, { r: 2, c: 6 }, { r: 3, c: 0 }, { r: 3, c: 6 },
      { r: 4, c: 0 }, { r: 4, c: 1 }, { r: 4, c: 2 }, { r: 4, c: 3 }, { r: 4, c: 4 }, { r: 4, c: 5 }, { r: 4, c: 6 },
      { r: 6, c: 0 }, { r: 6, c: 4 },
      { r: 0, c: 18 }, { r: 0, c: 19 }, { r: 0, c: 20 }, { r: 0, c: 21 }, { r: 0, c: 22 }, { r: 0, c: 23 }, { r: 0, c: 24 },
      { r: 1, c: 18 }, { r: 1, c: 24 }, { r: 2, c: 18 }, { r: 2, c: 24 }, { r: 3, c: 18 }, { r: 3, c: 24 },
      { r: 4, c: 18 }, { r: 4, c: 19 }, { r: 4, c: 20 }, { r: 4, c: 21 }, { r: 4, c: 22 }, { r: 4, c: 23 }, { r: 4, c: 24 },
      { r: 6, c: 20 }, { r: 6, c: 24 },
      { r: 18, c: 0 }, { r: 18, c: 4 }, { r: 19, c: 0 }, { r: 20, c: 0 }, { r: 21, c: 0 }, { r: 22, c: 0 }, { r: 23, c: 0 }, { r: 24, c: 0 },
      { r: 18, c: 6 }, { r: 19, c: 6 }, { r: 20, c: 6 }, { r: 21, c: 6 }, { r: 22, c: 6 }, { r: 23, c: 6 }, { r: 24, c: 6 },
      { r: 18, c: 1 }, { r: 18, c: 2 }, { r: 18, c: 3 }, { r: 18, c: 4 }, { r: 18, c: 5 },
      { r: 24, c: 1 }, { r: 24, c: 2 }, { r: 24, c: 3 }, { r: 24, c: 4 }, { r: 24, c: 5 },
      { r: 18, c: 18 }, { r: 18, c: 19 }, { r: 18, c: 20 }, { r: 18, c: 21 }, { r: 18, c: 22 }, { r: 18, c: 23 }, { r: 18, c: 24 },
      { r: 19, c: 18 }, { r: 19, c: 24 }, { r: 20, c: 18 }, { r: 20, c: 24 }, { r: 21, c: 18 }, { r: 21, c: 24 },
      { r: 22, c: 18 }, { r: 22, c: 24 }, { r: 23, c: 18 }, { r: 23, c: 24 },
      { r: 24, c: 18 }, { r: 24, c: 19 }, { r: 24, c: 20 }, { r: 24, c: 21 }, { r: 24, c: 22 }, { r: 24, c: 23 }, { r: 24, c: 24 },
      { r: 20, c: 20 }, { r: 20, c: 21 }, { r: 21, c: 20 }, { r: 21, c: 21 },
    ];

    const cornerSet = new Set(corners.map(p => `${p.r},${p.c}`));

    ctx.fillStyle = "#000000";
    for (const [r, c] of positions) {
      if (!cornerSet.has(`${r},${c}`)) {
        ctx.fillRect(c * cell, r * cell, cell, cell);
      }
    }

    ctx.fillStyle = "#000000";
    for (const { r, c } of corners) {
      ctx.fillRect(c * cell, r * cell, cell, cell);
    }

    const innerSize = 3 * cell;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(2 * cell, 2 * cell, innerSize, innerSize);
    ctx.fillRect(19 * cell, 2 * cell, innerSize, innerSize);
    ctx.fillRect(2 * cell, 19 * cell, innerSize, innerSize);
    ctx.fillStyle = "#000000";
    ctx.fillRect(3 * cell, 3 * cell, cell, cell);
    ctx.fillRect(3 * cell, 4 * cell, cell, cell);
    ctx.fillRect(4 * cell, 3 * cell, cell, cell);
    ctx.fillRect(20 * cell, 3 * cell, cell, cell);
    ctx.fillRect(20 * cell, 4 * cell, cell, cell);
    ctx.fillRect(21 * cell, 3 * cell, cell, cell);
    ctx.fillRect(3 * cell, 20 * cell, cell, cell);
    ctx.fillRect(3 * cell, 21 * cell, cell, cell);
    ctx.fillRect(4 * cell, 20 * cell, cell, cell);

    const center = 12 * cell;
    ctx.fillStyle = "#000000";
    ctx.fillRect(center - 1.5 * cell, center - 1.5 * cell, 3 * cell, 3 * cell);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(center - cell, center - cell, 2 * cell, 2 * cell);
    ctx.fillStyle = "#000000";
    ctx.fillRect(center - 0.3 * cell, center - 0.3 * cell, 0.6 * cell, 0.6 * cell);

  }, []);

  return (
    <div className="relative inline-flex p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100">
      <canvas ref={canvasRef} className="w-[180px] h-[180px]" />
      <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
        <UilCheckCircle size={14} className="text-white" />
      </div>
    </div>
  );
}

function PaymentSteps() {
  return (
    <div className="flex items-center gap-2 mb-6">
      {["Cart", "Checkout", "Payment"].map((step, i) => (
        <div key={step} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold ${
            i <= 1 ? "bg-black text-white" : "bg-gray-100 text-gray-300"
          }`}>
            {i <= 1 ? <UilCheckCircle size={12} /> : "3"}
          </div>
          <span className={`text-xs ${i <= 1 ? "text-black font-medium" : "text-gray-300"}`}>{step}</span>
          {i < 2 && <UilArrowRight size={12} className="text-gray-200" />}
        </div>
      ))}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { items, getTotal } = useCartStore();

  useEffect(() => {
    if (!user) router.push("/account/login");
  }, [user, router]);

  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [upiMode, setUpiMode] = useState<"app" | "qr">("app");
  const [isPlacing, setIsPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState<any>(null);
  const [paymentStep, setPaymentStep] = useState<"form" | "processing" | "success" | "failed">("form");
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const updateField = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const loadRazorpayScript = useCallback(() => {
    return new Promise<void>((resolve) => {
      if (window.Razorpay) { resolve(); return; }
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.async = true;
      s.onload = () => resolve();
      document.body.appendChild(s);
    });
  }, []);

  const handlePayNow = async () => {
    setError("");
    if (!form.name || !form.phone || !form.address || !form.city || !form.state || !form.zip) {
      setError("Please fill in all shipping address fields.");
      return;
    }
    setIsPlacing(true);
    setPaymentStep("processing");

    try {
      await loadRazorpayScript();

      const { data: orderData } = await api.post("/orders/checkout", {
        shippingAddress: form,
        paymentMethod: "upi",
      });

      const placed = orderData.data?.order || orderData.order;
      if (!placed) throw new Error("Failed to create order");

      const { data: razorpayData } = await api.post("/payments/create-order", {
        amount: getTotal(),
        currency: "INR",
        orderId: placed._id || placed.orderNumber,
      });

      const razorpayOrderId = razorpayData.data?.orderId || razorpayData.orderId;
      const razorpayKey = razorpayData.data?.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      const options = {
        key: razorpayKey,
        amount: getTotal() * 100,
        currency: "INR",
        name: STORE_UPI_NAME,
        description: `Order #${placed.orderNumber || placed._id}`,
        order_id: razorpayOrderId,
        modal: { ondismiss: () => { setIsPlacing(false); setPaymentStep("form"); } },
        handler: async (response: any) => {
          try {
            await api.post("/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: placed._id || placed.orderNumber,
            });
            setPlacedOrder(placed);
            setPlaced(true);
            setPaymentStep("success");
          } catch {
            setError("Payment verification failed. Please contact support.");
            setPaymentStep("failed");
          }
          setIsPlacing(false);
        },
        prefill: { name: form.name, email: user?.email || "", contact: form.phone, method: "upi" },
        theme: { color: "#000000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        setError(resp.error?.description || "Payment failed");
        setPaymentStep("failed");
        setIsPlacing(false);
      });
      rzp.open();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Something went wrong.");
      setPaymentStep("failed");
      setIsPlacing(false);
    }
  };

  const copyUpi = () => {
    navigator.clipboard.writeText(STORE_UPI_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (items.length === 0 && !placed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <img src="/lo.png" alt="" className="h-8 w-auto opacity-40" />
          </div>
          <h1 className="text-xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-400 text-sm mb-6">Add some items before checking out.</p>
          <Link href="/shop"><Button>Shop Now</Button></Link>
        </div>
      </div>
    );
  }

  if (placed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mb-6">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <div className="relative">
                <UilCheckCircle size={36} className="text-emerald-600" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center"
                >
                  <span className="text-white text-[8px]">✓</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-2xl font-bold mb-1">Payment Successful!</h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full text-sm text-gray-500 mb-6 mt-3">
              <img src="/lo.png" alt="" className="h-4 w-auto opacity-50" />
              Order #{placedOrder?.orderNumber || placedOrder?._id}
            </div>
            <p className="text-gray-400 text-sm mb-8">Thank you! You&apos;ll receive a confirmation shortly.</p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/account/dashboard/orders"><Button>View Orders</Button></Link>
              <Link href="/shop"><Button variant="outline">Continue Shopping</Button></Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <Breadcrumb items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} />

      {/* Header with Logo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6 md:mb-8"
      >
        <Link href="/" className="shrink-0">
          <img src="/lo.png" alt="DRESS" className="h-10 md:h-12 w-auto" />
        </Link>
        <div className="h-8 w-px bg-gray-100" />
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">Checkout</h1>
          <p className="text-xs text-gray-400 mt-0.5">Complete your order</p>
        </div>
      </motion.div>

      <PaymentSteps />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

        {/* ===== LEFT COLUMN ===== */}
        <div className="lg:col-span-7 space-y-5">

          {/* --- Shipping Address --- */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center text-white text-[11px] font-bold">1</div>
              <h2 className="text-sm font-semibold">Shipping Address</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input id="name" label="Full Name" placeholder="John Doe" value={form.name} onChange={updateField("name")} />
              <Input id="phone" label="Phone" placeholder="+91 9876543210" value={form.phone} onChange={updateField("phone")} />
              <div className="sm:col-span-2">
                <Input id="address" label="Address" placeholder="123 Main Street" value={form.address} onChange={updateField("address")} />
              </div>
              <Input id="city" label="City" placeholder="Mumbai" value={form.city} onChange={updateField("city")} />
              <Input id="state" label="State" placeholder="Maharashtra" value={form.state} onChange={updateField("state")} />
              <Input id="zip" label="PIN Code" placeholder="400001" value={form.zip} onChange={updateField("zip")} />
            </div>
          </div>

          {/* --- Payment --- */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center text-white text-[11px] font-bold">2</div>
              <div>
                <h2 className="text-sm font-semibold">Payment</h2>
                <p className="text-[11px] text-gray-400">Pay via UPI — secure & instant</p>
              </div>
            </div>

            {/* Tab Toggle */}
            <div className="flex bg-gray-50 rounded-lg p-0.5 mb-6">
              {[
                { id: "app" as const, label: "UPI Apps", icon: UilMobileAndroid },
                { id: "qr" as const, label: "QR / UPI ID", icon: UilQrcodeScan },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setUpiMode(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-md transition-all ${
                      upiMode === tab.id ? "bg-white text-black shadow-sm" : "text-gray-400 hover:text-gray-500"
                    }`}
                  >
                    <Icon size={15} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <AnimatePresence mode="wait">
              {/* ===== UPI APPS TAB ===== */}
              {upiMode === "app" && (
                <motion.div
                  key="apps"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {UPI_APPS.map((app) => {
                      const AppIcon = app.icon;
                      return (
                        <button
                          key={app.id}
                          onClick={() => setSelectedApp(selectedApp === app.id ? null : app.id)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                            selectedApp === app.id
                              ? "border-black bg-gray-50/50 shadow-sm"
                              : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <AppIcon size={40} />
                          <span className="text-[10px] font-medium text-gray-500 text-center leading-tight">{app.name}</span>
                          {selectedApp === app.id && <div className="w-1.5 h-1.5 bg-black rounded-full" />}
                        </button>
                      );
                    })}
                  </div>
                  {selectedApp && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3.5 p-3.5 bg-gray-50 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {(() => {
                          const app = UPI_APPS.find(a => a.id === selectedApp);
                          const Icon = app?.icon;
                          return (
                            <>
                              {Icon && <Icon size={36} />}
                              <div>
                                <p className="text-sm font-medium">Pay with {app?.name}</p>
                                <p className="text-xs text-gray-400">Redirect to complete payment</p>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                      <UilExternalLinkAlt size={15} className="text-gray-300" />
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* ===== QR / UPI ID TAB ===== */}
              {upiMode === "qr" && (
                <motion.div
                  key="qr"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                    {/* QR Code */}
                    <div className="flex flex-col items-center gap-3">
                      <QrCodeGrid />
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-300">
                        <UilQrcodeScan size={11} />
                        <span>Scan to pay</span>
                      </div>
                    </div>

                    {/* UPI Details */}
                    <div className="flex-1 w-full space-y-4">
                      <div>
                        <p className="text-xs text-gray-400 mb-1.5 font-medium">Pay to UPI ID</p>
                        <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                              <img src="/lo.png" alt="" className="h-4 w-auto brightness-0 invert" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold">{STORE_UPI_ID}</p>
                              <p className="text-[11px] text-gray-400">{STORE_UPI_NAME}</p>
                            </div>
                          </div>
                          <button
                            onClick={copyUpi}
                            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-medium transition-all ${
                              copied ? "bg-emerald-50 text-emerald-600" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
                            }`}
                          >
                            {copied ? <UilCheckCircle size={13} /> : <UilCopy size={13} />}
                            {copied ? "Copied" : "Copy"}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5 p-3.5 bg-amber-50/70 rounded-xl">
                        <UilMobileAndroid size={14} className="text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-amber-800">How to pay via UPI?</p>
                          <ol className="mt-1.5 space-y-1">
                            <li className="text-[11px] text-amber-700/70 flex items-start gap-1.5">
                              <span className="font-medium w-4">1.</span>
                              Open any UPI app (GPay, PhonePe, Paytm)
                            </li>
                            <li className="text-[11px] text-amber-700/70 flex items-start gap-1.5">
                              <span className="font-medium w-4">2.</span>
                              Scan QR code or enter UPI ID
                            </li>
                            <li className="text-[11px] text-amber-700/70 flex items-start gap-1.5">
                              <span className="font-medium w-4">3.</span>
                              Enter amount & pay
                            </li>
                          </ol>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Trust Footer */}
            <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[7px] font-bold text-gray-400 border border-white">R</div>
                  <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[7px] font-bold text-gray-400 border border-white">P</div>
                </div>
                <span className="text-[10px] text-gray-400">Powered by <span className="font-medium text-gray-500">Razorpay</span></span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-gray-300">
                <span className="flex items-center gap-1"><UilShieldCheck size={10} /> Secure</span>
                <span className="flex items-center gap-1"><UilLock size={10} /> Instant</span>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-3.5 bg-red-50 rounded-xl flex items-start gap-2.5"
              >
                <UilExclamationCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}

            <Button fullWidth size="lg" className="mt-5" onClick={handlePayNow} loading={isPlacing}>
              {isPlacing ? "Processing..." : (
                <span className="flex items-center gap-2">
                  Pay {formatPrice(getTotal())}
                  <UilArrowRight size={18} />
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* ===== RIGHT COLUMN - Order Summary ===== */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 md:p-6 lg:sticky lg:top-24">
            {/* Logo in summary */}
            <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-50">
              <img src="/lo.png" alt="DRESS" className="h-7 w-auto" />
              <div className="h-5 w-px bg-gray-100" />
              <span className="text-xs text-gray-400">Order Summary</span>
            </div>

            <div className="space-y-3.5 max-h-64 overflow-auto pr-1">
              {items.map((item) => (
                <div key={`${item._id}-${item.size}`} className="flex items-center gap-3">
                  <div className="w-14 h-16 rounded-lg overflow-hidden bg-gray-50 shrink-0 border border-gray-50">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {[item.color, item.size && `Size ${item.size}`].filter(Boolean).join(" / ")}
                    </p>
                    <p className="text-[11px] text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Subtotal</span>
                <span className="font-medium">{formatPrice(getTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Shipping</span>
                <span className="text-emerald-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between pt-2.5 mt-2.5 border-t border-gray-100 text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(getTotal())}</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <UilShieldCheck size={13} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-medium">Secure Payment</p>
                  <p className="text-[10px] text-gray-400">256-bit SSL encryption</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  <UilMobileAndroid size={13} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-medium">UPI Accepted</p>
                  <p className="text-[10px] text-gray-400">GPay &bull; PhonePe &bull; Paytm &bull; BHIM</p>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-center gap-4 text-[10px] text-gray-300">
              <span className="font-medium text-gray-400">razorpay</span>
              <span className="text-gray-200">|</span>
              <span>VISA</span>
              <span>MC</span>
              <span>UPI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Cart */}
      <div className="mt-8 text-center">
        <Link href="/cart" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          <UilArrowLeft size={13} />
          Back to Cart
        </Link>
      </div>
    </div>
  );
}
