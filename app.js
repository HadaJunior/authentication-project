//jshint esversion:6
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

mongoose.connect('mongodb+srv://hadajunior5:W2Izcs89dsPIqwwq@mongodb-demo.xjcty6t.mongodb.net/userDB?retryWrites=true&w=majority')
.then(() => {
    console.log('DB connected');
})
.catch(error => {
    console.log(error.message);
});

//middlewares
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));


//creating the user schema
let userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

//create the user model
const User = mongoose.model('User', userSchema);

//routes
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async(req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    try {
        let result = await User.findOne({
            email: req.body.username
        });

        if(result.password === password){
            res.render('secrets');
        }else{
            res.send('Bad Credentials');
        }
    } catch (error) {
        res.send(error);
    }

});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async(req, res) => {
    let user = new User({
        email: req.body.username,
        password: req.body.password
    });

    try {
        let result = await user.save();

        if(result){
            res.render('secrets');
        }
    } catch (error) {
        res.send(error);
    }
})

app.listen(3000, () => {
    console.log('Server has started on port 3000');
})