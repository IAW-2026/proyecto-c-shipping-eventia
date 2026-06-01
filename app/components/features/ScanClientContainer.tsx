'use client';

import dynamic from "next/dynamic";

const UsuarioSeller = dynamic(
  () => import("./usuarioSeller"), 
  { ssr: false }
);

interface ScanClientContainerProps {
  usuarioId: string;
}

export default function ScanClientContainer({ usuarioId }: ScanClientContainerProps) {
  return <UsuarioSeller usuarioClerk={{ id: usuarioId }} />;
}