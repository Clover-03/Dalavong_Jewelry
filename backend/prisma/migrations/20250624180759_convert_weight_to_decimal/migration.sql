/*
  Warnings:

  - You are about to alter the column `Weight` on the `tb_product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE `tb_product` MODIFY `Weight` DECIMAL(10, 2) NULL;
