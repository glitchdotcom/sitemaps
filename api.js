const axios = require('axios');
/*
module.exports.getUserById = function(id) {
  try {
    const res = axios.get(`https://api.glitch.com/v1/users/by/id?id=${id}`);
    console.log(res.data)
    return res.data;
  } catch(error) {
    console.log("error getting user " + id);
  }
};
*/

module.exports.getUserById = function(id) {
  return axios
    .get(`https://api.glitch.com/v1/users/by/id?id=${id}`)
    .then((res) => {res.data; console.log('api.js', res.data);})
    .catch((error) => { console.log("error getting user " + id) });
};