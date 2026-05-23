"use client";

import { usePathname, useRouter } from "next/navigation";

export default function RolSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const isSellerMode = pathname.startsWith("/seller");

  const toggleMode = () => {
    if (isSellerMode) {
      router.push("/buyer/tickets");
    } else {
      router.push("/seller/scan");
    }
  };

  return (
    <div className="flex items-center gap-3 bg-slate-100 p-1.5 rounded-lg border border-slate-200">
      <button
        onClick={toggleMode}
        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
          !isSellerMode 
            ? "bg-white text-blue-600 shadow-sm" 
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        Modo Comprador
      </button>
      <button
        onClick={toggleMode}
        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
          isSellerMode 
            ? "bg-white text-green-600 shadow-sm" 
            : "text-slate-600 hover:text-slate-900"
        }`}
      >
        Modo Vendedor
      </button>
    </div>
  );
}