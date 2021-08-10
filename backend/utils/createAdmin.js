const mongoose = require('mongoose'),
    Admin = require('../models/admin');

const connStr = 'mongodb://localhost:27017/users';
mongoose.connect(connStr,{
    useNewUrlParser: true, useUnifiedTopology: true
},function(err) {
    if (err) throw err;
    console.log('Successfully connected to MongoDB');
});

// create a user a new user
const createUser = (username, password) => {
    const main = new Admin ({
        username,
        password
    });
    return main.save(function(err) {
        return !err;
    });
}
 createUser('admin', '12345678');