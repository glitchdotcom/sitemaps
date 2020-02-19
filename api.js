const axios = require('axios');

module.exports.getUserLoginById = async function(id) {
  try {
    const res = await axios.get(`https://api.glitch.com/v1/users/by/id?id=${id}`)
    return res.data[id].login;
  } catch (error) {
    console.log(error);
  }
}
  
module.exports.isEmptyUserPage = async function(login) {
  const safeLogin = encodeURIComponent(login);
  try {
    const res = await axios.get(`https://api.glitch.com/v1/users/by/login/projects?limit=1&login=${safeLogin}`)
    return res.data.items.length === 0;
  } catch (error) {
    console.log(error);
  }
}
