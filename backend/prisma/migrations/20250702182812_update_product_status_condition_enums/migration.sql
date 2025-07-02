/*
  Warnings:

  - The values [DAMAGED] on the enum `tb_product_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `tb_product` MODIFY `status` ENUM('AVAILABLE', 'SOLD', 'REPURCHASED', 'EXCHANGED') NOT NULL DEFAULT 'AVAILABLE',
    MODIFY `condition` ENUM('GOOD', 'NEEDS_REPAIR', 'REPAIRED', 'DAMAGED') NOT NULL DEFAULT 'GOOD';
