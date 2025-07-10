SET NAMES utf8mb4;
SET time_zone = '+07:00';
SET foreign_key_checks = 0;

-- Drop tables in reverse order of dependency
DROP TABLE IF EXISTS `Tb_Exchange`;
DROP TABLE IF EXISTS `Tb_Order_Product`;
DROP TABLE IF EXISTS `Tb_Sell`;
DROP TABLE IF EXISTS `Tb_Product`;
DROP TABLE IF EXISTS `Tb_Repurchase`;
DROP TABLE IF EXISTS `Tb_Invoice`;
DROP TABLE IF EXISTS `Tb_Order`;
DROP TABLE IF EXISTS `Tb_Supplier`;
DROP TABLE IF EXISTS `Tb_User`;
DROP TABLE IF EXISTS `Tb_Customer`;
DROP TABLE IF EXISTS `Tb_Price`;

-- ================================================================================= --
-- TABLE: Tb_Price - ຕາຕະລາງເກັບຂໍ້ມູນລາຄາຄຳປະຈຳວັນ (ໜ້າຈັດການລາຄາຄຳ)
-- ================================================================================= --
CREATE TABLE `Tb_Price` (
  `Price_ID` INT NOT NULL AUTO_INCREMENT, -- ລະຫັດລາຄາ (ໄອດີ)
  `Date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ວັນທີ & ເວລາທີ່ບັນທຶກ
  `Buy_price` DECIMAL(20, 2) NOT NULL, -- ລາຄາຮັບຊື້ (ຕໍ່ບາດ)
  `Sell_price` DECIMAL(20, 2) NOT NULL, -- ລາຄາຂາຍ (ຕໍ່ບາດ)
  PRIMARY KEY (`Price_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================= --
-- TABLE: Tb_Customer - ຕາຕະລາງເກັບຂໍ້ມູນລູກຄ້າ (ໜ້າຈັດການຂໍ້ມູນລູກຄ້າ)
-- ================================================================================= --
CREATE TABLE `Tb_Customer` (
  `Cust_ID` INT NOT NULL AUTO_INCREMENT, -- ລະຫັດລູກຄ້າ (ໄອດີ)
  `Cust_name` VARCHAR(100) NOT NULL, -- ຊື່ລູກຄ້າ
  `Phone` VARCHAR(20) NULL, -- ເບີໂທລະສັບ
  `Address` TEXT NULL, -- ທີ່ຢູ່
  PRIMARY KEY (`Cust_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================= --
-- TABLE: Tb_User - ຕາຕະລາງເກັບຂໍ້ມູນຜູ້ໃຊ້ງານລະບົບ (ໜ້າເຂົ້າສູ່ລະບົບ)
-- ================================================================================= --
CREATE TABLE `Tb_User` (
  `User_ID` VARCHAR(255) NOT NULL, -- ລະຫັດຜູ້ໃຊ້ (ໄອດີຈາກ Firebase/Auth)
  `username` VARCHAR(50) NOT NULL, -- ຊື່ຜູ້ໃຊ້ສຳລັບເຂົ້າສູ່ລະບົບ
  `Password` VARCHAR(255) NOT NULL, -- ລະຫັດຜ່ານ (Hashed)
  `Role` ENUM('admin', 'user') NOT NULL DEFAULT 'user', -- ສິດທິການເຂົ້າເຖິງ
  PRIMARY KEY (`User_ID`),
  UNIQUE KEY `UK_User_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================= --
-- TABLE: Tb_Supplier - ຕາຕະລາງເກັບຂໍ້ມູນຜູ້ສະໜອງສິນຄ້າ (ໜ້າຈັດການຂໍ້ມູນຜູ້ສະໜອງ)
-- ================================================================================= --
CREATE TABLE `Tb_Supplier` (
  `Sup_ID` INT NOT NULL AUTO_INCREMENT, -- ລະຫັດຜູ້ສະໜອງ (ໄອດີ)
  `Sup_name` VARCHAR(100) NOT NULL, -- ຊື່ຜູ້ສະໜອງ
  `Phone` VARCHAR(20) NULL, -- ເບີໂທລະສັບ
  `Address` TEXT NULL, -- ທີ່ຢູ່
  PRIMARY KEY (`Sup_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================= --
-- TABLE: Tb_Order - ຕາຕະລາງເກັບຂໍ້ມູນການສັ່ງຊື້ສິນຄ້າ (ໜ້າການສັ່ງຊື້)
-- ================================================================================= --
CREATE TABLE `Tb_Order` (
  `Order_ID` INT NOT NULL AUTO_INCREMENT, -- ລະຫັດການສັ່ງຊື້ (ໄອດີ)
  `Sup_ID` INT NULL, -- ລະຫັດຜູ້ສະໜອງ (ອ້າງອີງ)
  `Order_Date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ວັນທີສັ່ງຊື້
  `Status` ENUM('Pending', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending', -- ສະຖານະ
  PRIMARY KEY (`Order_ID`),
  CONSTRAINT `FK_Order_Supplier` FOREIGN KEY (`Sup_ID`) REFERENCES `Tb_Supplier` (`Sup_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================= --
-- TABLE: Tb_Invoice - ຕາຕະລາງເກັບຂໍ້ມູນໃບບິນ (ເຊື່ອມໂຍງກັບການສັ່ງຊື້)
-- ================================================================================= --
CREATE TABLE `Tb_Invoice` (
  `Inv_ID` INT NOT NULL AUTO_INCREMENT, -- ລະຫັດໃບບິນ (ໄອດີ)
  `Order_ID` INT NOT NULL, -- ລະຫັດການສັ່ງຊື້ (ອ້າງອີງ)
  `Inv_Date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ວັນທີອອກໃບບິນ
  `Total_Price` DECIMAL(20, 2) NOT NULL, -- ລາຄາລວມທັງໝົດ
  `Status` ENUM('Pending', 'Completed', 'Cancelled') NOT NULL DEFAULT 'Pending', -- ສະຖານະ
  PRIMARY KEY (`Inv_ID`),
  UNIQUE KEY `UK_Invoice_Order` (`Order_ID`),
  CONSTRAINT `FK_Invoice_Order` FOREIGN KEY (`Order_ID`) REFERENCES `Tb_Order` (`Order_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================= --
-- TABLE: Tb_Repurchase - ຕາຕະລາງເກັບຂໍ້ມູນການຮັບຊື້ຄືນ (ໜ້າການຮັບຊື້ຄືນ)
-- ================================================================================= --
CREATE TABLE `Tb_Repurchase` (
  `Re_ID` INT NOT NULL AUTO_INCREMENT, -- ລະຫັດການຮັບຊື້ຄືນ (ໄອດີ)
  `Cust_ID` INT NULL, -- ລະຫັດລູກຄ້າ (ອ້າງອີງ)
  `User_ID` VARCHAR(255) NULL, -- ລະຫັດຜູ້ໃຊ້ທີ່ຮັບຊື້ (ອ້າງອີງ)
  `Re_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ວັນທີຮັບຊື້ຄືນ
  `Repurchase_Price` DECIMAL(20, 2) NOT NULL, -- ລາຄາຊື້ຄືນ
  `Re_Reason` TEXT NULL, -- ເຫດຜົນໃນການຊື້ຄືນ
  `Damage_Cost` DECIMAL(20, 2) NULL DEFAULT 0.00, -- ຄ່າເສຍຫາຍ
  `Loose_Gold_Cost` DECIMAL(20, 2) NULL DEFAULT 0.00, -- ຄ່າຕຳໜິ/ຄຳຫຼົ່ນ
  `Net_Repurchase_Price` DECIMAL(20, 2) NOT NULL, -- ລາຄາຊື້ຄືນສຸດທິ
  PRIMARY KEY (`Re_ID`),
  CONSTRAINT `FK_Repurchase_Customer` FOREIGN KEY (`Cust_ID`) REFERENCES `Tb_Customer` (`Cust_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_Repurchase_User` FOREIGN KEY (`User_ID`) REFERENCES `Tb_User` (`User_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================= --
-- TABLE: Tb_Product - ຕາຕະລາງເກັບຂໍ້ມູນສິນຄ້າທັງໝົດ (ໜ້າຈັດການສິນຄ້າ)
-- ================================================================================= --
CREATE TABLE `Tb_Product` (
  `Pd_ID` INT NOT NULL AUTO_INCREMENT, -- ລະຫັດສິນຄ້າ (ໄອດີ)
  `Price_ID` INT NULL, -- ລະຫັດລາຄາຄຳທີ່ອ້າງອີງຕອນສ້າງ
  `Order_ID` INT NULL, -- ລະຫັດການສັ່ງຊື້ (ຖ້າມາຈາກການສັ່ງຊື້)
  `Inv_ID` INT NULL, -- ລະຫັດໃບບິນ (ຖ້າມາຈາກການສັ່ງຊື້)
  `Re_ID` INT NULL, -- ລະຫັດການຊື້ຄືນ (ຖ້າມາຈາກການຊື້ຄືນ)
  `Pd_name` VARCHAR(100) NOT NULL, -- ຊື່ສິນຄ້າ
  `Type` VARCHAR(50) NULL, -- ປະເພດສິນຄ້າ (ຕ່າງຫູ, ສ້ອຍຄໍ,...)
  `Weight` DECIMAL(10, 2) NOT NULL, -- ນ້ຳໜັກ (ກຣາມ)
  `Pattern_value` DECIMAL(20, 2) NULL DEFAULT 0.00, -- ຄ່າກຳເນັດ/ຄ່າລາຍ
  `status` ENUM('AVAILABLE', 'SOLD', 'REPURCHASED', 'EXCHANGED') NOT NULL DEFAULT 'AVAILABLE', -- ສະຖານະ
  `condition` ENUM('GOOD', 'NEEDS_REPAIR', 'REPAIRED', 'DAMAGED') NOT NULL DEFAULT 'GOOD', -- ສະພາບສິນຄ້າ
  PRIMARY KEY (`Pd_ID`),
  CONSTRAINT `FK_Product_Price` FOREIGN KEY (`Price_ID`) REFERENCES `Tb_Price` (`Price_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_Product_Order` FOREIGN KEY (`Order_ID`) REFERENCES `Tb_Order` (`Order_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_Product_Invoice` FOREIGN KEY (`Inv_ID`) REFERENCES `Tb_Invoice` (`Inv_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_Product_Repurchase` FOREIGN KEY (`Re_ID`) REFERENCES `Tb_Repurchase` (`Re_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================= --
-- TABLE: Tb_Sell - ຕາຕະລາງເກັບຂໍ້ມູນການຂາຍສິນຄ້າ (ໜ້າການຂາຍ)
-- ================================================================================= --
CREATE TABLE `Tb_Sell` (
  `Sell_ID` INT NOT NULL AUTO_INCREMENT, -- ລະຫັດການຂາຍ (ໄອດີ)
  `Pd_ID` INT NOT NULL, -- ລະຫັດສິນຄ້າທີ່ຂາຍ (ອ້າງອີງ)
  `Cust_ID` INT NULL, -- ລະຫັດລູກຄ້າ (ອ້າງອີງ)
  `User_ID` VARCHAR(255) NULL, -- ລະຫັດຜູ້ໃຊ້ທີ່ຂາຍ (ອ້າງອີງ)
  `Sell_Date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ວັນທີຂາຍ
  `Quantity` INT NOT NULL DEFAULT 1, -- ຈຳນວນ
  `Price_At_Sale` DECIMAL(20, 2) NOT NULL, -- ລາຄາ ณ ເວລາຂາຍ
  `Discount` DECIMAL(20, 2) NULL DEFAULT 0.00, -- ສ່ວນຫຼຸດ
  `Payment_Method` VARCHAR(50) NULL, -- ວິທີການຊຳລະເງິນ
  `Total` DECIMAL(20, 2) NOT NULL, -- ລາຄາລວມສຸດທິ
  PRIMARY KEY (`Sell_ID`),
  UNIQUE KEY `UK_Sell_Product` (`Pd_ID`), -- สินค้า 1 ชิ้น ขายได้ครั้งเดียว
  CONSTRAINT `FK_Sell_Product` FOREIGN KEY (`Pd_ID`) REFERENCES `Tb_Product` (`Pd_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Sell_Customer` FOREIGN KEY (`Cust_ID`) REFERENCES `Tb_Customer` (`Cust_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_Sell_User` FOREIGN KEY (`User_ID`) REFERENCES `Tb_User` (`User_ID`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================= --
-- TABLE: Tb_Order_Product - ຕາຕະລາງເຊື່ອມໂຍງການສັ່ງຊື້ ແລະ ສິນຄ້າ (Junction Table)
-- ================================================================================= --
CREATE TABLE `Tb_Order_Product` (
  `Order_Product_ID` INT NOT NULL AUTO_INCREMENT, -- ລະຫັດລາຍການສັ່ງຊື້ (ໄອດີ)
  `Order_ID` INT NOT NULL, -- ລະຫັດການສັ່ງຊື້ (ອ້າງອີງ)
  `Pd_ID` INT NOT NULL, -- ລະຫັດສິນຄ້າ (ອ້າງອີງ)
  `Quantity` INT NOT NULL, -- ຈຳນວນ
  `Buy_price` DECIMAL(20, 2) NOT NULL, -- ລາຄາຊື້
  `Discount` DECIMAL(20, 2) NULL DEFAULT 0.00, -- ສ່ວນຫຼຸດ
  PRIMARY KEY (`Order_Product_ID`),
  UNIQUE KEY `UK_Order_Product` (`Order_ID`, `Pd_ID`),
  CONSTRAINT `FK_OrderProduct_Order` FOREIGN KEY (`Order_ID`) REFERENCES `Tb_Order` (`Order_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_OrderProduct_Product` FOREIGN KEY (`Pd_ID`) REFERENCES `Tb_Product` (`Pd_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ================================================================================= --
-- TABLE: Tb_Exchange - ຕາຕະລາງເກັບຂໍ້ມູນການປ່ຽນສິນຄ້າ (ໜ້າການປ່ຽນສິນຄ້າ)
-- ================================================================================= --
CREATE TABLE `Tb_Exchange` (
  `Exch_ID` INT NOT NULL AUTO_INCREMENT, -- ລະຫັດການປ່ຽນ (ໄອດີ)
  `Cust_ID` INT NULL, -- ລະຫັດລູກຄ້າ (ອ້າງອີງ)
  `Old_Pd_ID` INT NOT NULL, -- ລະຫັດສິນຄ້າເກົ່າທີ່ນຳມາປ່ຽນ
  `New_Pd_ID` INT NOT NULL, -- ລະຫັດສິນຄ້າໃໝ່ທີ່ປ່ຽນໄປ
  `Exch_Date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ວັນທີປ່ຽນ
  `Old_Product_Value` DECIMAL(20, 2) NOT NULL, -- ມູນຄ່າສິນຄ້າເກົ່າ
  `New_Product_Value` DECIMAL(20, 2) NOT NULL, -- ມູນຄ່າສິນຄ້າໃໝ່
  `Exchange_Fee` DECIMAL(20, 2) NULL DEFAULT 0.00, -- ຄ່າທຳນຽມການປ່ຽນ
  `Lost_Weight_Fee` DECIMAL(20, 2) NULL DEFAULT 0.00, -- ຄ່ານ້ຳໜັກທອງຫຼຸດ
  `Different_price` DECIMAL(20, 2) NOT NULL, -- ລາຄາສ່ວນຕ່າງທີ່ຕ້ອງຈ່າຍ
  `Notes` TEXT NULL, -- ໝາຍເຫດ
  PRIMARY KEY (`Exch_ID`),
  UNIQUE KEY `UK_Exchange_OldProduct` (`Old_Pd_ID`), -- สินค้าเก่า 1 ชิ้น แลกได้ครั้งเดียว
  UNIQUE KEY `UK_Exchange_NewProduct` (`New_Pd_ID`), -- สินค้าใหม่ 1 ชิ้น แลกออกได้ครั้งเดียว
  CONSTRAINT `FK_Exchange_Customer` FOREIGN KEY (`Cust_ID`) REFERENCES `Tb_Customer` (`Cust_ID`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `FK_Exchange_OldProduct` FOREIGN KEY (`Old_Pd_ID`) REFERENCES `Tb_Product` (`Pd_ID`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `FK_Exchange_NewProduct` FOREIGN KEY (`New_Pd_ID`) REFERENCES `Tb_Product` (`Pd_ID`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET foreign_key_checks = 1;

