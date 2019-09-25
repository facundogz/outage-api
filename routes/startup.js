const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.body);
  axios.post(`https://api.telegram.org/bot${process.env.id}:${process.env.token}/sendMessage`,
      {
        chat_id: process.env.user,
        text: `[Corte] Volvió la luz!!`
      });
  res.send({status: 200})
});

module.exports = router;
