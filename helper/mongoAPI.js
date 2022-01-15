import axios from 'axios';

const findOne = async (collection, filter) => {
  try {
    let data = JSON.stringify({
      collection: collection,
      database: 'store-fidelity',
      dataSource: 'Cluster0',
      filter: filter,
    });

    let config = {
      method: 'post',
      url: 'https://data.mongodb-api.com/app/data-oajjs/endpoint/data/beta/action/findOne',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': process.env.mongoAPIKey,
      },
      data: data,
    };

    const resData = await axios(config);

    return resData.data.document;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const updateOne = async (collection, filter, update) => {
  try {
    let data = JSON.stringify({
      collection: collection,
      database: 'store-fidelity',
      dataSource: 'Cluster0',
      filter: filter,
      update: update,
    });

    let config = {
      method: 'post',
      url: 'https://data.mongodb-api.com/app/data-oajjs/endpoint/data/beta/action/updateOne',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': process.env.mongoAPIKey,
      },
      data: data,
    };

    const resData = await axios(config);

    return resData.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const insertOne = async (colection, model) => {
  try {
    let data = JSON.stringify({
      collection: colection,
      database: 'store-fidelity',
      dataSource: 'Cluster0',
      document: model,
    });

    let config = {
      method: 'post',
      url: 'https://data.mongodb-api.com/app/data-oajjs/endpoint/data/beta/action/insertOne',
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Request-Headers': '*',
        'api-key': process.env.mongoAPIKey,
      },
      data: data,
    };

    await axios(config);

    return 'OK';
  } catch (error) {
    console.error(error);
    throw error;
  }
};

module.exports = {
  findOne,
  updateOne,
  insertOne,
};
