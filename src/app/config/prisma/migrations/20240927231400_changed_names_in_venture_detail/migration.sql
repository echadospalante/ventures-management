/*
  Warnings:

  - You are about to drop the column `ventureDetailId` on the `VenturePublication` table. All the data in the column will be lost.
  - Added the required column `detailId` to the `VenturePublication` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "VenturePublication" DROP CONSTRAINT "VenturePublication_ventureDetailId_fkey";

-- AlterTable
ALTER TABLE "VenturePublication" DROP COLUMN "ventureDetailId",
ADD COLUMN     "detailId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "VenturePublication" ADD CONSTRAINT "VenturePublication_detailId_fkey" FOREIGN KEY ("detailId") REFERENCES "VentureDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
