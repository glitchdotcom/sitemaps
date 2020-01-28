const axios = require('axios');

module.exports.getUserLoginById = async function(id) {
  const res = await axios.get(`https://api.glitch.com/v1/users/by/id?id=${id}`)
  .then((res) => res.data[id].login)
  .catch((error) => console.log('error getting user ' + id));
}

module.exports.getUserLoginById = async function(id) {
  const res = await axios.get(`https://api.glitch.com/v1/users/by/id?id=${id}`)
  .then((res) => res.data[id].login)
  .catch((error) => console.log('error getting user ' + id));
}
