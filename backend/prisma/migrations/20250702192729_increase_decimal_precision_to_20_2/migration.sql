/*
  Warnings:

  - You are about to alter the column `Old_Product_Value` on the `tb_exchange` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.
  - You are about to alter the column `New_Product_Value` on the `tb_exchange` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.
  - You are about to alter the column `Exchange_Fee` on the `tb_exchange` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.
  - You are about to alter the column `Different_price` on the `tb_exchange` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.
  - You are about to alter the column `Lost_Weight_Fee` on the `tb_exchange` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.
  - You are about to alter the column `Total_Price` on the `tb_invoice` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Decimal(20,2)`.
  - You are about to alter the column `Buy_price` on the `tb_order_product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(15,2)` to `Decimal(20,2)`.
  - You are about to alter the column `Discount` on the `tb_order_product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.
  - You are about to alter the column `Buy_price` on the `tb_price` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.
  - You are about to alter the column `Sell_price` on the `tb_price` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.
  - You are about to alter the column `Pattern_value` on the `tb_product` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.
  - You are about to alter the column `Repurchase_Price` on the `tb_repurchase` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.
  - You are about to alter the column `Damage_Cost` on the `tb_repurchase` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.
  - You are about to alter the column `Loose_Gold_Cost` on the `tb_repurchase` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.
  - You are about to alter the column `Net_Repurchase_Price` on the `tb_repurchase` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.
  - You are about to alter the column `Discount` on the `tb_sell` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,2)` to `Decimal(20,2)`.

*/
-- AlterTable
ALTER TABLE `tb_exchange` MODIFY `Old_Product_Value` DECIMAL(20, 2) NULL,
    MODIFY `New_Product_Value` DECIMAL(20, 2) NULL,
    MODIFY `Exchange_Fee` DECIMAL(20, 2) NULL DEFAULT 0,
    MODIFY `Different_price` DECIMAL(20, 2) NULL,
    MODIFY `Lost_Weight_Fee` DECIMAL(20, 2) NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `tb_invoice` MODIFY `Total_Price` DECIMAL(20, 2) NULL;

-- AlterTable
ALTER TABLE `tb_order_product` MODIFY `Buy_price` DECIMAL(20, 2) NOT NULL,
    MODIFY `Discount` DECIMAL(20, 2) NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `tb_price` MODIFY `Buy_price` DECIMAL(20, 2) NULL,
    MODIFY `Sell_price` DECIMAL(20, 2) NULL;

-- AlterTable
ALTER TABLE `tb_product` MODIFY `Pattern_value` DECIMAL(20, 2) NULL;

-- AlterTable
ALTER TABLE `tb_repurchase` MODIFY `Repurchase_Price` DECIMAL(20, 2) NOT NULL,
    MODIFY `Damage_Cost` DECIMAL(20, 2) NULL DEFAULT 0.00,
    MODIFY `Loose_Gold_Cost` DECIMAL(20, 2) NULL DEFAULT 0.00,
    MODIFY `Net_Repurchase_Price` DECIMAL(20, 2) NULL DEFAULT 0.00;

-- AlterTable
ALTER TABLE `tb_sell` MODIFY `Discount` DECIMAL(20, 2) NULL DEFAULT 0.00;
