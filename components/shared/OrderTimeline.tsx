"use client";

import { Check } from "lucide-react";

const steps = [
  { key: "pending", label: "Order Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

interface OrderTimelineProps {
  currentStatus: string;
}

export default function OrderTimeline({ currentStatus }: OrderTimelineProps) {
  const statusOrder = steps.map((s) => s.key);
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const isCompleted = i <= currentIndex;
          const isCurrent = i === currentIndex;
          return (
            <div key={step.key} className="flex flex-col items-center relative flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium z-10 transition-all ${
                  isCompleted
                    ? "bg-black text-white"
                    : "bg-gray-200 text-gray-400"
                }`}
              >
                {isCompleted ? <Check size={16} /> : i + 1}
              </div>
              <p
                className={`text-xs mt-2 text-center font-medium ${
                  isCompleted ? "text-black" : "text-gray-400"
                }`}
              >
                {step.label}
              </p>
              {i < steps.length - 1 && (
                <div
                  className={`absolute top-4 left-[60%] w-full h-0.5 -translate-y-1/2 ${
                    isCompleted ? "bg-black" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
