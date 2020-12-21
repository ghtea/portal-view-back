import dotenv from 'dotenv'
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import cookieParser from 'cookie-parser';


//const { jwtMiddleware } = require('./works/auth/token');

//const Comp = require('./models/Comp');

//const { generateToken, checkToken } = require('./works/auth/token');

dotenv.config({ 
  path: './.env' 
});

const app = express();

const listAllowedOrigin = [process.env.URL_FRONT, process.env.URL_FRONT_TESTING]

const checkOrigin = (origin, callback) => {
  // allow requests with no origin 
  // (like mobile apps or curl requests)
  if(!origin) return callback(null, true);
  if(listAllowedOrigin.indexOf(origin) === -1){
    var msg = 'The CORS policy for this site does not ' +
              'allow access from the specified Origin.';
    return callback(new Error(msg), false);
  }
  return callback(null, true);
}
  
app.use(cors({
  origin: checkOrigin,    // or true
  credentials: true,
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false
}));


/*
app.use( function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "https://pv.nextwing.me");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");   
  res.header('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});
*/

/*
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
*/

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cookieParser());

//app.use('/test', require('./routes/test'));

app.use('/auth', require('./routes/auth'));
app.use('/portal', require('./routes/portal'));


mongoose
.connect(process.env.URL_DB, {
useUnifiedTopology: true,
useNewUrlParser: true,
useFindAndModify: false
})
.then(() => console.log('DB Connected!'))
.catch(err => {
console.log(`DB Connection Error: ${err.message}`);
});



const port = parseInt(process.env.PORT);
app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

