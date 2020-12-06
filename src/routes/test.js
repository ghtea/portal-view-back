import express from 'express';

//import queryString from 'query-string';

//import Item from '../models/Item';

var router = express.Router();



router.get('/', (req, res) => {


  console.log('hi')
  
  res.send('hihihi')

});



module.exports = router;