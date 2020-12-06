import express from 'express';

//import queryString from 'query-string';

import Item from '../models/Item';

var router = express.Router();



// 
router.get('/:idItem', async(req, res, next) => {

  try {

    const filter = {
      _id: req.params.idItem
    };

  Item.findOne(filter, (err, founItem) => {
      if (err) return res.status(500).json({
        error: err
      });
      else if (!founItem) {
        return res.status(404).json({
          error: 'Item not found'
        });
      } else {
        res.json(founItem);
      }
    });

  } catch (error) {
    next(error)
  }

});





router.get('/', (req, res) => {


  const query = req.query;


  const filterAuthor = (query.author) ? {
    author: query.author
  } : {};
  
  const filterSubject = (query.subject) ? {
    author: query.subject
  } : {};
  
  const filterSymbol = (query.symbol) ? {
    author: query.symbol
  } : {};


  const filter = {

    $and: [

      filterAuthor,
      filterSubject,
      filterSymbol
      
    ]

  };
  
  
  let pipeline = [{
    "$match": filter
  }]


  Item.aggregate(pipeline, (err, listItem) => {
    if (err) return res.status(500).send({
      error: 'database failure'
    });
    res.json(listItem);
  })

});





router.post('/', async(req, res, next) => {

  try {

    const date = Date.now();

    const colorAssignmentReq = req.body;

    let mongoItem = new Item({
      
      ...colorAssignmentReq
      
      , created: date
      , updated: date
        
    });

    await mongoItem.save();


    res.send("new Item has been created!");

  } catch (error) {
    next(error)
  }

});








//UPDATE
router.put('/:idItem', async(req, res, next) => {

  try {

    const filter = {
      _id: req.params.idItem
    };

    const date = Date.now();



    const colorAssignmentReq = req.body;



    let update = {

      ...colorAssignmentReq
      
      , updated: date
    };


    await Item.updateOne(filter, update);

    res.send("The Item has benn updated!");

  } catch (error) {
    next(error)
  }

});






// DELETE Comp
router.delete('/:idItem', async(req, res, next) => {

  try {

    try {
      const filter = {
        _id: req.params.idItem
      };
      await Item.deleteOne(filter);


      res.send("The Item has been deleted");

    } catch (error) {
      console.log(error);
      res.status(500).send(error); // 여기선 내가 잘 모르는 에러라 뭘 할수가...   나중에 알수없는 에러라고 표시하자...
      return;
    }

  } catch (error) {
    next(error)
  }

});


module.exports = router;