import mongoose from 'mongoose';
var Schema = mongoose.Schema;

var transaction = new Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  points: {
    type: Number,
    required: true,
    default: 0,
  },
  type: {
    type: String,
    required: true,
  },
  claimed: {
    type: String,
    default: '',
  },
  at: {
    type: Date,
    default: Date.now,
  },
});

mongoose.models = {};

var Transaction = mongoose.model('Transaction', transaction);

export default Transaction;
