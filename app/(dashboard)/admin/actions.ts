"use server";

interface SimularPedidoParams {
  cantidad: number;
  id_evento: number;
  id_usuario: string;
}

interface SimularPagoParams{
    id_pedido: number;
    estado: string;
}

const shippingUrl = process.env.URL_SHIPPING ?? 'http://localhost:3000';

export async function simularPedidoAction({ cantidad, id_evento, id_usuario }: SimularPedidoParams) {
  try {
    const shippingKey = process.env.SHIPPING_API_KEY;
    
    const id_pedido = Math.floor(Date.now() / 1000); 

    const response = await fetch(`${shippingUrl}/api/pedido`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json", 
        "x-api-key": shippingKey ?? '' 
      },
      body: JSON.stringify({
        id_pedido: id_pedido,
        cantidad: cantidad,
        id_evento: id_evento,
        id_usuario: id_usuario,
      }),
    });

    if (response.ok) {
      return { 
        success: true, 
        id_pedido: id_pedido 
      };
    } else {
      const data = await response.json();
      return { 
        success: false, 
        error: data.error || "Error desconocido" 
      };
    }

  } catch (error: any) {
    console.error("Fallo crítico en el fetch del Servidor:", error);
    return { 
      success: false, 
      error: "Error de red al conectar con la API de pedidos." 
    };
  }
}

export async function simularPagoAction({ id_pedido, estado }: SimularPagoParams) {
    try {
        const shippingKey = process.env.SHIPPING_API_KEY;
      const response = await fetch(`${shippingUrl}/api/entrada`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": shippingKey ?? '' },
        body: JSON.stringify({
          id_pedido: Number(id_pedido),
          estado: estado, // Payload de confirmación
        }),
      });
      
      if (response.ok) {
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, error: data.error || "Error desconocido" };
      }
    } catch (error) {
      return { success: false, error: "Error de red al conectar con la API de pagos." };
    }
  };
