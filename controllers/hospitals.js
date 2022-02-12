const Hospital = require('../models/Hospital');

// Method ของ Hospital (ex. Hospital.findById) มาจาก Mongoose
//@des      Get all hospitals
//@route    GET /api/v1/hospitals
//@access   Public
exports.getHospitals= async (req,res,next) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json({success: true,count:hospitals.length,data:hospitals});
    } catch(err) {
        res.status(400).json({success:false});
    }
};

//@des      Get single hospital
//@route    GET /api/v1/hospitals/:id
//@access   Public
exports.getHospital= async (req,res,next)  => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        if(!hospital) {
            return res.status(400).json({success: false});
        }
        res.status(200).json({success: true, data:hospital});
    } catch (err) {
        res.status(400).json({success:false});
    }
};

//@des      Create a hospital
//@route    POST /api/v1/hospitals
//@access   Private
exports.createHospitals= async (req,res,next) => {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({success: true, data: hospital});
};

//@des      Update a hospital
//@route    PUT /api/v1/hospitals/:id
//@access   Public
exports.updateHospitals= async (req,res,next) => {
    try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id,req.body, {
        new: true,
        runValidators:true
    });
    if (!hospital) {
        return res.status(400).json({success:false});
    }
    res.status(200).json({success:true, data:hospital});
    } catch (err) {
        res.status(400).json({success: false});
    }
};

//@des      Delete a hospital
//@route    DELETE /api/v1/hospitals/:id
//@access   Public
exports.deleteHospitals= async (req,res,next) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id, req.body);

        if (!hospital) {
            return res.status(400).json({success: false});
        }
        res.status(200).json({success:true,data: {}});
    } catch(err) {
        res.status(400).json({success: false});
    }
};