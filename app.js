require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const md5 = require('md5');

const app = express();

mongoose.connect(`mongodb+srv://${process.env.USERNAME_CONNECT}:${process.env.PASSWORD_CONNECT}@mongodb-demo.xjcty6t.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
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
    let password = md5(req.body.password);

    try {
        let result = await User.findOne({
            email: username
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
        password: md5(req.body.password)
    });

    try {
        let result = await user.save();

        if(result){
            res.render('secrets');
        }
    } catch (error) {
        res.send(error);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server has started on port ${process.env.PORT}`);
});