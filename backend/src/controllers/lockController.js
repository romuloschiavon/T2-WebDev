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
	const admin = req.admin;

	if (admin) {
		const lockExists = await Lock.findOne({ name: name });
		if (lockExists) {
			return res.status(400).json({ message: "Lock already exists" });
		}

		try {
			// Check for the password confirmation
			if (!password || !confirm_password) {
				return res
					.status(422)
					.json({ message: "Bad authentication" });
			} else if (password !== confirm_password) {
				return res
					.status(422)
					.json({ message: "Bad authentication" });
			}

			// Encrypt the password
			const passHash = await bcrypt.hash(password, 10);

			// Create a new lock with the specified email and password
			const lock = new Lock({ name: name, password: passHash });
			// Save the user to the database
			await lock.save();

			return res.status(201).json({ message: "Lock created!" });
		} catch (error) {
			// If there was an error, send a failure response
			return res.status(500).json({ message: error.message });
		}
	}else{
		return res.status(402).json({message: "Unauthorized"})
	}
};

const lockControl = async (req, res, next) => {
	const { lockName, status } = req.body;

	try {
		const lockExists = await Lock.findOne({ name: lockName });
		if (lockExists) {
			if(lockExists.isLocked === status){
				return res.status(402).json({ message: "Lock is already in " + status + " status"})
			}else{
				req.status = status
				req.lockName = lockName
				return next()
			}
		}
	} catch (error) {
		return res.status(500).json({ message: message.error })
	}
	
}

module.exports = { create, lockControl};
