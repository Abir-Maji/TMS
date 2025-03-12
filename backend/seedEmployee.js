// seedEmployee.js
const mongoose = require("mongoose");
const Employee = require("./models/Employee");
require("dotenv").config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Function to seed an employee
const seedEmployee = async () => {
  try {
    const employee = new Employee({
      name: "a",
      email: "a@example.com",
      phone: "1234567890",
      team: "A",
      username: "a",
      password: "a", // ⚠ Plain text password (Not recommended)
    });

    await employee.save();
    console.log("Employee user created:", employee);
  } catch (error) {
    console.error("Error seeding employee:", error);
  } finally {
    mongoose.connection.close(); // Close the connection
  }
};

// Run the seed function
seedEmployee();
