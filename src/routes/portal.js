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
  
  
  } catch (error){
    console.log(error);
    res.status(500).json({
      codeSituation: "GetListPortal_UnknownError"
    }); 
  }
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
router.put('/update', async(req, res, next) => {

  try {

    const _id = req.body.idPortal;

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
  try {
    
    const _id = req.body.idPortal;
    
    console.log('visiting catched');
    
    
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
      const objPortal = Object.assign({}, foundPortal._doc);
      
      console.log('objPortal');
      console.log(objPortal);
      const date = Date.now();
      const dateLast = objPortal.dateVisitedLast || objPortal.created;
      const timeBetween = date - dateLast;
      console.log(timeBetween);
      
      
      let listBooleanVisited = objPortal.listBooleanVisited;
      let listToAdd = [];
      
      const hoursBetween = timeBetween / (1000 * 60 * 60 );
      console.log(hoursBetween);
      if (hoursBetween > 23) {
        listToAdd.push(true);
        
        let hoursBetweenRemaining = hoursBetween - 24;
        
        for (var i = 0; i < objPortal.lifespan; i++ ) {
          if (hoursBetweenRemaining > 23){
            //console.log('one loop')
            
            //console.log(hoursBetweenRemaining)
            hoursBetweenRemaining -= 24;
            //console.log(hoursBetweenRemaining)
            
            listToAdd.push(false);
          }
        }
        
        listBooleanVisited = listToAdd.concat(listBooleanVisited);
        
        for (var i = 0; i < objPortal.lifespan; i++ ) {
          if (listBooleanVisited.length > objPortal.lifespan){
            listBooleanVisited.pop();
          }
        }
      
        
      } 
      
  
      let update = {
  
        listBooleanVisited: listBooleanVisited,
        dateVisitedLast: date
      };
  
      console.log('visited this portal well');
      
      await Portal.updateOne(filter, update);
      
      res.json({
        codeSituation: "VisitPortal_Succeeded"
      });
    
    }
  
  } catch(error) {
    console.log(error);
    //res.status(500).send(error); // 여기선 내가 잘 모르는 에러라 뭘 할수가...   나중에 알수없는 에러라고 표시하자...
    res.status(500).json({
      codeSituation: "VisitPortal_UnknownError"
    }); // 여기선 내가 잘 모르는 에러라 뭘 할수가...   나중에 알수없는 에러라고 표시하자...
  }
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