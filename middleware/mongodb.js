import mongoose from 'mongoose';

const connectDB = (handler) => async (req, res) => {
  console.time('dbConnect');
  console.log('Check for entry on DB');
  if (mongoose.connections[0].readyState) {
    console.log('if (mongoose.connections[0].readyState) {');
    // Use current db connection
    console.log('return handler(req, res);');
    return handler(req, res);
  }
  try {
    console.log('try {');
    console.timeLog('dbConnect');
    // Use new db connection
    mongoose.connect(process.env.mongodburl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.timeLog('dbConnect');

    console.log(`await mongoose.connect(process.env.mongodburl, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });`);
    console.log(`return handler(req, res);`);
    return handler(req, res);
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
