import Navbar from "../components/NavBar";
import RolSwitcher from "../components/RolSwitcher";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ClerkProvider } from "@clerk/nextjs";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  return (
      <div className="min-h-screen bg-slate-50">
        <Navbar>
          <RolSwitcher />
        </Navbar>
        <main className="pt-20 container mx-auto max-w-5xl p-4">
          {children}
        </main>
      </div>
  );
}