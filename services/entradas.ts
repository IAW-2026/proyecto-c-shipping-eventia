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