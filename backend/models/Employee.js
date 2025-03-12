const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  team: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ⚠ Plain text password (Not recommended)
}, { timestamps: true });

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
