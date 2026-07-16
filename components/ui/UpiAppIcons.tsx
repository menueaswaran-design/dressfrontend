export function GooglePayIcon({ size = 44 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center bg-white border border-gray-200 rounded-xl" style={{ width: size, height: size }}>
      <img
        src="/images/payments/google-pay.png"
        alt="Google Pay"
        style={{ width: size * 0.85, height: size * 0.85 }}
        className="object-contain"
      />
    </div>
  );
}

export function PhonePeIcon({ size = 44 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center bg-[#5F259F] rounded-xl" style={{ width: size, height: size }}>
      <img
        src="/images/payments/phonepe.png"
        alt="PhonePe"
        style={{ width: size * 0.85, height: size * 0.85 }}
        className="object-contain"
      />
    </div>
  );
}

export function PaytmIcon({ size = 44 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center bg-[#00BAF2] rounded-xl" style={{ width: size, height: size }}>
      <img
        src="/images/payments/paytm.png"
        alt="Paytm"
        style={{ width: size * 0.85, height: size * 0.85 }}
        className="object-contain"
      />
    </div>
  );
}

export function BHIMIcon({ size = 44 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center bg-[#0B8B47] rounded-xl" style={{ width: size, height: size }}>
      <img
        src="/images/payments/bhim.png"
        alt="BHIM"
        style={{ width: size * 0.85, height: size * 0.85 }}
        className="object-contain"
      />
    </div>
  );
}

export const UPI_APP_ICONS: Record<string, typeof GooglePayIcon> = {
  gpay: GooglePayIcon,
  phonepe: PhonePeIcon,
  paytm: PaytmIcon,
  bhim: BHIMIcon,
};