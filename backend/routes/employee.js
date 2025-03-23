const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const Collaborator = require('../models/Collaborator');

router.post('/register-employee', async (req, res) => {
    try {
        const { name, email, phone, team, username, password } = req.body;

        // Validate input
        if (!name || !email || !phone || !team || !username || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Trim the username *immediately* after receiving it. This is critical.
        const trimmedUsername = username.trim();

        // Check if employee already exists (email for employee)
        const existingEmployee = await Employee.findOne({ email });

        if (existingEmployee) {
            return res.status(409).json({ message: 'Employee with this email already exists' });
        }


        // **Double Check** - Check if collaborator already exists (username for collaborator) - *BEFORE* the upsert. This adds extra safety
        let existingCollaborator;
        try {
            existingCollaborator = await Collaborator.findOne({ username: trimmedUsername });
            if (existingCollaborator) {
                return res.status(409).json({ message: 'Collaborator with this username already exists' });
            }
        } catch (dbError) {
            console.error("Database error checking for existing collaborator:", dbError);
            return res.status(500).json({ message: 'Error checking for existing collaborator' });
        }



        // Atomic upsert to prevent race conditions
        const result = await Collaborator.updateOne(
            { username: trimmedUsername }, // Filter: Find a collaborator with this username (TRIMMED)
            {
                $setOnInsert: {  // Only set these fields if a new document is inserted
                    name: name,
                    message: `Welcome ${name}`, // Or leave it undefined
                },
            },
            { upsert: true } // Options:  If no document matches, insert a new one
        );


         // Double check
         if (result.upsertedCount === 0 && result.modifiedCount === 0) {
            // No document was upserted, meaning a document with this username already exists
            return res.status(409).json({ message: 'Collaborator with this username already exists' });
        }


        // **Employee Save with Specific Error Handling**
        try {
            const newEmployee = new Employee({
                name,
                email,
                phone,
                team,
                username,
                password,
            });
            await newEmployee.save();
        } catch (employeeError) {
            console.error("Error saving employee:", employeeError);
            return res.status(500).json({ message: 'Error saving employee' }); // Generic error message for the client
        }

        res.status(201).json({ message: 'Employee registered and collaborator added successfully' });


    } catch (error) {
        if (error.code === 11000) {
            // Duplicate username error (This is a fallback, it SHOULDN'T happen)
            console.error("Duplicate key error (fallback):", error);
            return res.status(409).json({ message: 'Duplicate key error. A collaborator with this username already exists.' });
        }
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
