import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-gray-200">404</h1>
        <h2 className="text-2xl font-bold mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-2 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
