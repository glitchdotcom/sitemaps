// init project
const express = require('express');
const app = express();

app.use(express.static('sitemaps'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});