const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const databaseUrl = 'mongodb://solovyoff:nikit1@ds143666.mlab.com:43666/heroku_xs6fxc9k';
const path = require('path');
//const PORT = process.env.PORT;
const PORT = 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(function(req,res,next){
  req.io = io;
  next();
});
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const messagesRouter = require("./routes/messages");
app.use('/messages',messagesRouter);

const apiRouter = require("./routes/api");
app.use('/api',apiRouter);

const developerRouter = require("./routes/developer");
app.use('/developer',developerRouter);

app.use('/', express.Router().get('/', function(req, res) {
  res.render('index');
}));

io.on('connection', () =>{
  console.log('new user connected')
});

mongoose.connect(databaseUrl, {useNewUrlParser: true})
    .then(() => console.log(`Database connected: ${databaseUrl}`))
    .then(() => http.listen(PORT,() => console.log(`Server started: ${PORT}`)))
    .catch(err => console.log(`Start error: ${err}`));
