const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 เริ่มต้นใส่ข้อมูลตัวอย่าง...');

  try {
    // ล้างข้อมูลเก่าก่อน (ถ้ามี)
    console.log('🧹 ล้างข้อมูลเก่า...');
    await prisma.tb_Sell.deleteMany();
    await prisma.tb_Exchange.deleteMany();
    await prisma.tb_Repurchase.deleteMany();
    await prisma.tb_Product.deleteMany();
    await prisma.tb_Customer.deleteMany();
    await prisma.tb_Supplier.deleteMany();
    await prisma.tb_Price.deleteMany();

    // รีเซ็ต Auto Increment เป็น 1
    console.log('🔄 รีเซ็ต Auto Increment...');
    await prisma.$executeRaw`ALTER TABLE Tb_Price AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Tb_Customer AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Tb_Supplier AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Tb_Product AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Tb_Sell AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Tb_Exchange AUTO_INCREMENT = 1`;
    await prisma.$executeRaw`ALTER TABLE Tb_Repurchase AUTO_INCREMENT = 1`;

    // 1. สร้างข้อมูลราคาทอง
    console.log('💰 สร้างข้อมูลราคาทอง...');
    const goldPrice = await prisma.tb_Price.create({
      data: {
        Date: new Date(),
        Buy_price: 2850000,  // 2,850,000 LAK ต่อบาท
        Sell_price: 2900000  // 2,900,000 LAK ต่อบาท
      }
    });

    // 2. สร้างข้อมูลลูกค้า (15 รายการ)
    console.log('👥 สร้างข้อมูลลูกค้า...');
    const customers = [
      { name: 'ນາງ ສົມຈິດ ວົງດາວ', phone: '020-55559999', address: 'ບ້ານ ໜອງດວງ, ເມືອງ ສີໂຄດ, ວຽງຈັນ' },
      { name: 'ທ້າວ ບຸນມີ ແສງສຸວັນ', phone: '020-77778888', address: 'ບ້ານ ທ່າເຮືອ, ເມືອງ ຈັນທະບູລີ, ວຽງຈັນ' },
      { name: 'ນາງ ຄຳຜອງ ລາວງາມ', phone: '020-99996666', address: 'ບ້ານ ດອນນອກ, ເມືອງ ສີສັດຕະນາກ, ວຽງຈັນ' },
      { name: 'ທ້າວ ວິໄລ ພົມມະວົງ', phone: '020-44445555', address: 'ບ້ານ ນາເຊົາ, ເມືອງ ສີໂຄດ, ວຽງຈັນ' },
      { name: 'ນາງ ສີລາວັນ ມະນີວົງ', phone: '020-33334444', address: 'ບ້ານ ຫາດຊາຍ, ເມືອງ ຫາດຊາຍ, ວຽງຈັນ' },
      { name: 'ທ້າວ ບຸນທັນ ສຸກສົມບູນ', phone: '020-22223333', address: 'ບ້ານ ພຽງດິນ, ເມືອງ ຈັນທະບູລີ, ວຽງຈັນ' },
      { name: 'ນາງ ດາວດວງ ແກ້ວມະນີ', phone: '020-88889999', address: 'ບ້ານ ວັດຕະໜ້າ, ເມືອງ ສີສັດຕະນາກ, ວຽງຈັນ' },
      { name: 'ທ້າວ ສິງໂຕ ຄຳພູມ', phone: '020-66667777', address: 'ບ້ານ ໂນນມີໃຫຍ່, ເມືອງ ປາກງື່ມ, ວຽງຈັນ' },
      { name: 'ນາງ ອານຸສອນ ວັນດີ', phone: '020-11112222', address: 'ບ້ານ ດົງມະໄຟ, ເມືອງ ສຽຂອດ, ວຽງຈັນ' },
      { name: 'ທ້າວ ມະໂນ ລາຊາວົງ', phone: '020-55556666', address: 'ບ້ານ ຫ້ວຍສາຍ, ເມືອງ ຫີນເຫີບ, ວຽງຈັນ' },
      { name: 'ນາງ ພັນທິບ ແສງອາລຸນ', phone: '020-99998888', address: 'ບ້ານ ແກ້ວນູນ, ເມືອງ ຈັນທະບູລີ, ວຽງຈັນ' },
      { name: 'ທ້າວ ບຸນເຮືອງ ມະລິວັນ', phone: '020-44447777', address: 'ບ້ານ ຫາດທາດ, ເມືອງ ຫາດຊາຍ, ວຽງຈັນ' },
      { name: 'ນາງ ລັດດາ ຈັນດາວົງ', phone: '020-33335555', address: 'ບ້ານ ທ່າໃນ, ເມືອງ ສີໂຄດ, ວຽງຈັນ' },
      { name: 'ທ້າວ ເດດ ວົງສະຫວັນ', phone: '020-77779999', address: 'ບ້ານ ປາກເຊ, ເມືອງ ປາກງື່ມ, ວຽງຈັນ' },
      { name: 'ນາງ ມຸກດາ ສີທອງ', phone: '020-66668888', address: 'ບ້ານ ດົງນາທອງ, ເມືອງ ສຽຂອດ, ວຽງຈັນ' }
    ];

    for (const customer of customers) {
      await prisma.tb_Customer.create({
        data: {
          Cust_name: customer.name,
          Phone: customer.phone,
          Address: customer.address
        }
      });
    }

    // 3. สร้างข้อมูลผู้ส่งสินค้า (15 รายการ)
    console.log('🚚 สร้างข้อมูลผู้ส่งสินค้า...');
    const suppliers = [
      { name: 'ບໍລິສັດ ທອງຄຳ ລາວ ຈຳກັດ', phone: '021-123456', address: 'ບ້ານ ໂຄກຂ່າງ, ເມືອງ ສີໂຄດ, ວຽງຈັນ' },
      { name: 'ຮ້ານ ສີທອງ ມະນີແກ້ວ', phone: '021-234567', address: 'ບ້ານ ດອນມີໃຫຍ່, ເມືອງ ຈັນທະບູລີ, ວຽງຈັນ' },
      { name: 'ວິສາຫະກິດ ແກ້ວທອງ', phone: '021-345678', address: 'ບ້ານ ນາເຊົາ, ເມືອງ ສີສັດຕະນາກ, ວຽງຈັນ' },
      { name: 'ບໍລິສັດ ມະນີຄຳ ຈຳກັດ', phone: '021-456789', address: 'ບ້ານ ທ່າເຮືອ, ເມືອງ ຫາດຊາຍ, ວຽງຈັນ' },
      { name: 'ຮ້ານ ດາວທອງ ກິຕຕິຄຸນ', phone: '021-567890', address: 'ບ້ານ ຫ້ວຍສາຍ, ເມືອງ ປາກງື່ມ, ວຽງຈັນ' },
      { name: 'ໂຮງງານ ລາວະທອງ', phone: '021-678901', address: 'ບ້ານ ໂນນມີຫນ້ອຍ, ເມືອງ ສຽຂອດ, ວຽງຈັນ' },
      { name: 'ວິສາຫະກິດ ຄຳລາວ', phone: '021-789012', address: 'ບ້ານ ວັດຕະໜ້າ, ເມືອງ ຫີນເຫີບ, ວຽງຈັນ' },
      { name: 'ບໍລິສັດ ທອງແດງ ຈຳກັດ', phone: '021-890123', address: 'ບ້ານ ດົງມະໄຟ, ເມືອງ ສີໂຄດ, ວຽງຈັນ' },
      { name: 'ຮ້ານ ມະນີຄຳ ລາວ', phone: '021-901234', address: 'ບ້ານ ແກ້ວນູນ, ເມືອງ ຈັນທະບູລີ, ວຽງຈັນ' },
      { name: 'ວິສາຫະກິດ ສີທອງລາວ', phone: '021-012345', address: 'ບ້ານ ປາກເຊ, ເມືອງ ສີສັດຕະນາກ, ວຽງຈັນ' },
      { name: 'ໂຮງງານ ແກ້ວມະນີ', phone: '021-112233', address: 'ບ້ານ ຫາດຊາຍ, ເມືອງ ຫາດຊາຍ, ວຽງຈັນ' },
      { name: 'ບໍລິສັດ ທອງຄຳດາວ ຈຳກັດ', phone: '021-223344', address: 'ບ້ານ ທ່າໃນ, ເມືອງ ປາກງື່ມ, ວຽງຈັນ' },
      { name: 'ຮ້ານ ລາວເກີດ ທອງຄຳ', phone: '021-334455', address: 'ບ້ານ ດົງນາທອງ, ເມືອງ ສຽຂອດ, ວຽງຈັນ' },
      { name: 'ວິສາຫະກິດ ມະນີທອງ', phone: '021-445566', address: 'ບ້ານ ໜອງດວງ, ເມືອງ ຫີນເຫີບ, ວຽງຈັນ' },
      { name: 'ບໍລິສັດ ຄຳປະທີບ ຈຳກັດ', phone: '021-556677', address: 'ບ້ານ ຫາດທາດ, ເມືອງ ສີໂຄດ, ວຽງຈັນ' }
    ];

    for (const supplier of suppliers) {
      await prisma.tb_Supplier.create({
        data: {
          Sup_name: supplier.name,
          Phone: supplier.phone,
          Address: supplier.address
        }
      });
    }

    // 4. สร้างข้อมูลสินค้า (20 ชิ้น)
    console.log('💍 สร้างข้อมูลสินค้า...');
    const products = [
      { name: 'ແຫວນ', type: 'ລາຍມັງກອນ', weight: 5.50, pattern: 580000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ສ້ອຍຄໍ', type: 'ລາຍດອກໄມ້', weight: 12.30, pattern: 1250000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ຕຸ້ມຫູ', type: 'ລາຍວົງກົມ', weight: 3.20, pattern: 320000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ແຫວນ', type: 'ລາຍເປັດ', weight: 4.80, pattern: 485000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ສາຍແຂນ', type: 'ລາຍງູ', weight: 8.75, pattern: 880000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ຮູບນົກ', type: 'ຈິ້', weight: 2.10, pattern: 210000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ແຫວນ', type: 'ລາຍດາວ', weight: 6.20, pattern: 625000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ສ້ອຍຄໍ', type: 'ລາຍໂຊ້', weight: 15.40, pattern: 1550000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ຕຸ້ມຫູ', type: 'ລາຍໄຂ່ມຸກ', weight: 2.80, pattern: 285000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ແຫວນ', type: 'ລາຍບົວ', weight: 5.10, pattern: 515000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ສາຍແຂນ', type: 'ລາຍດອກກຸຫລາບ', weight: 9.60, pattern: 965000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ຮູບຫົວໃຈ', type: 'ຈິ້', weight: 1.90, pattern: 195000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ແຫວນ', type: 'ລາຍໝາກໄມ້', weight: 4.50, pattern: 455000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ສ້ອຍຄໍ', type: 'ລາຍຢູ່ດີ', weight: 11.20, pattern: 1125000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ຕຸ້ມຫູ', type: 'ລາຍໄຜ່', weight: 3.60, pattern: 365000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ແຫວນ', type: 'ລາຍອິນໂດ', weight: 7.30, pattern: 735000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ສາຍແຂນ', type: 'ລາຍແກ້ວ', weight: 10.80, pattern: 1085000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ຮູບດວງຈັນ', type: 'ຈິ້', weight: 2.40, pattern: 245000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ແຫວນ', type: 'ລາຍກະລາສີ', weight: 5.90, pattern: 595000, status: 'AVAILABLE', condition: 'GOOD' },
      { name: 'ສ້ອຍຄໍ', type: 'ລາຍມະກອກ', weight: 13.70, pattern: 1375000, status: 'AVAILABLE', condition: 'GOOD' }
    ];

    for (const product of products) {
      await prisma.tb_Product.create({
        data: {
          Price_ID: goldPrice.Price_ID,
          Pd_name: product.name,
          Type: product.type,
          Weight: product.weight,
          Pattern_value: product.pattern,
          status: product.status,
          condition: product.condition
        }
      });
    }

    console.log('✅ ใส่ข้อมูลตัวอย่างเสร็จสิ้น!');
    console.log(`📊 สรุปข้อมูลที่สร้าง:`);
    console.log(`   💰 ราคาทอง: 1 รายการ`);
    console.log(`   👥 ลูกค้า: ${customers.length} รายการ`);
    console.log(`   🚚 ผู้ส่งสินค้า: ${suppliers.length} รายการ`);
    console.log(`   💍 สินค้า: ${products.length} รายการ`);
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 