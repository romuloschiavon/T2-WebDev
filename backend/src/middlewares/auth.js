const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config({
	path: "../database/.env",
});

const verify = async (req, res, next) => {

	if (req.headers && req.headers.authorization) {
		var authorization = req.headers.authorization,
			decoded;
		try {
			decoded = jwt.verify(authorization, process.env.SECRET);
		} catch (e) {
			return res.status(401).json({message: "Unauthorized"});
		}
		req.email = decoded.email;
		return next();
	}
	return res.status(500).json({message: "Unauthorized"});
};

module.exports = { verify };
