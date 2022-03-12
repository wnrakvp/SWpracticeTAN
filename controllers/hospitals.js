const Hospital = require('../models/Hospital');

// Method ของ Hospital (ex. Hospital.findById) มาจาก Mongoose
// @des      Get all hospitals
// @route    GET /api/v1/hospitals
// @access   Public
const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find();
    res
      .status(200)
      .json({ success: true, count: hospitals.length, data: hospitals });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @des      Get single hospital
// @route    GET /api/v1/hospitals/:id
// @access   Public
const getHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) {
      throw new SyntaxError('Cannot find data.');
    }
    return res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    return res.status(400).json({ success: false, msg: err.message });
  }
};

// @des      Create a hospital
// @route    POST /api/v1/hospitals
// @access   Private
const createHospitals = async (req, res) => {
  const hospital = await Hospital.create(req.body);
  res.status(201).json({ success: true, data: hospital });
};

// @des      Update a hospital
// @route    PUT /api/v1/hospitals/:id
// @access   Public
const updateHospitals = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      // Request body can be anything so this is a bug.
      new: true,
      runValidators: true,
    });
    if (!hospital) {
      throw new SyntaxError('Cannot find data.');
    }
    return res.status(200).json({ success: true, data: hospital });
  } catch (err) {
    return res.status(400).json({ success: false, msg: err.message });
  }
};

// @des      Delete a hospital
// @route    DELETE /api/v1/hospitals/:id
// @access   Public
const deleteHospitals = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id, req.body);

    if (!hospital) {
      throw new SyntaxError('Cannot find data.');
    }
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return res.status(400).json({ success: false });
  }
};

module.exports = {
  getHospital,
  getHospitals,
  createHospitals,
  updateHospitals,
  deleteHospitals,
};
