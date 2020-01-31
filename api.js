const axios = require('axios');

module.exports.getUserLoginById = async function(id) {
  try {
    const res = await axios.get(`https://api.glitch.com/v1/users/by/id?id=${id}`)
    return res.data[id].login;
  } catch (error) {
    console.log(error);
  }
}

module.exports.isEmptyCollection = async function(url) {
  const safeUrl = encodeURIComponent(url);
  try {
    const res = await axios.get(`https://api.glitch.com/v1/collections/by/fullUrl/projects?limit=1&fullUrl=${safeUrl}`)
    return res.data.items.length === 0;
  } catch (error) {
    // console.log(error);
  }
}

module.exports.isEmptyTeamPage = async function(url) {
  const safeUrl = encodeURIComponent(url);
  try {
    const res = await axios.get(`https://api.glitch.com/v1/teams/by/url/projects?limit=1&url=${safeUrl}`)
    return res.data.items.length === 0;
  } catch (error) {
    console.log(error);
  }
  
  module.exports.isEmptyUserPage = async function(url) {
  const safeUrl = encodeURIComponent(url);
  try {
    const res = await axios.get(`https://api.glitch.com/v1/users/by/url/projects?limit=1&url=${safeUrl}`)
    return res.data.items.length === 0;
  } catch (error) {
    console.log(error);
  }
}
