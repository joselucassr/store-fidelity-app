import connectDB from '../../middleware/mongodb';
import Customer from '../../Models/Customer';

const handler = async (req, res) => {
  console.time('handler');
  console.log('START');
  if (!req.method === 'POST')
    return res.status(422).send('req_method_not_supported');
  console.log(
    'if (!req.method === "POST") return res.status(422).send("req_method_not_supported");',
  );

  const { phoneNumber } = req.body;
  console.log('const { phoneNumber } = req.body;');

  if (!phoneNumber) return res.status(422).send('data_incomplete');
  console.log(
    'if (!phoneNumber) return res.status(422).send("data_incomplete");',
  );

  try {
    console.timeLog('handler');
    console.log('try {');
    let customer = await Customer.findOne({ phoneNumber });
    console.timeLog('handler');
    console.log('let customer = await Customer.findOne({ phoneNumber });');

    console.log(
      'return res.status(200).send({ points: customer.pointsTotal });',
    );
    return res.status(200).send({ points: customer.pointsTotal });
  } catch (error) {
    console.log('return res.status(500).send(error.message)');
    return res.status(500).send(error.message);
  }
};

export default connectDB(handler);
