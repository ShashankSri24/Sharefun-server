import jwt from 'jsonwebtoken';
import { User } from '../model/SignUpSchema.js';

export const authentication = async (req, res, next) => {
  try {
    const token = (req.headers.authorization).replace("Bearer ", "");
    

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "User is not authenticated!"
      });
    }
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // console.log("Decoded token:", decoded); // Log decoded token for debugging
    req.body.user = await User.findById(decoded.userid);
    // console.log("Authenticated user:", req.user); // Log authenticated user for debugging

    next();
  } catch (err) {
    // console.error("Authentication error:", err);
    return res.status(400).json({
      success: false,
      message: 'Something went wrong: ' + err.message
    });
  }
};
