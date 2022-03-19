const Appointment = require('../models/Appointment');
const Hospital = require('../models/Hospital');

// @desc    Get single Appointments
// @route
// @access
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id).populate({
      path: 'hospital',
      select: 'name description tel',
    });
    if (!appointment) {
      return res.status(404).json({
        success: false,
        msg: `No appointment with the id ${req.params.id}`,
      });
    }
    return res.status(200).json({ success: true, data: appointment });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, msg: 'Cannot find Appointment' });
  }
};

// @desc    Get All Appointments
// @route
// @access
exports.getAppointments = async (req, res) => {
  let query;
  // General users can see only their appointments
  if (req.user.role !== 'admin') {
    query = Appointment.find({ user: req.user.id }).populate({
      path: 'hospital',
      select: 'name province tel',
    });
  } else {// If you are an admin, you can see all!
  if (req.params.hospitalId) {
    query = Appointment.find({ hospital: req.params.hospitalId }).populate({
      path: 'hospital',
      select: 'name province tel',
    });
  } else {
    query = Appointment.find().populate({
      path: 'hospital',
      select: 'name province tel',
    });
  }
}
  try {
    const appointments = await query;
    return res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
// @desc    Add Appointment
// @route   POST /api/v1/hospitals/:hospitalId/appointment
// @access  Private
exports.addAppointment = async (req, res) => {
  // add user Id to req.body
  req.body.user = req.user.id;

  // Check for existed appointment
  const existedAppointments = await Appointment.find({ user: req.user.id });
  // If the user is not an admin, they can only create 3 appointments.
  if (existedAppointments.length >= 3 && req.user.role !== 'admin') {
    return res.status(400).json({
      success: false,
      msg: `The user with ID ${req.user.id} has already made 3 appointments`,
    });
  }
  try {
    req.body.hospital = req.params.hospitalId;
    const hospital = await Hospital.findById(req.params.hospitalId);
    if (!hospital) {
      throw new SyntaxError('Cannot find data');
    }
    const appointment = await Appointment.create(req.body);
    return res.status(200).json({ success: true, data: appointment });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: false, msg: 'Cannot create Appointment' });
  }
};
// @desc    Update Appointment
// @route   PUT /api/v1/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      throw new SyntaxError('Cannot find data.');
    }
    // Make sure user is the appointment owner
    if (
      appointment.user.toString() !== req.user.id
      && req.user.role !== 'admin'
    ) {
      return res
        .status(401)
        .json({
          success: false,
          msg: `User ${req.user.id} is not authorized to update this appointment`,
        });
    }
    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(200).json({ success: true, data: appointment });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: true, msg: 'Cannot update Appointment' });
  }
};
// @desc    Delete Appointment
// @route   DELETE /api/v1/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      throw new SyntaxError('Cannot find data.');
    }
    if (
      appointment.user.toString() !== req.user.id
      && req.user.role !== 'admin'
    ) {
      return res
        .status(401)
        .json({
          success: false,
          msg: `User ${req.user.id} is not authorized to delete this appointment`,
        });
    }
    appointment = await appointment.remove();
    return res.status(200).json({ success: true, data: {} });
  } catch (e) {
    console.log(e);
    return res
      .status(500)
      .json({ success: true, msg: 'Cannot delete Appointment' });
  }
};
