import mongoose from 'mongoose';

const connectDB = (handler) => async (req, res) => {
  console.log('Check for entry on DB');
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }
  try {
    // Use new db connection
    await mongoose.connect(process.env.mongodburl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    return handler(req, res);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
