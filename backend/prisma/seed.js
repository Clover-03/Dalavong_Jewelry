const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('123', salt);

  const adminUser = await prisma.tb_User.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      User_ID: 'user-admin-001', // Example static ID
      username: 'admin',
      Password: hashedPassword,
      Role: 'admin',
    },
  });

  console.log({ adminUser });
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 
 
 
 
 
 
 
 
 
 
 
 