/*
  Warnings:

  - The primary key for the `VentureCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `VentureCategory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `XUserPreferences` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `XVentureVencureCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `categoryId` on the `XUserPreferences` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `categoryId` on the `XVentureVencureCategory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_XUserPreferences` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_XVentureVencureCategory` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "XUserPreferences" DROP CONSTRAINT "XUserPreferences_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "XVentureVencureCategory" DROP CONSTRAINT "XVentureVencureCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "_XUserPreferences" DROP CONSTRAINT "_XUserPreferences_B_fkey";

-- DropForeignKey
ALTER TABLE "_XVentureVencureCategory" DROP CONSTRAINT "_XVentureVencureCategory_B_fkey";

-- AlterTable
ALTER TABLE "VentureCategory" DROP CONSTRAINT "VentureCategory_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "VentureCategory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "XUserPreferences" DROP CONSTRAINT "XUserPreferences_pkey",
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD CONSTRAINT "XUserPreferences_pkey" PRIMARY KEY ("userId", "categoryId");

-- AlterTable
ALTER TABLE "XVentureVencureCategory" DROP CONSTRAINT "XVentureVencureCategory_pkey",
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD CONSTRAINT "XVentureVencureCategory_pkey" PRIMARY KEY ("ventureId", "categoryId");

-- AlterTable
ALTER TABLE "_XUserPreferences" DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_XVentureVencureCategory" DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "_XUserPreferences_AB_unique" ON "_XUserPreferences"("A", "B");

-- CreateIndex
CREATE INDEX "_XUserPreferences_B_index" ON "_XUserPreferences"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_XVentureVencureCategory_AB_unique" ON "_XVentureVencureCategory"("A", "B");

-- CreateIndex
CREATE INDEX "_XVentureVencureCategory_B_index" ON "_XVentureVencureCategory"("B");

-- AddForeignKey
ALTER TABLE "XUserPreferences" ADD CONSTRAINT "XUserPreferences_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "VentureCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XVentureVencureCategory" ADD CONSTRAINT "XVentureVencureCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "VentureCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_XUserPreferences" ADD CONSTRAINT "_XUserPreferences_B_fkey" FOREIGN KEY ("B") REFERENCES "VentureCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_XVentureVencureCategory" ADD CONSTRAINT "_XVentureVencureCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "VentureCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
