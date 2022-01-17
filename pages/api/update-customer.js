import Customer from '../../Models/Customer';
import Transaction from '../../Models/Transaction';

import { runOp } from '../../helper/math';
import { findOne, updateOne, insertOne } from '../../helper/mongoAPI';

const handler = async (req, res) => {
  if (!req.method === 'POST')
    return res.status(422).send('req_method_not_supported');

  const { phoneNumber, operation, points } = req.body;

  if (!phoneNumber || !operation || !points)
    return res.status(422).send('data_incomplete');

  try {
    // Create transaction
    let transactionModel = new Transaction({
      phoneNumber,
      points: parseInt(points),
      type: operation,
    });
    await insertOne('transactions', transactionModel);

    const customer = await findOne('customers', { phoneNumber: phoneNumber });

    if (customer === null) {
      let customerModel = new Customer({
        phoneNumber,
        pointsTotal: parseInt(points),
      });
      await insertOne('customers', customerModel);
      return res.status(201).send({ msg: 'cliente criado' });
    }

    await updateOne(
      'customers',
      {
        phoneNumber: phoneNumber,
      },
      {
        $set: {
          pointsTotal: runOp(customer.pointsTotal, operation, parseInt(points)),
        },
      },
    );

    return res.status(201).send({ msg: 'cliente atualizado' });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export default handler;
