const handler = async (req, res) => {
  if (!req.method === 'POST')
    return res.status(422).send('req_method_not_supported');

  const { user, password } = req.body;

  if (!user || !password) return res.status(422).send('data_incomplete');

  if (process.env.user !== user || process.env.password !== password)
    return res.status(401).send({});

  res.status(200).send({ loginToken: process.env.loginToken });
};

export default handler;
