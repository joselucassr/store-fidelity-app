import { findOne } from '../../helper/mongoAPI';

const handler = async (req, res) => {
  if (!req.method === 'POST')
    return res.status(422).send('req_method_not_supported');

  const { phoneNumber } = req.body;

  if (!phoneNumber) return res.status(422).send('data_incomplete');

  try {
    // Trying the mongo API
    const resData = await findOne('customers', { phoneNumber: phoneNumber });

    if (resData === null) return res.status(404).send({ msg: 'not found' });

    return res.status(200).send({ points: resData.pointsTotal });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

export default handler;
