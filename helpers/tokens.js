const jwt = require("jsonwebtoken");

exports.generateToken = (payload, expired) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: expired });
};

exports.verifyToken = (token, secret) => {
  try {
    let check = jwt.verify(token, secret);

    return check;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
