import jwt from 'jsonwebtoken';

export const generateToken = async (user, statusCode, message, res) => {
  try {
    const token = jwt.sign(
      { userid: user._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: 24 * 60 * 60 } // Token expires in 1 day (in seconds)
    );

    return res
      .cookie('token',token, {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // Cookie expires in defined days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Set secure flag only in production
        sameSite: "None"
      })
      .status(statusCode)
      .json({
        success: true,
        user,
        message,
        token: token // Changed key name to token for clarity
      });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
