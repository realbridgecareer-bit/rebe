import Link from "next/link";
import { BrandWordmark } from "@/components/icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-slate-700">
      <Link href="/" className="mb-8 flex items-center text-ink">
        <BrandWordmark className="text-xl font-bold" />
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-line bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
