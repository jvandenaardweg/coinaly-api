

var request = require('request');
request('http://localhost:5000/symbols/fetch', function (error, response, body) {
  if (error) console.log('Scheduled task: Fetching new symbols failed.',)
  if (!error && response.statusCode === 200 && Object.keys(JSON.parse(body)).length) {
    console.log('Scheduled task: Fetching new symbols success!',  `Got ${Object.keys(JSON.parse(body)).length} symbols.`)
  } else {
    console.log('Scheduled task: Got no valid data.')
  }
});
