-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recompensa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "costo" INTEGER NOT NULL,
    "imagen" TEXT NOT NULL,
    "icono" TEXT NOT NULL DEFAULT '🎁',
    "nivelMinimo" INTEGER NOT NULL DEFAULT 1,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Recompensa" ("categoria", "costo", "createdAt", "descripcion", "disponible", "icono", "id", "imagen", "titulo") SELECT "categoria", "costo", "createdAt", "descripcion", "disponible", "icono", "id", "imagen", "titulo" FROM "Recompensa";
DROP TABLE "Recompensa";
ALTER TABLE "new_Recompensa" RENAME TO "Recompensa";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
