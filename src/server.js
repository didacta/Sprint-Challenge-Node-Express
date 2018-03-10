const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const server = express();

const PORT = 3000;
const STATUS_ERROR = 422;
const STATUS_OK = 200;

const CURRENT_PRICE_REQ = 'https://api.coindesk.com/v1/bpi/currentprice.json';
const YESTERDAY_PRICE_REQ = 'https://api.coindesk.com/v1/bpi/historical/close.json?for=yesterday';

server.get('/compare', (req, res) => {
  fetch(YESTERDAY_PRICE_REQ)
    .then(res => res.json())
    .then(compare => {
      const yesterdayOriginal = compare.bpi[Object.keys(compare.bpi)[0]];
      const yesterday = yesterdayOriginal.toFixed(2);
      fetch(CURRENT_PRICE_REQ)
        .then(res => res.json())
        .then(data => {
          const today = data.bpi.USD.rate_float.toFixed(2);
          console.log(today);
          if (yesterday > today) {
            const difference = yesterday - today;
            const message = `Compared to yesterday, Bitcoin is down $${difference} :(`;
            res.status(STATUS_OK);
            res.send(message);
          } else if (yesterday < today) {
            difference = today - yesterday;
            const message = `Compared to yesterday, Bitcoin is up $${difference} :)`;
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


/* 
server.get('/compare', (req, res) => {
  const promiseArr = [new Promise(resolve, reject), new Promise(resolve, reject)];

  //const currentPrice =
    fetch(CURRENT_PRICE_REQ).next((data)) => {
      //.then(res => res.json())
      const currentPrice = today.bpi.USD.rate_float);
      .catch(err => res.status(STATUS_ERROR).json({ err: err }));
  promiseArr[0].resolve;
})
const yesterdayPrice =
  fetch(YESTERDAY_PRICE_REQ)
    .then(res => res.json())
    .then(yesterday => Object.values(yesterday.bpi)[0]);
promiseArr[1].resolve;
})
      .catch((err) => {
  res.status(STATUS_ERROR);
    .res.send('Error fetching prices');
});
Promise.all([currentPrice, yesterdayPrice]) 
 
.next(()) => {
    res.status(STATUS_OK);
    res.json({difference : currentPrice - yesterdayPrice});
    
  })
  .catch((err) => {
  res.status(STATUS_ERROR);
  res.send('Error fetching prices');
  });
}); */

server.listen(PORT, (err) => {
  if (err) {
    console.log(`There was an error starting the server: ${err}`);
  } else {
    console.log(`The Server is listening on port ${PORT}`);
  }
})