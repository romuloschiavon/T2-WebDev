const User = require("../models/User"); // Import the User model
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library
const bcrypt = require("bcryptjs"); // Import the bcrypt library
const moment = require("moment"); // Import the moment libraby for time conversion

const dotenv = require("dotenv"); // Import the dotenv library

dotenv.config({
	path: "./src/database/.env",
}); // Config the local ENV

// Function to handle user registration
const register = async (req, res) => {
	// Extract the user email and password from the request body
	const { email, password, confirm_password } = req.body;

	const userExists = await User.findOne({ email: email });
	if (userExists) {
		return res.status(400).json({ message: "Email already in use" });
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
		const admin = user.admin;

		// Generate a JSON Web Token that contains the user's email
		const secret = process.env.SECRET;
		const token = jwt.sign({ email, admin }, secret, {
			expiresIn: "86400s",
		});

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

		// Generate a JSON Web Token that contains the user's ID and ADMIN status
		const admin = user.admin;
		const secret = process.env.SECRET;
		const token = jwt.sign({ email, admin }, secret, {
			expiresIn: "86400s",
		});

		// Send a success response with the JWT
		return res
			.status(200)
			.setHeader("Authorization", token)
			.json({ token });
	} catch (error) {
		// If there was an error, send a failure response
		return res.status(500).json({ message: error.message });
	}
};

const dashboard = async (req, res) => {
	const email = req.email;

	try {
		const user = await User.findOne({ email: email });

		const groupedLocks = user.lockHistory.reduce((acc, curr) => {
			const lockName = curr.lockName;
			if (!acc[lockName]) {
				acc[lockName] = [];
			}
			acc[lockName].push({
				start_time: curr.start_time,
				end_time: curr.end_time,
			});
			return acc;
		}, {});

		const groupedLocksArray = Object.entries(groupedLocks).map(
			([lockName, timeFrames]) => ({
				lockName,
				time_frames: timeFrames,
			})
		);

		return res.status(200).json(groupedLocksArray);
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

const getAllUsersFromLock = async (req, res) => {
	if (req.admin) {
		const lockName  = req.headers.lockname;

		if (!lockName) {
			return res
				.status(402)
				.json({ message: "Bad Request: No lock name found on body" });
		}

		try {
			const users = await User.find({
				lockHistory: { $exists: true, $not: { $size: 0 } },
			}).select({
				email: 1,
				lockHistory: {
					$elemMatch: {
						lockName: lockName,
					},
				},
			});
			// const users = await User.find({
			// 	"lockHistory.lockName": lockName,
			// }).select("email lockHistory.lockName lockHistory.start_time lockHistory.end_time");
			if (!users) {
				return res.status(404).json({ message: "No users found" });
			}
			return res.status(200).json(users);
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	} else {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

module.exports = { register, login, dashboard, getAllUsersFromLock };
