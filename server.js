/**
 * Module dependencies.
 */

const express = require('express'),
    startup = require('./routes/startup'),
    botRouter = require('./routes/index'),
    http = require('http'),
    path = require('path'),
    axios = require('axios'),
    bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.set('port', process.env.PORT || 3000);


app.get('/', (req, res) => {
    res.send({message: 'OK'})
});

app.use(`/${process.env.token || 'bot'}`, botRouter);
app.use(`/startup`, startup);


http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

let connectionFailed = 0;
let ack = false;


setInterval(() => {
        axios.get(`http://${process.env.uri}:30000/`).then(value => {
            console.log(`Got response`);

            if (connectionFailed && ack) {
                console.log(`Home is up!`);

                ack = false;
                connectionFailed = 0;
                axios.post(`https://api.telegram.org/bot${process.env.id}:${process.env.token}/sendMessage`,
                    {
                        chat_id: process.env.user,
                        text: `Parecería que volvió la luz en casa.`
                    });
                axios.post(`https://api.telegram.org/bot${process.env.id}:${process.env.token}/sendMessage`,
                    {
                        chat_id: process.env.user,
                        text: `Si no recibís otro mensaje dentro de poco, se trató de un corte de internet.`
                    });
            }
        }).catch(err => {
            console.log(`Miss!`);

            if (++connectionFailed > 5 && !ack) {
                console.log(`Home is definitely down!`);

                ack = true;
                axios.post(`https://api.telegram.org/bot${process.env.id}:${process.env.token}/sendMessage`,
                    {
                        chat_id: process.env.user,
                        text: `Atención! Parecería que se cortó la luz en casa`
                    });
            }
        })
}, 10000);


