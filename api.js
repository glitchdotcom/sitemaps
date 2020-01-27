const axios = require('axios');

module.exports.getUserById = async function(id) {
  try {
    const res = await axios.get(`https://api.glitch.com/v1/users/by/id?id=${id}`);
    return res.data;
  } catch(error) {
    console.log(error);
  }
};
