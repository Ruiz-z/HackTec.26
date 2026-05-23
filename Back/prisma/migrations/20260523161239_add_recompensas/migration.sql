-- CreateTable
CREATE TABLE "Recompensa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "costo" INTEGER NOT NULL,
    "imagen" TEXT NOT NULL,
    "icono" TEXT NOT NULL DEFAULT '🎁',
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Canje" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "recompensaId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Canje_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Canje_recompensaId_fkey" FOREIGN KEY ("recompensaId") REFERENCES "Recompensa" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
