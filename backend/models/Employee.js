const mongoose = require("mongoose");
const mongoosePaginate = require('mongoose-paginate-v2');

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  team: { type: String, required: true },
  designation: { type: String, required: true }, // Added designation field
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // ⚠ Plain text password (Not recommended)
}, { timestamps: true });
EmployeeSchema.plugin(mongoosePaginate);
const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;