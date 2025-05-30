import mongoose  from "mongoose";


const connectDB = async ()=>{
    mongoose.connection.on('error', (err) => {
        console.error(`MongoDB connection error: ${err.message}`);
    }
    );
    mongoose.connection.on('connected', () => {
        console.log('MongoDB connected successfully');
    }
    );
    mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected');
    }
    );
    await mongoose.connect(process.env.MONGODB_URI)
}

export { connectDB };
// server/config/mongodb.js