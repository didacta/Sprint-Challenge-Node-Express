const express = require('express');
//const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const server = express();


const PORT = 3000;
const STATUS_ERROR = 422;
const STATUS_OK = 200;


//const currentPrice = fetch(CURRENT_PRICE_REQ)
//const yesterdayPrice = fetch(YESTERDAY_PRICE_REQ)
//server.use(bodyParser.json());

const CURRENT_PRICE_REQ = 'https://api.coindesk.com/v1/bpi/currentprice.json';
const YESTERDAY_PRICE_REQ = 'https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday';
server.get('/compare', (req, res) => {


  fetch(YESTERDAY_PRICE_REQ)
    .then(data => data.json())
  console.log(data.json())
    .then(data => {
      const yesterdayOriginal = data.bpi[Object.keys(data.bpi)[0]];
      const yesterday = yesterdayOriginal.toFixed(3);
      fetch(CURRENT_PRICE_REQ)
        .then(data => data.json())
      console.log(data.json())
        .then(data => {
          const today = data.bpi.USD.rate._float.toFixed(3);
          if (yesterday > today) {
            const difference = yesterday - today;
            const message = 'Compared to yesterday, Bitcoin is down $' + difference + ':(';
            res.status(STATUS_OK);
            res.send(message);
          } else if (yesterday < today) {
            difference = today - yesterday;
            const message = "Compared to yesterday, Bitcoin is up $" + difference + ':)';
            res.status(STATUS_OK);
            res.send(message);
          }
        })
        .catch(err => {
          res.status(STATUS_ERROR);
          res.send({ err: err });
        })
    })
});

server.listen(PORT, (err) => {
  if (err) {
    console.log(`There was an error starting the server: ${err}`);
  } else {
    console.log(`The Server is listening on port ${PORT}`);
  }
})