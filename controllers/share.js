const User = require("../models/User");

exports.share = async (req, res) => {
  try {
    const topShares = 8;
    const shareBy = req.user.id;
    const user = await User.findById(shareBy);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.shares < topShares) {
      const updatedUser = (user.shares += 1);
      await user.save();
    } else {
      user.premium = true;
      await user.save();
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
