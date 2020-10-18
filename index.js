const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const session = require('express-session');
var express = require('express');
var bodyParser = require('body-parser');
//var fs = require('fs');
var cors = require('cors');
var path = require('path');
const httpRoutes = require('./routes/routes');
const cookieParser = require('cookie-parser');

//put pass into env file
dotenv.config();

const uri = process.env.MONGOOSE_LINK;

const app = express();
const PORT = 8000;
var dirName = __dirname;

module.exports = dirName;



app.use(cors());

app.use(cookieParser());

app.use(express.static(`${__dirname}/../client`));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
  extended: false
}));
app.set('json spaces', 1);
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true },(err) => {
  if(err)
  {
    console.log(err);
    return;
  }
  console.log("Connected to mongoose");
})

app.use('/', httpRoutes);


app.listen(PORT, () =>
  {
    console.log("Server up");
  })  





