const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require('nodemailer');
const { Objects } = require("./Objects");
require('dotenv').config()

let secrete = process.env.K

app.use(cors({
    origin: '*',
}))

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true, parameterLimit: 500000 }))

let destroy = (req, res, isText, status) => {
    try {
        if (isText) {
            res.status(status).send(isText);
        } else {
            req.destroy();
            res.destroy();
        }
    } catch {
        destroy(req, res)
    }
};

let getPKey = (req, res, isK, isN) => {
    try {
        let rf = req.headers['referer'];
        if (rf) {
            if (!rf.includes('https://silviu.vercel.app')) {
                let ru = req.headers['user-agent'].split(/\s+/).join('')

                let au = JSON.parse(Objects.encDec(req.headers['a'], isN ? Objects.Keys(req.headers['isauth'] === 'true' ? true : null)[req.headers['k']] : isK ? secrete : ru, true))
                if (au) {
                    let date = new Date()
                    if (date <= new Date(au.t)) {
                        if (isK) {
                            let v = Objects.Keys(req.headers['isauth'] === 'true' ? true : null)
                            res.setHeader(`Content-Type`, `audio/wav`)
                            res.status(200).send({ v: Objects.encDec(JSON.stringify(v), `${secrete}+${ru}+${req.params[0].split(/k/)[1].split('/')[1]}`) })
                        } else if (isN) {
                            destroy(req, res, { success: true }, 200)
                        } else {
                            let v = { v: secrete }
                            res.setHeader(`Content-Type`, `audio/wav`)
                            res.status(200).send({ v: Objects.encDec(JSON.stringify(v), `${ru}+${req.params[0].split(/v/)[1].split('/')[1]}+${req.headers['accept-language']}`), language: req.headers['accept-language'], ip: req.headers['x-forwarded-for'] })
                        }
                    } else {
                        destroy(req, res)
                    }
                } else {
                    destroy(req, res)
                }
            } else {
                destroy(req, res)
            }
        } else {
            destroy(req, res)
        }
    } catch (e) {
        destroy(req, res)
    }
}

app.use(`*`, (req, res) => {
    try {
        let u = req.originalUrl
        if (u) {
            if (u.includes('/v/')) {
                getPKey(req, res)
            } else if (u.includes('/v2')) {
                getPKey(req, res, null, true)
            } else if (u.includes('/decrypt')) {
                let dcb = JSON.parse(Objects.encDec(req.body.data, Objects.Keys(req.headers['isauth'] === 'true' ? true : null)[req.body.k], true))
                if (dcb) {
                    destroy(req, res, dcb, 200)
                } else {
                    destroy(req, res)
                }
            } else {
                getPKey(req, res, true)
            }
        } else {
            destroy(req, res)
        }
    } catch {
        destroy(req, res)
    }
})


const io = new Server(server, {
    cors: {
        origin: '*'
    }
});

io.on('connection', (socket) => {
    socket.on('join', (data) => {
        socket.join(data.room)
            // 
    })
    socket.on('reset_states', () => {
        io.emit('reset', true)
    })
    socket.on('chat', data => {
        socket.to(data.to).emit('chat_data', data);
        io.to(data.to).emit('chat_data', data);
    })
})


server.listen(3001, () => {
    console.log('Started.')
})