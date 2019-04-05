// init project
const express = require('express');
const app = express();

app.get('/', function(req, res) {
  res.send('hi');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});