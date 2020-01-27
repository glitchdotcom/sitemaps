const axios = require('axios');

module.exports.getUserById = async function(id) {
  try {
    const res = await axios.get(`https://api.glitch.com/v1/users/by/id?id=${id}`);
    console.log(res.data)
    return res.data;
  } catch(error) {
    throw error;
  }
};
