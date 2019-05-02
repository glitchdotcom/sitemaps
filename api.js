const axios = require('axios');

export async function getUserById(id) {
  return await axios.get(`https://api.glitch.com/v1/users/by/id?id=${id}`);
}