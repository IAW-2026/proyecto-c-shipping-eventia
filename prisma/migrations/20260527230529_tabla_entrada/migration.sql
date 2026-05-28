-- CreateTable
CREATE TABLE "Entrada" (
    "id_entrada" BIGINT NOT NULL,
    "id_pedido" INTEGER NOT NULL,
    "id_evento" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,
    "creado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" TEXT NOT NULL,

    CONSTRAINT "Entrada_pkey" PRIMARY KEY ("id_entrada")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entrada_id_pedido_key" ON "Entrada"("id_pedido");
