const Lock = require("../models/Lock");
const User = require("../models/User");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const webSocketController = require("./webSocketController");
const dotenv = require("dotenv"); // Import the dotenv library

function convertTime(time) {
	const newTime = new Date(
		moment(time, "hh:mm").year(1970).month(0).date(1)
	).toUTCString();
	return newTime;
}

dotenv.config({
	path: "./src/database/.env",
}); // Config the local ENV

// Function to handle lock creation
const createLock = async (req, res, next) => {
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

			// Find all admin users in the User collection
			const admins = await User.find({ admin: true });

			// Convert the "00:00" and "23:59" time strings to JavaScript Date objects
			const startTime = convertTime("00:00");
			const endTime = convertTime("23:59");

			// Add a new lock history entry to the lockHistory array of each admin user
			// and save the updated user document to the database
			for (const admin of admins) {
				admin.lockHistory.push({
					lockName: lock.name,
					start_time: startTime,
					end_time: endTime,
				});
				await admin.save();
			}

			return res.status(200).json({ message: "Lock created successfully" });
		} catch (error) {
			return res.status(500).json({ message: error.message });
		}
	}
};

const addToLockHistory = async (req, res) => {
	// Requires email, lock name, start time and end time for the lock use
	const { email, lockName, start_time, end_time } = req.body;
	const admin = req.admin;

	if (admin) {
		try {
			// Check for lock existance in database
			const lockExists = await Lock.findOne({ name: lockName });
			if (!lockExists) {
				return res
					.status(400)
					.json({ message: "Lock does not exists" });
			}
			const userExists = await User.findOne({ email: email });
			if (!userExists) {
				return res
					.status(400)
					.json({ message: "User does not exists" });
			}

			// // Check if lock password is correct (should be)
			// const checkLockPass = await bcrypt.compare(
			// 	lockPassword,
			// 	lockExists.password
			// );
			// if (!checkLockPass) {
			// 	return res.status(401).json({ message: "Invalid credentials" });
			// }

			const newStartTime = convertTime(start_time);
			const newEndTime = convertTime(end_time);

			const existingLockHistory = await User.findOne({
				email: email,
				lockHistory: {
					$elemMatch: {
						lockName: lockName,
						start_time: { $gte: newStartTime, $lte: newEndTime },
						end_time: { $gte: newStartTime, $lte: newEndTime },
					},
				},
			});
			if (existingLockHistory) {
				return res.status(402).send({
					message:
						"You already can utilize this lock in this timeframe",
				});
			}

			// Pushes to the array the new Lock
			userExists.lockHistory.push({
				lockName: lockName,
				start_time: newStartTime,
				end_time: newEndTime,
			});
			// Save modifications
			await userExists.save();
			return res.status(200).send({ message: "Added Lock to User" });
		} catch (error) {
			// Catches errors
			return res.status(402).send({ message: error.message });
		}
	} else {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

const removeFromLockHistory = async (req, res) => {
	// Requires email, lock name, start time, and end time for the lock use
	const { email, lockName, start_time, end_time } = req.body;
	const admin = req.admin;

	if (admin) {
		try {
			// Check for user existence in database
			const userExists = await User.findOne({ email: email });
			if (!userExists) {
				return res
					.status(400)
					.json({ message: "User does not exists" });
			}

			// Use the $pull operator to remove the lock history entry from the array
			await User.updateOne(
				{ email: email },
				{
					$pull: {
						lockHistory: {
							lockName: lockName,
							start_time: convertTime(start_time),
							end_time: convertTime(end_time),
						},
					},
				}
			);

			return res.status(200).send({ message: "Removed Lock from User" });
		} catch (error) {
			// Catches errors
			return res.status(402).send({ message: error.message });
		}
	} else {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

const changeLockName = async (req, res) => {
	// Requires old lock name and new lock name
	const { oldLockName, newLockName } = req.body;
	const admin = req.admin;

	if (admin) {
		try {
			// Check if old lock name exists
			const lockExists = await Lock.findOne({ name: oldLockName });
			if (!lockExists) {
				return res.status(400).json({ message: "Lock does not exist" });
			}

			// Update lock name in Lock model
			await Lock.updateOne({ name: oldLockName }, { name: newLockName });

			// Update lock name in lockHistory field of User model
			await User.updateMany(
				{ "lockHistory.lockName": oldLockName },
				{ $set: { "lockHistory.$.lockName": newLockName } }
			);
			webSocketController.updateActiveLockName(oldLockName, newLockName);
			return res.status(200).send({ message: "Changed lock name" });
		} catch (error) {
			// Catches errors
			return res.status(402).send({ message: error.message });
		}
	} else {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

const changeLockPassword = async (req, res) => {
	// Requires old lock name and new lock name
	const { lockName, lockPassword } = req.body;
	const admin = req.admin;

	if (admin) {
		try {
			// Check if lock exists
			const lockExists = await Lock.findOne({ name: lockName });
			if (!lockExists) {
				return res.status(400).json({ message: "Lock does not exist" });
			}

			const passHash = await bcrypt.hash(lockPassword, 10);

			// Update lock password in Lock collection
			await Lock.updateOne(
				{ name: lockName,
				password: passHash 			
				}
			);

			// Return 200
			return res.status(200).send({ message: "Changed lock name" });
		} catch (error) {
			// Catches errors
			return res.status(402).send({ message: error.message });
		}
	} else {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

const removeLock = async (req, res) => {
	// Requires lock name
	const { lockName } = req.body;
	const admin = req.admin;

	if (admin) {
		try {
			// Check if lock exists
			const lockExists = await Lock.findOne({ name: lockName });
			if (!lockExists) {
				return res.status(400).json({ message: "Lock does not exist" });
			}

			// Remove lock from Lock collection
			await Lock.deleteOne({ name: lockName });

			// Remove references to lock in lockHistory field of User model
			await User.updateMany(
				{},
				{ $pull: { lockHistory: { lockName: lockName } } }
			);
			webSocketController.removeLockFromActiveList(lockName);
			return res.status(200).send({ message: "Removed lock" });
		} catch (error) {
			// Catches errors
			return res.status(402).send({ message: error.message });
		}
	} else {
		return res.status(401).json({ message: "Unauthorized" });
	}
};

const lockControl = async (req, res, next) => {
	const { lockName, status } = req.body;
	let check;
	try {
		if (status == "open") {
			check = false;
		} else {
			check = true;
		}
		const lockExists = await Lock.findOne({ name: lockName });
		if (lockExists) {
			const timeNow = moment().year(1970).month(0).date(1).toDate();

			try {
				const user = await User.findOne({
					email: req.email,
					lockHistory: {
						$elemMatch: {
							lockName: lockName,
							start_time: { $lte: timeNow },
							end_time: { $gte: timeNow },
						},
					},
				});
				if (!user) {
					return res
						.status(402)
						.json({
							message:
								"You cant open this lock in this timeframe!",
						});
				} else {
					if (lockExists.isLocked == check) {
						return res.status(402).json({
							message:
								"Lock is already in " + status + "ed status",
						});
					} else {
						req.status = status;
						req.lockName = lockName;
						return next();
					}
				}
			} catch (error) {
				return res
					.status(404)
					.json({
						message:
							"You can not open this door in this timeframe ",
					});
			}
		}
		return res.status(404).json({ message: "Lock not found on database" });
	} catch (error) {
		return res.status(500).json({ message: error.message });
	}
};

module.exports = {
	createLock,
	addToLockHistory,
	removeFromLockHistory,
	changeLockName,
	changeLockPassword,
	removeLock,
	lockControl,
};
