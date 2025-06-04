import { Contestant } from "../models/contestantModel.js";
import  {User} from '../models/userModel.js'
import transporter from "../config/nodemailer.js";
import {cloudinary} from "../config/cloudinary.js";

const deleteCloudImage = async (photoPublicId) =>{
     try {
         await cloudinary.uploader.destroy(contestant.photoPublicId);
         return true;
     } catch (error) {
        return res.status(500).json({success:false, message: error.mesaage})
        
     }     
   
}

const uploadCloudImage = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'contestant_photos', // Specify the folder in Cloudinary
      public_id: file.filename, // Use the original filename as public ID
      resource_type: 'image', // Specify the resource type
    });
    return {
      url: result.secure_url, // The URL of the uploaded image
      publicId: result.public_id, // The public ID of the uploaded image
    };
  } catch (error) {
    throw new Error('Failed to upload image to Cloudinary: ' + error.message);
  }
};
// Create a contestant profile  

export const createProfile = async (req, res) => {
  try {
    const { stageName, bio, photo } = req.body;
    const userId = req.user?._id;
    console.log(userId);

    const existing = await Contestant.findOne({ userId });

    if (existing) {
      return res.status(400).json({ error: "Profile already exist" });
    }
      if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'Photo upload required' });
    }

    if((!stageName || !bio) || stageName.trim() === '' || bio.trim() === ''){
      return res.status(400).json({ error: 'Stage name and bio are required' });
    }

    const { url, publicId } = await uploadCloudImage(req.file);

    const profile = await Contestant.create({
      userId,
      stageName,
      bio,
      photo: url, // Store the URL of the uploaded image
      photoPublicId: publicId, // Store the public ID of the uploaded image
      
    });

    res.status(201).json({message:'Profile Created',profile});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const listApprovedProfiles = async (req, res) => {
  try {
    const contestants = await Contestant.find({ approved: true })
      .populate("userId", "name email") // Populate user details
      .sort({ createdAt: -1 }); // Sort by creation date

    res.json(contestants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const approveProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name } = await User.findById(id);
    const profile = await Contestant.findByIdAndUpdate(
      id,
      { approved: true },
      { new: true }
    );

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, error: "Profile not found" });
    }

    res.json({
      success: true,
      message: profile.stageName + " approved successfully",
      profile,
    });
    // Send Approval email
    const mailOptions = {
      from: process.env.EMAIL_FROM, // Sender address
      to: email, // List of recipients
      subject: `Welcome to , ${process.env.APP_NAME}`, // Subject line
      text: `Hello ${name},\n\n Your profile has been approved! We're excited to have you on board.\n\nBest regards,\nYour Company Name`, // Plain text body
    };
    // Send the email using nodemailer

    await transporter.sendMail(mailOptions);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const profile = await Contestant.findById(id);
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, error: "Profile not found" });
    }
    if(!deleteCloudImage(profile.photoPublicId)){
         return res
        .status(404)
        .json({ success: false, error: "Unable to delete profile photo from cloud" });
    }
    await profile.deleteOne()
    res
      .status(200)
      .json({ success: true, message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
