import React from 'react';
import { redirect } from "next/navigation";
import { EntradaDetalle } from '../../../components/EntradaDetalle';
import { entradaPorID } from "@/services/entradas"; 

interface PageProps {
  params: Promise<{ id_entrada: string }>;
}

export default async function TicketDetailPage({ params }: PageProps) {
  const { id_entrada } = await params;

  const entrada = await entradaPorID(id_entrada);

  if (!entrada) {
    redirect("/buyer");
  }

  return <EntradaDetalle entrada={entrada} />;
}