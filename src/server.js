const express = require('express');
//const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const server = express();


const PORT = 3000;
const STATUS_ERROR = 422;
const STATUS_OK = 200;

let CURRENT_PRICE_REQ = 'https://api.coindesk.com/v1/bpi/currentprice/BTC.json';
let YESTERDAY_PRICE_REQ = 'http://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday';
const currentPrice = fetch(CURRENT_PRICE_REQ)
//const yesterdayPrice = fetch(YESTERDAY_PRICE_REQ)
//server.use(bodyParser.json());

server.get('/compare', (req, res) => {


  fetch(YESTERDAY_PRICE_REQ)
    .then(data => data.json())
    .then(data => {
      const yesterday = data.bpi[Object.keys(data.bpi)[0]];
      currentPrice
        .then(data => data.json())
        .then(data => {
          const today = Number(data.bpi.USD.rate)
            .then(data => data.json())
          if (yesterday > today) {
            const difference = yesterday - today;
            const message = 'Compared to yesterday, Bitcoin is down $' + difference + ':(';
            res.status(STATUS_OK);
            res.send(message);
          }else if (yesterday < today) {
            difference = today - yesterday;
            const message = "Compared to yesterday, Bitcoin is up $" + difference + ':)';
            res.status(STATUS_OK)
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