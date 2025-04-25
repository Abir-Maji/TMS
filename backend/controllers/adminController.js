const Admin = require('../models/Admin');

const createAdmin = async (req, res) => {
  try {
    const { username, password, name, role = 'admin', status = 'active', permissions = [] } = req.body;

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new admin
    const newAdmin = new Admin({
      username,
      password, // Note: In production, you should hash this password
      name,
      role,
      status,
      permissions: Array.isArray(permissions) ? permissions : [permissions],
      lastLogin: new Date()
    });

    await newAdmin.save();

    // Omit password from the response
    const adminResponse = newAdmin.toObject();
    delete adminResponse.password;

    res.status(201).json({
      message: 'Admin created successfully',
      admin: adminResponse
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ message: 'Server error while creating admin' });
  }
};

module.exports = {
  createAdmin
};