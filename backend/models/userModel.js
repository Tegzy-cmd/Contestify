import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum:['admin', 'contestant'],
        default: 'contestant',
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false, // Indicates if the user's email is verified
    },
    verifyOtp: {
        type: String,
        default: null, // OTP for email verification
    },
    verifyOtpExpiresAt: {
        type: Date,
        default: null, // Expiration time for the OTP
    },
    resetOtp: {
        type: String,
        default: null, // OTP for password reset
    },
    resetOtpExpiresAt: {
        type: Date,
        default: null, // Expiration time for password reset otp
    },
    
}, {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
});
const userModel = mongoose.models.user || mongoose.model('user', userSchema);
export  {userModel};
// server/models/userModel.js
// Export the User model for use in other parts of the application
// This model can be used to interact with the 'users' collection in MongoDB
// You can perform operations like create, read, update, and delete users using this model
// Example usage:
// import User from './models/userModel.js';
// const newUser = new User({ name: 'John Doe', email: '