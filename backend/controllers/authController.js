import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {User}  from '../models/userModel.js';
import transporter from "../config/nodemailer.js"; // Import nodemailer transporter
// import User from '../models/User.js';

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Validate input
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY, // Token expiration time
    });
    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Prevent CSRF attacks
    });

    // Send Welcome email
    const mailOptions = {
      from: process.env.EMAIL_FROM, // Sender address
      to: email, // List of recipients
      subject: `Welcome to , ${process.env.APP_NAME}`, // Subject line
      text: `Hello ${name},\n\nThank you for registering with us! We're excited to have you on board.\n\nBest regards,\nYour Company Name`, // Plain text body
    };
    // Send the email using nodemailer

    await transporter.sendMail(mailOptions);
    // Log the email sending status
    console.log(`Welcome email sent to ${email}`);
    // Respond with success message
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY, // Token expiration time
    });
    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Prevent CSRF attacks
    });
    // Respond with success message
    res
      .status(200)
      .json({ success: true, message: "User logged in successfully" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// Log user out
export const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", // Prevent CSRF attacks
    });
    // Respond with success message
    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Send verification OTP to user's email
export const sendVerifyOtp = async (req, res) => {
  try {
    const { userID } = req.body;
    const user = await User.findById(userID);

    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account already verified" });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    user.verifyOtp = otp;
    user.verifyOtpExpiresAt = expiresAt;
    await user.save();
    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_FROM, // Sender address
      to: user.email, // Recipient's email
      subject: `Verify your account`, // Subject line
      text: `Your verification OTP is ${otp}. It is valid for 10 minutes.`, // Plain text body
    };
    await transporter.sendMail(mailOptions);
    console.log(`Verification OTP sent to ${user.email}`);
    res
      .status(200)
      .json({ success: true, message: "Verification OTP sent successfully" });
  } catch (error) {}
};


// Verify Email
export const verifyEmail = async (req, res) => {
  const { userID, otp } = req.body;
  if (!userID || !otp) {
    return res
      .status(400)
      .json({ success: false, message: "User ID and OTP are required" });
  }
  try {
    const user = await User.findById(userID);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    if (user.isAccountVerified) {
      return res
        .status(400)
        .json({ success: false, message: "Account already verified" });
    }
    if (user.verifyOtp !== otp || user.verifyOtp === null) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }
    if (Date.now() > user.verifyOtpExpiresAt) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }
    // Mark account as verified
    user.isAccountVerified = true;
    user.verifyOtp = null; // Clear OTP after verification
    user.verifyOtpExpiresAt = 0; // Clear OTP expiration time
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Account verified successfully" });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// Checks if user is logged in
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, message: "User is Authenticated " });
  } catch (error) {}
};



// Send Password Reset OTP
export const sendResetOTP = async (req, res) => {
    const {email} = req.body;
     
    if(!email){
        return res.json({success: false, message:'Email is required'});
    }

    try {
        const user = await User.findOne(email);

        if(!user){
            return res.json({success:false, message:'User does not exist'})
        }

         // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expiresAt = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    user.resetOtp = otp;
    user.resetOtpExpiresAt = expiresAt;
    await user.save();
    // Send OTP via email
    const mailOptions = {
      from: process.env.EMAIL_FROM, // Sender address
      to: user.email, // Recipient's email
      subject: `Password reset otp`, // Subject line
      text: `Your OTP for resetting your password is ${otp}. It is valid for 10 minutes.`, // Plain text body
    };
    await transporter.sendMail(mailOptions);

    return res.json({success: true, message:'Otp sent to your email'})

        
    } catch (error) {
        return res.json({success: false, message:error.message});
    }
};


// Reset User Password 
export const resetPassword = async(req,res) =>{
    const {email, otp, newPassword} = req.body;


    if(!email || !otp || !newPassword){
        return res.json({success:false, message:'Email , OTP and new password are required'})
    }

    try {
        
        const user = await User.findOne(email);

        if(!user){
          return res.json({success:false, message:'User not found'}) 
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success:false, message:'Invalid OTP'}) 
        }

        if(Date.now > user.resetOtpExpiresAt ){
            return res.json({success:false, message:'OTP Expired'}) 
        }

        const hashedPassword = await bcrypt.hash(newPassword,10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpiresAt = '';
        await user.save();
        
        return res.json({success:true, message:'Password reset successfully'})


    } catch (error) {

        return res.json({success:false, message:error.message})
        
    }
}