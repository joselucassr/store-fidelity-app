import connectDB from '../../middleware/mongodb';
import Customer from '../../Models/Customer';

const handler = async (req, res) => {
  if (!req.method === 'POST')
    return res.status(422).send('req_method_not_supported');

  const { phoneNumber } = req.body;

  if (!phoneNumber) return res.status(422).send('data_incomplete');

  try {
    let customer = await Customer.findOne({ phoneNumber });

    return res.status(200).send({ points: customer.pointsTotal });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export default connectDB(handler);
