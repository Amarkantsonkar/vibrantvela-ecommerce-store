const Pincode = require("../models/Pincode");
const { ROLES } = require("../utils/contant");

const addPincodes = async (req, res) => {
  if (req.role !== ROLES.admin) {
    return res.status(401).json({
      success: false,
      error: "Access denied.",
    });
  }

  const { pincodes } = req.body;

  if (!pincodes || pincodes.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Please provide a pincode",
    });
  }

  try {
    // check if pincode already exists
    const existingPincode = await Pincode.find({
      pincode: { $in: pincodes.map((p) => p.pincode) },
    });

    const existingPincodesValues = existingPincode.map((p) => p.pincode);

    const newPincodes = pincodes.filter(
      (p) => !existingPincodesValues.includes(p.pincode)
    );

    if (newPincodes.length === 0) {
      return res.status(400).json({
        success: false,
        error: "All pincodes already exist",
      });
    }

    // add new pincodes to the database
    await Pincode.insertMany(newPincodes);

    return res.status(200).json({
      success: true,
      message: "Pincodes added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

const getPincode = async (req, res) => {
  const { pincode } = req.params;

  try {
    const pincodes = await Pincode.find({ pincode });

    if (!pincodes || pincodes.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No delivery available for this product",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Delivery available",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = { addPincodes, getPincode };
