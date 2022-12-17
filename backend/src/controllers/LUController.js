const Lock = require("../models/Lock");
const User = require("../models/User");
const moment = require("moment");
const bcrypt = require("bcryptjs");

function convertTime(time) {
	const newTime = new Date(
		moment(time, "hh:mm").year(1970).month(0).date(1)
	).toUTCString();
	return newTime;
}

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

			// Check if lock password is correct (should be)
			const checkLockPass = await bcrypt.compare(
				lockPassword,
				lockExists.password
			);
			if (!checkLockPass) {
				return res.status(401).json({ message: "Invalid credentials" });
			}

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

module.exports = { addToLockHistory, removeFromLockHistory };
