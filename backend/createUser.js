const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  try {
    const [,, username, password, role] = process.argv;

    if (!username || !password || !role) {
      console.error('Please provide username, password, and role.');
      console.log('Usage: node createUser.js <username> <password> <role>');
      return;
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate unique User_ID
    const userId = `user-${username}-${Date.now().toString().slice(-6)}`;

    const user = await prisma.tb_User.upsert({
      where: { username: username },
      update: { Password: hashedPassword, Role: role },
      create: {
        User_ID: userId,
        username: username,
        Password: hashedPassword,
        Role: role
      },
    });

    console.log(`User "${username}" has been created/updated successfully:`, user);
  } catch (error) {
    console.error('Error creating/updating user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 