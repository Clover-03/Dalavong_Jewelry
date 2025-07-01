-- AlterTable
ALTER TABLE `tb_exchange` ADD COLUMN `Lost_Weight_Fee` DECIMAL(10, 2) NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `tb_product` ADD COLUMN `condition` ENUM('GOOD', 'DAMAGED', 'NEEDS_REPAIR') NOT NULL DEFAULT 'GOOD';
