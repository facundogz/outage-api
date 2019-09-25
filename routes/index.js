const express = require('express');
const router = express.Router();
const axios = require('axios');

/* GET home page. */
router.post('/', function (req, res, next) {
    try {
        switch (req.body.message.text) {
            case '/simulateOutage': {
                simulateOutage(req.body);
                break;
            }
            case '/vivis': {
                healthCheck(req.body);
                break;
            }
            default: {
                anything(req.body);
            }
        }
    } catch (err) {
        anything(req.body);
    }
    res.send({status: 200});

});


function healthCheck(params) {
    axios.get(`http://${process.env.uri}:30000`).then(value => {
        sendMsg('Todo normal :)',params)
    }).catch((err)=> sendMsg('No hay respuesta :(',params))
}

function simulateOutage(params) {
    axios.get(`http://${process.env.uri}:30000/simulate`).then(value => {
        sendMsg('Se simulará un corte de luz!',params);
    }).catch((err)=> sendMsg('No hay respuesta :(',params));
}

function anything(params) {
    console.log(params);
    sendMsg('Hola! ', params)
}

function sendMsg(body, params) {
    axios.post(`https://api.telegram.org/bot${process.env.id}:${process.env.token}/sendMessage`,
        {
            chat_id: (params.message || {chat: {id: null}}).chat.id,
            text: body
        });
}

module.exports = router;
