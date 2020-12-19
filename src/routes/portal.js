import express from 'express';

//import queryString from 'query-string';

import Portal from '../models/Portal';

var router = express.Router();



// 
router.get('/:idPortal', async(req, res, next) => {

  try {

    const filter = {
      _id: req.params.idPortal
    };

  Portal.findOne(filter, (err, founPortal) => {
      if (err) return res.status(500).json({
        error: err
      });
      else if (!founPortal) {
        return res.status(404).json({
          error: 'Portal not found'
        });
      } else {
        res.json(founPortal);
      }
    });

  } catch (error) {
    next(error)
  }

});





router.get('/', (req, res) => {
  
  try {
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
    }];
  
  
    Portal.aggregate(pipeline, (error, listPortal) => {
      if (error) {
        console.log(error);
        res.status(500).json({
          codeSituation: "GetListPortal_UnknownError"
        }); 
      }
      else {
        res.json({
          codeSituation: "GetListPortal_Succeeded",
          payload: {
            listPortal: listPortal
          }
        });
      }
    })
  
  
  } catch (error) {
    console.log(error)
    next(error)
  }

});

  





router.post('/', async(req, res, next) => {

  try {

    const date = Date.now();

    const partionPortal = req.body;

    let mongoPortal = new Portal({
      
      ...partionPortal
      
      , created: date
      , updated: date
        
    });

    await mongoPortal.save();


    // res.send("new Portal has been created!");
    res.json({
      codeSituation: "CreatePortal_Succeeded"
    });
    
    
    
  } catch (error) {
    console.log(error);
    next(error)
  }

});








//UPDATE
router.put('/:idPortal', async(req, res, next) => {

  try {

    const filter = {
      _id: req.params.idPortal
    };

    const date = Date.now();
    


    const portalUpdate = req.body;



    let update = {

      ...portalUpdate
      
      , updated: date
    };


    await Portal.updateOne(filter, update);

    res.json({
      codeSituation: "UpdatePortal_Succeeded"
    });
    
  } catch (error) {
    next(error)
  }

});





//UPDATE
router.put('/visit', async(req, res, next) => {

  try {

    const _id = req.body.idPortal;
    
    
    
    let foundPortal = null;
    try {
      // id로 계정 찾기
      foundPortal = await Portal.findOne({ _id: _id }).exec();
    } catch (error) {
      console.log(error);
      //res.status(500).send(error); // 여기선 내가 잘 모르는 에러라 뭘 할수가...   나중에 알수없는 에러라고 표시하자...
      res.status(500).json({
        codeSituation: "VisitPortal_UnknownError"
      }); // 여기선 내가 잘 모르는 에러라 뭘 할수가...   나중에 알수없는 에러라고 표시하자...
    }
    
    if(!foundPortal) {
  
      res.status(404).json({
        codeSituation: "VisitPortal_NotExistingId"
      }); 
      //res.status(403).send("no user by this id")
      return;
    }

    else { 
      
      const filter = {
        _id: _id
      };
      
      const date = Date.now();
      
      let listBooleanVisited = foundPortal.listBooleanVisited;
  
  
      let update = {
  
        listBooleanVisited: listBooleanVisited
        , dateVisitedLast: date
      };
  
  
      await Portal.updateOne(filter, update);
  
      res.json({
        codeSituation: "VisitPortal_Succeeded"
      });
    
    
    
    
    
    
  } catch (error) {
    next(error)
  }

});


// DELETE
router.delete('/:idPortal', async(req, res, next) => {

  try {

    try {
      const filter = {
        _id: req.params.idPortal
      };
      await Portal.deleteOne(filter);


      res.send("The Portal has been deleted");

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