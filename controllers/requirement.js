const Requirement = require("../models/Requirement");
const User = require("../models/User");

exports.createRequirement = async (req, res) => {
  try {
    const requirement = await new Requirement(req.body).save();
    await requirement.populate(
      "user",
      "company_Name picture username Economic_Sector"
    );

    res.json(requirement);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.getAllRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.find()
      .populate("user", "company_Name picture username Economic_Sector")
      .sort({ createdAt: -1 }); // to the newest to the oldest the way post come
    res.json(requirements);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.deleteRequirement = async (req, res) => {
  try {
    await Requirement.findByIdAndRemove(req.params.id);
    res.json({ status: "ok" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
