const jwt = require("jsonwebtoken");

exports.generateToken = (payload, expired) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: expired });
};

exports.verifyToken = (token, secret) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
  return check;
};
