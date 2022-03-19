const express = require('express');
const {
  getHospitals,
  getHospital,
  createHospitals,
  deleteHospitals,
  updateHospitals,
} = require('../controllers/hospitals');
const appointmentRouter = require('./appointment');

const router = express.Router();
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resource routers
router.use('/:hospitalId/appointments/', appointmentRouter);
// Hospital path
router
  .route('/')
  .get(getHospitals)
  .post(protect, authorize('admin'), createHospitals);
router
  .route('/:id')
  .get(getHospital)
  .put(protect, authorize('admin'), updateHospitals)
  .delete(protect, authorize('admin'), deleteHospitals);
// end of hospital routes
module.exports = router;
