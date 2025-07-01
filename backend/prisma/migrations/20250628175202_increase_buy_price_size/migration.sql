/*
  Warnings:

  - You are about to alter the column `Buy_price` on the `tb_order_product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(15,2)`.

*/
-- AlterTable
ALTER TABLE `tb_order_product` MODIFY `Buy_price` DECIMAL(15, 2) NOT NULL;
