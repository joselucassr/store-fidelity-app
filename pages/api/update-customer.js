import connectDB from '../../middleware/mongodb';
import Customer from '../../Models/Customer';
import Transaction from '../../Models/Transaction';
import { runOp } from '../../helper/math';

const handler = async (req, res) => {
  if (!req.method === 'POST')
    return res.status(422).send('req_method_not_supported');

  const { phoneNumber, operation, points } = req.body;

  if (!phoneNumber || !operation || !points)
    return res.status(422).send('data_incomplete');

  try {
    // Create transaction
    let transaction = new Transaction({
      phoneNumber,
      points,
      type: operation,
    });
    await transaction.save();

    let customer = await Customer.findOne({ phoneNumber });

    // Update customer
    if (customer) {
      customer = await Customer.findOneAndUpdate(
        { phoneNumber },
        {
          $set: {
            pointsTotal: runOp(customer.pointsTotal, operation, points),
          },
        },
        { new: true },
      );

      return res.status(200).send(customer);
    }

    customer = new Customer({ phoneNumber, pointsTotal: points });
    await customer.save();

    return res.status(200).send(customer);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export default connectDB(handler);
