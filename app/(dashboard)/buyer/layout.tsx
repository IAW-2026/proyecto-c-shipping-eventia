import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function BuyerLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const roles = (user?.publicMetadata?.roles as string[]) || [];

  if (!roles.includes("buyer")) {
    if (roles.includes("seller")) redirect("/seller/scan");
    redirect("/");
  }

  return <>{children}</>; 
}