import { currentUser } from "@clerk/nextjs/server";
import SimuladorClient from "../../../components/features/SimuladorClient"; 

async function checkIsAdmin() {
  const user = await currentUser();
  if (!user) return false;
  
  const rolesAdmin = (user?.publicMetadata?.rolesAdmin as string[]) || [];
  return rolesAdmin.includes('adminShipping');
}

export default async function SimulacionCompraPage() {
  const esAdmin = await checkIsAdmin();

  return <SimuladorClient esAdmin={esAdmin} />;
}