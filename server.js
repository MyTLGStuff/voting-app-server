const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const {
    ServerApiVersion
} = require('mongodb');
const {
    Server
} = require("socket.io");
require('dotenv').config();


const passport = require('./passport/setup');
const auth = require('./routes/auth');


const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cors());
app.use(session({
    secret:process.env.SESSION_SECRET,
    cookie:{maxAge:60000},
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({mongoUrl:process.env.MONGO_URI})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use('/api/auth', auth)

const server = require('http').createServer(app);
const io = new Server(server);

mongoose
.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
})
.then(console.log('MongoDB is connected...'))
.catch(err => console.error(err))

app.get("/", (req, res) => res.send("Hello World"));

server.listen(process.env.PORT||3001, () => {
    console.log('Sockets.io is connected...\nServer is up!')
});