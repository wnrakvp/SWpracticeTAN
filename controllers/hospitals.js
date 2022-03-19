const Hospital = require('../models/Hospital');

// Method ของ Hospital (ex. Hospital.findById) มาจาก Mongoose
// @des      Get all hospitals
// @route    GET /api/v1/hospitals
// @access   Public
const getHospitals = async (req, res) => {
  try {
    const reqQuery = { ...req.query };
    const removeFields = ['select', 'sort', 'page', 'limit'];
    removeFields.forEach((param) => delete reqQuery[param]);
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    let query = Hospital.find(JSON.parse(queryStr)).populate('appointment');

    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Hospital.countDocuments();
    query = query.skip(startIndex).limit(limit);

    // Excuting query
    const hospitals = await query;
    // Pagination result
    const pagination = {};
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }
    res
      .status(200)
      .json({ success: true, count: hospitals.length, pagination, data: hospitals });
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
  } catch (e) {
    return res.status(400).json({ success: false, msg: e.message });
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
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      throw new SyntaxError('Cannot find data.');
    }
    hospital.remove();
    return res.status(200).json({ success: true, data: {} });
  } catch (err) {
    return res.status(400).json({ success: err.message });
  }
};

module.exports = {
  getHospital,
  getHospitals,
  createHospitals,
  updateHospitals,
  deleteHospitals,
};
