const Lock = require("../models/Lock");
const User = require("../models/User");
const moment = require("moment");
const bcrypt = require("bcryptjs");

function convertTime(time) {
	const newTime = new Date(
		moment(time, "hh:mm").year(1970).month(0).date(1)
	).toLocaleString("pt-BR", { hour12: false });
	return newTime;
}

const addToLockHistory = async (req, res) => {
	// Requires email, lock name, start time and end time for the lock use
	const { lockName, lockPassword, start_time, end_time } = req.body;

	try {
		// Check for lock existance in database
		const lockExists = await Lock.findOne({ name: lockName });
		if (!lockExists) {
			return res.status(400).json({ message: "Lock does not exists" });
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
			lockHistory: {
				$elemMatch: {
					lockName: lockName,
					start_time: { $gte: newStartTime, $lte: newEndTime },
					end_time: { $gte: newStartTime, $lte: newEndTime },
				},
			},
		});
		if(existingLockHistory){
			return res.status(402).send({ message: "You already have permission for a lock in this timeframe" });
		}

		const userExists = await User.findOne({ email: req.email });
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
};

module.exports = { addToLockHistory };
