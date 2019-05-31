const axios = require('axios');

module.exports.getUserById = function(id) {
  axios
    .get(`https://api.glitch.com/v1/users/by/id?id=${id}`)
    .then((res) => res.data)
    .catch((error) => error);
};
