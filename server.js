// init project
const express = require('express');
const app = express();

const fs = require('fs');

// this project's disk storage was manually bumped to 1GB to accomodate large sitemaps
// all large assets need to live in .data
app.use(express.static('.data'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get('/:index', async function(req, res) {
  const sitemaps = await fs.readdir(`.data/${index}`);
})

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});