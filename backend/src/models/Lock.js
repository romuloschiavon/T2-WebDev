const mongoose = require("../database/connection");

// Define lock schema
const lockSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true,
	},
	isLocked: {
		type: Boolean,
		default: true,
	},
});

const Lock = mongoose.model("Lock", lockSchema);

module.exports = Lock;
