import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const roles = (user?.publicMetadata?.roles as string[]) || [];

  if (!roles.includes("seller")) {
    if (roles.includes("buyer")) redirect("/buyer/tickets");
    redirect("/");
  }

  return <>{children}</>;
}