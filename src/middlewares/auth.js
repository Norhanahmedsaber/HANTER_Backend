const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../Models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.getById(decoded.id);
    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({
      message: "Not Authorized",
    });
  }
};

module.exports = auth;
