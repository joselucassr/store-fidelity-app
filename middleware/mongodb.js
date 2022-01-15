import mongoose from 'mongoose';

const connectDB = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    // Use current db connection
    return handler(req, res);
  }
  try {
    // Use new db connection
    mongoose.connect(process.env.mongodburl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    return handler(req, res);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
