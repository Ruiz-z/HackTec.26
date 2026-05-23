-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "meta" INTEGER NOT NULL,
    "xpRecompensa" INTEGER NOT NULL DEFAULT 100,
    "ptsRecompensa" INTEGER NOT NULL DEFAULT 0,
    "icono" TEXT NOT NULL DEFAULT '🌿',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Reto" ("activo", "createdAt", "descripcion", "icono", "id", "meta", "tipo", "titulo", "xpRecompensa") SELECT "activo", "createdAt", "descripcion", "icono", "id", "meta", "tipo", "titulo", "xpRecompensa" FROM "Reto";
DROP TABLE "Reto";
ALTER TABLE "new_Reto" RENAME TO "Reto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
