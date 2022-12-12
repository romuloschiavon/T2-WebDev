const User = require("../models/User"); // Import the User model
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library
const bcrypt = require("bcryptjs"); // Import the bcrypt library

const dotenv = require("dotenv"); // Import the dotenv library

dotenv.config({
	path: "./src/database/.env",
}); // Config the local ENV

// Function to handle user registration
const register = async (req, res) => {
	// Extract the user email and password from the request body
	const { email, password, confirm_password } = req.body;

	const userExists = await User.findOne({email: email})
	if(userExists){
		return res.status(400).json({message: "Email already in use"})
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

		// Create a new user with the specified email and password
		const user = new User({ email: email, password: passHash });
		// Save the user to the database
		await user.save();

		// Generate a JSON Web Token that contains the user's email
		const secret = process.env.SECRET;
		const token = jwt.sign({ email }, secret, { expiresIn: "86400s" });

		// Send a success response with the JWT
		return res.status(201).json({ token });
	} catch (error) {
		// If there was an error, send a failure response
		return res.status(500).json({ message: error.message });
	}
};

// Function to handle user login
const login = async (req, res) => {
	// Extract the user email and password from the request body
	const { email, password } = req.body;

	try {
		// Find the user with the specified email
		const user = await User.findOne({ email });

		// If no user was found, send a failure response
		if (!user) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Compare the provided password with the hashed password in the database
		const checkPass = await bcrypt.compare(password, user.password);

		// If the password is invalid, send a failure response
		if (!checkPass) {
			return res.status(401).json({ message: "Invalid credentials" });
		}

		// Generate a JSON Web Token that contains the user's ID
		const secret = process.env.SECRET;
		const token = jwt.sign({ email }, secret, { expiresIn: "86400s" });

		// Send a success response with the JWT
		return res.status(200).setHeader("Authorization", token).json({ token });
	} catch (error) {
		// If there was an error, send a failure response
		return res.status(500).json({ message: error.message });
	}
};

module.exports = { register, login };
