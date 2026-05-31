import { redirect } from "next/navigation";
import { EntradaDetalle } from "../../../components/EntradaDetalle";
import { entradasPorPedidoID } from "@/services/entradas"; 

interface PageProps {
  params: Promise<{ id_pedido: string }>; 
}

export default async function TicketDetailPage({ params }: PageProps) {
  const { id_pedido } = await params;

  const entradas = await entradasPorPedidoID(id_pedido);

  if (!entradas || entradas.length === 0) {
    redirect("/buyer");
  }

  return (
    <EntradaDetalle 
      id_pedido={id_pedido} 
      entradas={entradas} 
    />
  );
}