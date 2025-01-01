import { User } from "../model/SignUpSchema.js";


export const VerifyEmail = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findOne({
      verificationcode: code
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Email Invalid'
      });
    }

    user.isVerified = true;
    user.verificationcode = undefined;

    await user.save(); // Save the user object after updating

    // try {
    //   await WelcomeEmail(user.email, user.firstName,res);
    // } catch (emailError) {
    //   console.error("Error sending welcome email:", emailError);
    //   // Optionally handle the email sending error (e.g., log it, alert admin)
    // }
    // Send success response before attempting to send email
   return res.status(200).json({
      success: true,
      message: 'Email has been verified'
    });

    // Send welcome email
   

  } catch (err) {
    console.error("Error during email verification:", err);
    return res.status(400).json({
      success: false,
      message: "The verification code is incorrect"
    });
  }
};
