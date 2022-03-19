const User = require('../models/User');

// const refreshTokens = [];
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const accessToken = user.getSignedJwtToken();
  // const refreshToken = jwt.sign(user.name, process.env.REFRESH_TOKEN_SECRET);
  // refreshTokens.push(refreshToken);
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }
  res.status(statusCode).cookie('token', accessToken, options).json({
    success: true,
    accessToken,
    // refreshToken,
    // refreshTokenList: refreshTokens,
  });
};
// @desc     Register user
// @route    POST /api/v1/auth/register
// @access   Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Create User
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    // Create Token
    // const token=user.getSignedJwtToken();
    // res.status(200).json({success:true,token});
    console.log(user);
    sendTokenResponse(user, 200, res);
  } catch (err) {
    if (err.code === 11000) {
      res.status(400).json({ success: false, msg: 'Email already existed!.' });
    } else {
      res.status(400).json({ success: false, msg: 'Unknown error code.' });
    }
    console.log(err.stack);
  }
};

// @desc     Login user
// @route    POST /api/v1/auth/login
// @access   Public
exports.login = async (req, res) => {
  const { email, password } = req.body;
  // Validate email & password
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, msg: 'Please provide an email and password' });
  }
  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(400).json({ success: false, msg: 'Invalid credentials' });
  }
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ success: false, msg: 'Invalid credentials' });
  }
  // Create token
  // const token = user.getSignedJwtToken();
  // res.status(200).json({success:true,token});
  console.log(user);
  return sendTokenResponse(user, 200, res);
};

// @desc     Get current Logged in user
// @route    GET /api/v1/auth/me
// @access   Private
exports.getMe = (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};
