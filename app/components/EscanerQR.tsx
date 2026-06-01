'use client';
import { useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QrScannerProps {
  onScanSuccess: (decodedText: string) => void;
}

export default function QrScanner({ onScanSuccess }: QrScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    // 1. Inicializar el objeto del escáner apuntando al ID del div
    scannerRef.current = new Html5Qrcode("scanner-container");

    const config = { 
      fps: 10, 
      qrbox: { width: 280, height: 280 } 
    };

    // 2. Encender la cámara trasera (environment)
    scannerRef.current.start(
      { facingMode: "environment" },
      config,
      (decodedText) => {
        // Pausamos el escaneo para procesar este ticket
        scannerRef.current?.pause(true);
        onScanSuccess(decodedText);
      },
      (errorMessage) => {
        // Log opcional de errores de lectura continua (suele ser ruidoso)
      }
    ).catch((err) => console.error("Error al iniciar cámara:", err));

    // 3. Limpieza al desmontar el componente
    return () => {
      const scanner = scannerRef.current;
      if (scanner) {
        const stopPromise = scanner.isScanning ? scanner.stop() : Promise.resolve();
        stopPromise
          .then(() => scanner.clear())
          .catch((err) => console.error("Error al detener:", err));
      }
    };
  }, [onScanSuccess]);

  // Función pública para reanudar el escáner desde el padre
  // (La llamaremos cuando cerremos el modal de estado del ticket)
  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden rounded-2xl bg-black aspect-square">
      <div id="scanner-container" className="w-full h-full" />
      <div className="absolute inset-0 border-2 border-dashed border-primary/50 pointer-events-none rounded-2xl m-8 animate-pulse" />
    </div>
  );
}