const axios = require('axios');

module.exports.getUserById = async function(id) {
  return await axios.get(`https://api.glitch.com/v1/users/by/id?id=${id}`);
}