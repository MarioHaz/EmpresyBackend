const User = require("../models/User");

exports.validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^[^@\s]+@[^@\s]+$/);
};
exports.validateLength = (text, min, max) => {
  if (text.length > max || text.length < min) {
    return false;
  }
  return true;
};

exports.validateUsername = async (username) => {
  // Replace spaces with '-'
  username = username.replace(/\s+/g, "-");

  // Replace 'ñ' with 'n'
  username = username.replace(/ñ/g, "n");

  // Remove accents using normalize and regex
  username = username.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Convert to lowercase
  username = username.toLowerCase();

  let a = false;
  do {
    let check = await User.findOne({ username });
    if (check) {
      // If username exists, add a random character to make it unique
      username += (+new Date() * Math.random()).toString().substring(0, 1);
      a = true;
    } else {
      a = false;
    }
  } while (a);
  return username;
};
