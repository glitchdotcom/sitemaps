const axios = require('axios');

module.exports.getUserById = async function(id) {
  let res = await axios.get(`https://api.glitch.com/v1/users/by/id?id=${id}`);
  let data = res.data;
  
  return axios
    .get(`https://api.glitch.com/v1/users/by/id?id=${id}`)
    .then((res) => res.data)
    .catch((error) => { throw error });
};
