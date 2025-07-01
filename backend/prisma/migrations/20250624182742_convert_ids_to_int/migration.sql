/*
  Warnings:

  - The primary key for the `tb_customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `Cust_ID` on the `tb_customer` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.
  - You are about to alter the column `Cust_ID` on the `tb_exchange` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.
  - You are about to alter the column `Old_Pd_ID` on the `tb_exchange` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.
  - You are about to alter the column `New_Pd_ID` on the `tb_exchange` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.
  - You are about to alter the column `Sup_ID` on the `tb_order` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.
  - You are about to alter the column `Pd_ID` on the `tb_order_product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.
  - The primary key for the `tb_product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `Pd_ID` on the `tb_product` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.
  - You are about to alter the column `Cust_ID` on the `tb_repurchase` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.
  - You are about to alter the column `Pd_ID` on the `tb_sell` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.
  - You are about to alter the column `Cust_ID` on the `tb_sell` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.
  - The primary key for the `tb_supplier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `Sup_ID` on the `tb_supplier` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `tb_exchange` DROP FOREIGN KEY `tb_exchange_Cust_ID_fkey`;

-- DropForeignKey
ALTER TABLE `tb_exchange` DROP FOREIGN KEY `tb_exchange_New_Pd_ID_fkey`;

-- DropForeignKey
ALTER TABLE `tb_exchange` DROP FOREIGN KEY `tb_exchange_Old_Pd_ID_fkey`;

-- DropForeignKey
ALTER TABLE `tb_order` DROP FOREIGN KEY `tb_order_Sup_ID_fkey`;

-- DropForeignKey
ALTER TABLE `tb_order_product` DROP FOREIGN KEY `tb_order_product_Pd_ID_fkey`;

-- DropForeignKey
ALTER TABLE `tb_repurchase` DROP FOREIGN KEY `tb_repurchase_Cust_ID_fkey`;

-- DropForeignKey
ALTER TABLE `tb_sell` DROP FOREIGN KEY `tb_sell_Cust_ID_fkey`;

-- DropForeignKey
ALTER TABLE `tb_sell` DROP FOREIGN KEY `tb_sell_Pd_ID_fkey`;

-- DropIndex
DROP INDEX `tb_exchange_Cust_ID_fkey` ON `tb_exchange`;

-- DropIndex
DROP INDEX `tb_exchange_New_Pd_ID_fkey` ON `tb_exchange`;

-- DropIndex
DROP INDEX `tb_order_Sup_ID_fkey` ON `tb_order`;

-- DropIndex
DROP INDEX `tb_order_product_Pd_ID_fkey` ON `tb_order_product`;

-- DropIndex
DROP INDEX `tb_repurchase_Cust_ID_fkey` ON `tb_repurchase`;

-- DropIndex
DROP INDEX `tb_sell_Cust_ID_fkey` ON `tb_sell`;

-- AlterTable
ALTER TABLE `tb_customer` DROP PRIMARY KEY,
    MODIFY `Cust_ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`Cust_ID`);

-- AlterTable
ALTER TABLE `tb_exchange` MODIFY `Cust_ID` INTEGER NULL,
    MODIFY `Old_Pd_ID` INTEGER NULL,
    MODIFY `New_Pd_ID` INTEGER NULL;

-- AlterTable
ALTER TABLE `tb_order` MODIFY `Sup_ID` INTEGER NULL;

-- AlterTable
ALTER TABLE `tb_order_product` MODIFY `Pd_ID` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tb_product` DROP PRIMARY KEY,
    MODIFY `Pd_ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`Pd_ID`);

-- AlterTable
ALTER TABLE `tb_repurchase` MODIFY `Cust_ID` INTEGER NULL;

-- AlterTable
ALTER TABLE `tb_sell` MODIFY `Pd_ID` INTEGER NOT NULL,
    MODIFY `Cust_ID` INTEGER NULL;

-- AlterTable
ALTER TABLE `tb_supplier` DROP PRIMARY KEY,
    MODIFY `Sup_ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`Sup_ID`);

-- AddForeignKey
ALTER TABLE `tb_order` ADD CONSTRAINT `tb_order_Sup_ID_fkey` FOREIGN KEY (`Sup_ID`) REFERENCES `tb_supplier`(`Sup_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_order_product` ADD CONSTRAINT `tb_order_product_Pd_ID_fkey` FOREIGN KEY (`Pd_ID`) REFERENCES `tb_product`(`Pd_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_sell` ADD CONSTRAINT `tb_sell_Pd_ID_fkey` FOREIGN KEY (`Pd_ID`) REFERENCES `tb_product`(`Pd_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_sell` ADD CONSTRAINT `tb_sell_Cust_ID_fkey` FOREIGN KEY (`Cust_ID`) REFERENCES `tb_customer`(`Cust_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_repurchase` ADD CONSTRAINT `tb_repurchase_Cust_ID_fkey` FOREIGN KEY (`Cust_ID`) REFERENCES `tb_customer`(`Cust_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_exchange` ADD CONSTRAINT `tb_exchange_Cust_ID_fkey` FOREIGN KEY (`Cust_ID`) REFERENCES `tb_customer`(`Cust_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_exchange` ADD CONSTRAINT `tb_exchange_Old_Pd_ID_fkey` FOREIGN KEY (`Old_Pd_ID`) REFERENCES `tb_product`(`Pd_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tb_exchange` ADD CONSTRAINT `tb_exchange_New_Pd_ID_fkey` FOREIGN KEY (`New_Pd_ID`) REFERENCES `tb_product`(`Pd_ID`) ON DELETE SET NULL ON UPDATE CASCADE;
