const express = require('express');
const { getHospitals,getHospital,createHospitals,deleteHospitals,updateHospitals} = require('../controllers/hospitals');
const router = express.Router();
// Hospital path
    router.route('/').get(getHospitals).post(createHospitals);
    router.route('/:id').get(getHospital).put(updateHospitals).delete(deleteHospitals);
// end of hospital routes
module.exports=router;