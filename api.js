const axios = require('axios');

module.exports.getUserById = async function(id) {
  const res = await axios.get(`https://api.glitch.com/v1/users/by/id?id=${id}`);
  return res.data;
}