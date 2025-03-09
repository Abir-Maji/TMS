// seedAdmin.js
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const seedAdmin = async () => {
  const admin = new Admin({
    username: 'admin',
    password: 'admin123', // Plain text password
  });

  await admin.save();
  console.log('Admin user created:', admin);
};

seedAdmin().then(() => mongoose.connection.close());