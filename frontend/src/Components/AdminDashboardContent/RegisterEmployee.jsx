import React from 'react';

const RegisterEmployee = () => {
  const handleRegisterEmployee = async (e) => {
    e.preventDefault();

    const employeeData = {
      name: e.target.elements.name.value,
      email: e.target.elements.email.value,
      phone: e.target.elements.phone.value,
      team: e.target.elements.team.value,
      username: e.target.elements.username.value,
      password: e.target.elements.password.value,
    };

    try {
      const response = await fetch('http://localhost:5000/employee/register-employee', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employeeData),
      });

      const responseText = await response.text(); // Log the raw response
      console.log('Response:', responseText);

      const result = JSON.parse(responseText); // Parse the response manually
      if (response.ok) {
        alert('Employee registered successfully');
      } else {
        alert(result.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Register Employee</h2>
      <form onSubmit={handleRegisterEmployee}>
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          className="border rounded px-3 py-2 mb-2 w-full"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Employee Email"
          className="border rounded px-3 py-2 mb-2 w-full"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Employee Phone"
          className="border rounded px-3 py-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          name="team"
          placeholder="Employee Team Number"
          className="border rounded px-3 py-2 mb-2 w-full"
          required
        />
        <input
          type="text"
          name="username"
          placeholder="Employee ID"
          className="border rounded px-3 py-2 mb-2 w-full"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="border rounded px-3 py-2 mb-2 w-full"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Register Employee
        </button>
      </form>
    </div>
  );
};

export default RegisterEmployee;