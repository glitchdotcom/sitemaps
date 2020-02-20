const axios = require('axios');

module.exports.getUserLoginById = async function(id) {
  try {
    const res = await axios.get(`https://api.glitch.com/v1/users/by/id?id=${id}`)
    return res.data[id].login;
  } catch (error) {
    console.log(error);
  }
}

module.exports.isAnonProject = async function(name) {
  try {
    const res = await axios.get(`https://api.glitch.com/v1/projects/by/domain/users?orderKey=createdAt&limit=10&orderDirection=ASC&lastOrderValue=1&domain=${name}`)
    const usersArray = res.data.items;
    
    let hasAuthedUser = false;
    let i = 0;
    while (!hasAuthedUser && i < usersArray.length) {
      hasAuthedUser = usersArray[i].login != null;
      i++;
    }
    return hasAuthedUser;
  } catch (error) {
    console.log(error.response.data);
    return false;
  }
}
  
module.exports.isEmptyUserPage = async function(login) {
  const safeLogin = encodeURIComponent(login);
  try {
    const res = await axios.get(`https://api.glitch.com/v1/users/by/login/projects?limit=1&login=${safeLogin}`)
    return res.data.items.length === 0;
  } catch (error) {
    console.log(error.response.data);
    return true;
  }
}
