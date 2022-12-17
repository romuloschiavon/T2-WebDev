const Lock = require("../models/Lock"); // Import the User model
const bcrypt = require("bcryptjs"); // Import the bcrypt library

const dotenv = require("dotenv"); // Import the dotenv library

dotenv.config({
	path: "./src/database/.env",
}); // Config the local ENV

// Function to handle lock creation
const create = async (req, res) => {
	// Extract the lock name and password from the request body
	const { name, password, confirm_password } = req.body;

	const lockExists = await Lock.findOne({ name: name });
	if (lockExists) {
		return res.status(400).json({ message: "Lock already exists" });
	}

	try {
		// Check for the password confirmation
		if (!password || !confirm_password) {
			return res.status(422).json({ message: "Bad authentication" });
		} else if (password !== confirm_password) {
			return res.status(422).json({ message: "Bad authentication" });
		}

		// Encrypt the password
		const passHash = await bcrypt.hash(password, 10);

		// Create a new lock with the specified email and password
		const lock = new Lock({ name: name, password: passHash });
		// Save the user to the database
		await lock.save();

		res.status(201).json({ message: "Lock created!" });
	} catch (error) {
		// If there was an error, send a failure response
		res.status(500).json({ message: error.message });
	}
};

module.exports = { create };
