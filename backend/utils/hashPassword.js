const bcrypt = require('bcrypt');

async function hashPassword(password) {
  try {
    const saltRounds = 10; // The number of salt rounds (adjust as needed)
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error('Error hashing password:', error);
    return null; // Or throw an error, depending on your needs
  }
}

// Example usage (for testing):
async function main() {
  const plainTextPassword = '$2b$10$UVycAGbivYyqtqqRuZLa/.d6wV0e2Yp3iF6ZoYiDssc3gx/qRUbsO'; // Replace with the password you want to hash
  const hashedPassword = await hashPassword(plainTextPassword);
  if (hashedPassword) {
    console.log('Hashed password:', hashedPassword);
  }
}

if (require.main === module) {
    main();
}

module.exports = hashPassword; // Export the function