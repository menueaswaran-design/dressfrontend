"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-200">500</h1>
        <h2 className="text-2xl font-bold mt-4">Something went wrong</h2>
        <p className="text-gray-500 mt-2 mb-6">An unexpected error occurred. Please try again.</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-black text-white rounded-full text-sm font-medium tracking-widest uppercase hover:bg-black/80 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
