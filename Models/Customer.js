import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var customer = new Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  pointsTotal: {
    type: Number,
    required: true,
    default: 0,
  },
  since: {
    type: Date,
    default: Date.now,
  },
});

mongoose.models = {};

var Customer = mongoose.model('Customer', customer);

export default Customer;
