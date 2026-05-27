import prisma from "@/lib/prisma";

/**
 * Obtiene de la base de datos todas las entradas que pertenecen a un usuario específico de Clerk.
 */
export async function entradasUsuarioID(userId: string) {
  try {
    const entradas = await prisma.entrada.findMany({
      where: {
        id_usuario: userId,
      },
      orderBy: {
        creado: "desc", // Ordena para que las últimas compras aparezcan primero
      },
    });
    
    return entradas;
  } catch (error) {
    console.error("Error en getEntradasByUsuario:", error);
    throw new Error("No se pudieron recuperar las entradas de la base de datos.");
  }
}

export async function entradaPorID(idEntrada: string) {
  try {
    const entradaOriginal = await prisma.entrada.findUnique({
      where: {
        id_entrada: BigInt(idEntrada), 
      },
    });

    if (!entradaOriginal) return null;

    const entradaConvertida = {
      ...entradaOriginal,
      id_entrada: entradaOriginal.id_entrada.toString(), 
    };

    return entradaConvertida;
  } catch (error) {
    console.error("Error en obtenerEntradaPorID:", error);
    return null; 
  }
}