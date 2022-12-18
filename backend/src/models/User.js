const mongoose = require("../database/connection");
const lockHistorySchema = require("./LockHistory");

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		lockHistory: [lockHistorySchema],
		admin: {
			type: Boolean,
			default: false
		}
	},
	{
		// Make the lockHistory field optional
		lockHistory: {
			required: false,
		},
	}
);

const User = mongoose.model("users", userSchema);

module.exports = User;
