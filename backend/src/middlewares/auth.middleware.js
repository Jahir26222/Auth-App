const jwt = require("jsonwebtoken");
const userModel = require("../model/user.model");

async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies.Token;

    if (!token) {
      return res.status(401).json({
        message: "Token not found, please login"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid Token"
    });
  }
}

module.exports = authMiddleware;
