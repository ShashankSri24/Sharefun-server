import { User } from "../model/SignUpSchema.js";
import bcrypt from "bcrypt";
import { sendVerificationEmail } from "../utils/SendVerification.js";
import { generateToken } from "../utils/JwtToken.js";
import { v2 as cloudinary } from "cloudinary";
export const Register = async (req, res, next) => {
  const { firstName, lastName, password, email } = req.body;
  if (!(firstName || lastName || password || email)) {
    next("Please fill All Credentials");
    return;
  }

  const isRegisterd = await User.findOne({
    $or: [
      {
        email,
        isVerified: true,
      },
    ],
  });
  if (isRegisterd) {
    return res.json({
      success: "false",
      message: "User Already registered",
    });
  }

  try {
    // first let the hash password provided from user
    const hashPassword = await bcrypt.hash(password, 10);
    //creating Verification code
    const verificationcode = Math.floor(
      100000 * Math.random() + 900000
    ).toString();
    let user = await User.create({
      firstName,
      lastName,
      email,
      verificationcode: verificationcode,
      password: hashPassword,
    });
    await sendVerificationEmail(user.email, verificationcode, res);
  } catch (err) {
    return res.json({
      message: ("Something went wrong", err),
    });
  }
};

export const getAllUser = async (req, res) => {
  try {
    const { userId } = req.body.user || {};
    const { id } = req.params;
    const finalId = id || userId;
    const user = await User.findById(finalId).populate({
      path: "friends",
      select: "-password",
    });

    if (!user) {
      return res.status(200).json({
        success: false,
        message: "User Not found",
      });
    }
    user.password = undefined;
    res.status(200).json({
      success: true,
      message: "User found",
      user: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error" + err,
    });
  }
};

export const UpdateUser = async (req, res, next) => {
  const { profileUrl } = req.files;
  const Formats = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
  if (!Formats.includes(profileUrl.mimetype)) {
    return next("File Format Not Supported!");
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    profileUrl.tempFilePath
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary Error:",
      cloudinaryResponse.error || "Unknown Cloudinary error"
    );
    return next("Failed To Upload To Cloudinary");
  }
  try {
    const { userId } = req.body.user || {};

    const { id } = req.params;
    const finalId = id ?? userId;

    const { firstName, lastName, location, profession } = req.body;
   const profileUrlImg = cloudinaryResponse.secure_url;
    if (!(firstName || lastName || location || profession)) {
      return "Please provide all required fields";
    }

    if (!finalId) {
      return res.status(400).json({
        success: false,
        message: "No valid user ID provided",
      });
    }

    let dataUpdate = {
      firstName,
      lastName,
      location,
      profession,
      profileUrl: { url: profileUrlImg },
    };

    const user = await User.findByIdAndUpdate(finalId, dataUpdate, {
      new: true,
    }).populate({
      path: "friends",
      select: "firstName lastName location profession profileUrl",
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.save();
    await generateToken(
      user,
      200,
      ",your data has been updated with  your new token  ",
      res
    );
    user.password = undefined;
  } catch (error) {
    console.error("Error in UpdateUser function:", error);
    return res.status(500).json({
      message: "Internal Server Error: " + error.message,
      success: false,
    });
  }
};

export const Login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!(email || password)) {
      return res.json({
        status: "400",
        message: "Please Enter Email and Password",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(404).json({
        message: "Invalid email and password ",
      });
    }
    const ispassword = await bcrypt.compare(password, user.password);
    if (!ispassword) {
      return res.status(400).json({
        message: "Password is Incorrect!",
      });
    }
    generateToken(user, 200, "User logged In Successfully", res);
  } catch (error) {
    return res.status(400).json({
      message: "User password is Invalid",
    });
  }
};

export const logout = async (req, res) => {
  return res
    .status(201)
    .cookie("GenerateToken", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
      secure: true,
      sameSite: "None",
    })
    .json({
      success: true,
      message: "User Logged Out Successfully.",
    });
};
