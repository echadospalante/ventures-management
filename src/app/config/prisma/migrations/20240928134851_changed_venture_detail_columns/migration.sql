/*
  Warnings:

  - The values [VIDEO] on the enum `ContentType` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `VentureCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `XUserPreferences` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `XVentureVencureCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ContentType_new" AS ENUM ('TEXT', 'IMAGE', 'VIDEOf', 'ANNOUNCEMENT', 'ACHIEVEMENT');
ALTER TABLE "PublicationContent" ALTER COLUMN "type" TYPE "ContentType_new" USING ("type"::text::"ContentType_new");
ALTER TYPE "ContentType" RENAME TO "ContentType_old";
ALTER TYPE "ContentType_new" RENAME TO "ContentType";
DROP TYPE "ContentType_old";
COMMIT;

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
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "VentureCategory_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "VentureCategory_id_seq";

-- AlterTable
ALTER TABLE "XUserPreferences" DROP CONSTRAINT "XUserPreferences_pkey",
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "XUserPreferences_pkey" PRIMARY KEY ("userId", "categoryId");

-- AlterTable
ALTER TABLE "XVentureVencureCategory" DROP CONSTRAINT "XVentureVencureCategory_pkey",
ALTER COLUMN "categoryId" SET DATA TYPE TEXT,
ADD CONSTRAINT "XVentureVencureCategory_pkey" PRIMARY KEY ("ventureId", "categoryId");

-- AlterTable
ALTER TABLE "_XUserPreferences" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_XVentureVencureCategory" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "XUserPreferences" ADD CONSTRAINT "XUserPreferences_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "VentureCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "XVentureVencureCategory" ADD CONSTRAINT "XVentureVencureCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "VentureCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_XUserPreferences" ADD CONSTRAINT "_XUserPreferences_B_fkey" FOREIGN KEY ("B") REFERENCES "VentureCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_XVentureVencureCategory" ADD CONSTRAINT "_XVentureVencureCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "VentureCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
