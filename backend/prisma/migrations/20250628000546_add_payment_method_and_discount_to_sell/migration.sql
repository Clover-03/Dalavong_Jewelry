-- AlterTable
ALTER TABLE `tb_sell` ADD COLUMN `Discount` DECIMAL(10, 2) NULL DEFAULT 0.00;
ALTER TABLE `tb_sell` ADD COLUMN `Payment_Method` VARCHAR(50) NULL; 