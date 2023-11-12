const jwt = require("jsonwebtoken");

exports.generateToken = (payload, expired) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: expired });
};

exports.generateRefreshToken = (payload, expired) => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: expired,
  });
};

exports.verifyToken = (token, secret) => {
  try {
    let check = jwt.verify(token, secret);

    return check;
  } catch (error) {
    throw new Error("Invalid token");
  }
};

exports.verifyRefreshToken = (refresh_token, secret) => {
  try {
    let check = jwt.verify(refresh_token, process.env.TOKEN_SECRET);

    return check;
  } catch (error) {
    throw new Error("Invalid token");
  }
};
