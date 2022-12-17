const express = require("express"); // Import express

const userController = require("./controllers/userController.js"); // Import the user controller functions
const lockController = require("./controllers/lockController.js"); // Import the lock controller functions
const luController = require("./controllers/LUController.js"); // Import the lock user relationship controller functions

// Utilize express router
const router = express.Router();

// Import authentication middleware for JWT decoding
const auth = require("./middlewares/auth.js");

// Create a route for registering users
router.post("/users/register", userController.register);

// Create a route for logging in users
router.post("/users/login", userController.login);

// Create a route for creating locks
router.post("/locks/create", auth.verify, lockController.create);

// Create a route to correlate users and locks
router.post(
	"/usersLocks/updateLock",
	auth.verify,
	luController.addToLockHistory
);

module.exports = router;