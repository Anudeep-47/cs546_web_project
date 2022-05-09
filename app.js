const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');

const configRoutes = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use('/public', express.static(__dirname + "/public"));


app.engine('hbs', exphbs.engine({
    extname: 'hbs',
    partialsDir: __dirname + '/views/partials/'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views/'))


app.use(session({
    name: 'AuthCookie',
    secret: 'This is very very secrett..',
    resave: false,
    saveUninitialized: true
}));


configRoutes(app);

app.listen(process.env.PORT || 5001, () => {
    console.log("Server is running on PORT 5001..");
});