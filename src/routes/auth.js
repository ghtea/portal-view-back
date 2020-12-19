import express from 'express';
//import Joi from 'joi';
import crypto from 'crypto';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import querystring from 'querystring';
import User from '../models/User';

import { generateToken, jwtMiddleware } from '../works/auth/token';

var router = express.Router();

// 의존한 강의 https://backend-intro.vlpt.us/5/01.html

router.use(jwtMiddleware);


const hash = (password) => {
  return crypto.createHmac('sha256', process.env.SECRET_KEY).update(password).digest('hex');
}


// https://devlog-h.tistory.com/13  koa vs express
router.post('/sign-up', async (req, res, next) => {
  
  try {
    
    // req = { ..., body ={ email, _id, password}}

    // email 중복 체크
    let existingEmail = null;
    try {
      existingEmail = await User.findOne({email: req.body.email}).exec(); 
    } catch (error) {
      console.log(error);
      res.status(500).json({
        codeSituation: "SignUp_UnknownError",
      }); // 여기선 내가 잘 모르는 에러라 뭘 할수가...   나중에 알수없는 에러라고 표시하자...
      return;
    }

    if(existingEmail) {
    // 중복되는 이메일이 있을 경우
      console.log("duplicate email") 
      res.status(409).json({
        codeSituation: "SignUp_DuplicateEmail",
      }); 
      // return;
      // https://backend-intro.vlpt.us/3/04.html
      // https://velog.io/@kim-macbook/Cannot-set-headers-after-they-are-sent-to-the-client
    }

    
    // 계정 생성
    let mongoUser = null;
    try {
      mongoUser = await User.register(req.body);   
    } catch (error) {
      console.log(error);
      res.status(500).json({
        codeSituation: "SignUp_UnknownError",
      }); // 여기선 내가 잘 모르는 에러라 뭘 할수가...   나중에 알수없는 에러라고 표시하자...
      // return;
    }


    let token = null;
    try {
      token = await mongoUser.generateToken(); 
    } catch (error) {
      console.log(error);
      res.status(500).json({
        codeSituation: "SignUp_UnknownError",
      }); // 여기선 내가 잘 모르는 에러라 뭘 할수가...   나중에 알수없는 에러라고 표시하자...
      // return;
    }
    
    
    // 여기까지 에러가 없었으면 성공적으로 아래와 같이 실행!
    
    res.cookie('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7}); // cookie 에 토큰 보내주기  // 참고로 아마 브라우져에서 확인할 수 없으니 노력 no
    
    res.status(200).json({
      codeSituation: "SignUp_Succeeded",
      payload: {
        _id: mongoUser._id
        , email: mongoUser.email
      }
    });
      
  } catch(error) { next(error) }
  
});






router.post('/log-in', async (req, res, next) => {
  
  try {
    
    const { email, password } = req.body; 
    console.log('hi');
    
    let foundUser = null;
    try {
      // 이메일로 계정 찾기
      foundUser = await User.findOne({ email: email }).exec();
    } catch (error) {
      console.log(error);
      res.status(500).json({
        codeSituation: "LogIn_UnknownError",
      }); // 여기선 내가 잘 모르는 에러라 뭘 할수가...   나중에 알수없는 에러라고 표시하자...
      // return;
    }
    
    if(!foundUser) {
    
      res.status(404).json({
        codeSituation: "LogIn_NotExsitingEmail",
      }); 
      // return;
    }
      
    else {  // email exists
    
      if(!foundUser.validatePassword(password)) {
        res.status(404).json({
          codeSituation: "LogIn_WrongPassword",
        }); 
        
      }
      
      else { // pawword correct
        
        let token = null;
        try {
          token = await foundUser.generateToken();
          
          console.log("following is generated token")
          console.log(token);
          
        } catch (error) {
          
          console.log(error);
          res.status(500).json({
            codeSituation: "LogIn_UnknownError",
          }); // 여기선 내가 잘 모르는 에러라 뭘 할수가...   나중에 알수없는 에러라고 표시하자...
          // return;
        }
        
        // 접속 기록 수정
        //console.log('found id');
        //console.log(foundUser._id)
        const filterAccessed = {_id: foundUser._id};
        const updateAccessed = {accessed: Date.now() };
        
        await User.updateOne(filterAccessed, updateAccessed);
        console.log("successfully updated user's accessed");
        
        
        
        // 프론트에 데이터 주기
        // 평범하게 assign 할때는 foundUser.키명 으로 되지만 아래처럼 이용할때는 _doc 써야하는 듯...
        let resUser = Object.assign({}, foundUser._doc);
        delete resUser.passwordHashed;   // 비번 정보는 제외하고 제공
        
        res.cookie('access_token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 }); 
        // cookie 브라우저가 설정하려면 별도의 추가 설정 필요
        // https://www.zerocho.com/category/NodeJS/post/5e9bf5b18dcb9c001f36b275
        
        // console.log(res);
        res.json({
          codeSituation: "LogIn_Succeeded",
          payload: {
            _id: foundUser._id,
            kind: foundUser.kind,
            
            email: foundUser.email,
            
            joined: foundUser.joined,
            accessed: foundUser.accessed
          }
        });
        //console.log(res)
        
        
      }  // pawword correct 
      
    }  // email exists
    
    
  } catch(error) { next(error) }
  
});




router.post('/log-out', async (req, res, next) => {
  
  try {
    
    res.cookie('access_token', null, {
        maxAge: 0, 
        httpOnly: true
    });
    
    res.status(204).json({
      codeSituation: "LogOut_Succeeded",
    });
    
  } catch(error) { next(error) }
  
});


// 
router.get('/log-check', async (req, res, next) => {
  
  // 여기서 jwt 미들웨어가 중간에 일해주고, req에 tokenUser 을 끼워준다
  // tokenUser 란 token 으로 부터 알게된 유저 정보
  
  try {
    
    console.log(req);
    //console.log("hello, I'm check")
    //console.log(req);
    
    const { tokenUser } = req;
    
    
    if(!tokenUser) {
      console.log("there is no tUser")
    
      res.status(403).json({
        codeSituation: "LogCheck_NoValidToken"
      });
    }
    
    else {
      let foundUser = null;
      try {
        // 이메일로 계정 찾기
        foundUser = await User.findOne({ email: tokenUser.email }).exec();
      } catch (error) {
        console.log(error);
        res.status(500).json({
          codeSituation: "LogCheck_UnknownError"
        }); 
      }
      
      if(!foundUser) {
      // 해당 유저가 존재하지 않으면
        res.status(404).json({
          codeSituation: "LogCheck_NotExsitingEmail"
        }); 
      }
      
      // 평범하게 assign 할때는 foundUser.키명 으로 되지만 아래처럼 이용할때는 _doc 써야하는 듯...
      let resUser = Object.assign({}, foundUser._doc);
      delete resUser.passwordHashed;
      
      //res.json(resUser); // 유저 정보로 응답합니다.
      res.json({
        codeSituation: "LogCheck_Succeeded",
        payload: {
          _id: resUser._id,
          kind: resUser.kind,
          
          email: resUser.email
        }
      });
      
    }
    
  } catch(error) { next(error) }
  
});









router.put('/change-password', async (req, res, next) => {
  
  try {
    
    const { _id, passwordCurrent, passwordNew } = req.body; 
    
    
    let foundUser = null;
    try {
      // id로 계정 찾기
      foundUser = await User.findOne({ _id: _id }).exec();
    } catch (error) {
      console.log(error);
      //res.status(500).send(error); // 여기선 내가 잘 모르는 에러라 뭘 할수가...   나중에 알수없는 에러라고 표시하자...
      res.status(500).json({
        codeSituation: "ChangePassword_UnknownError"
      }); // 여기선 내가 잘 모르는 에러라 뭘 할수가...   나중에 알수없는 에러라고 표시하자...
    }
    
    if(!foundUser) {
  
      res.status(404).json({
        codeSituation: "ChangePassword_NotExsitingId"
      }); 
      //res.status(403).send("no user by this id")
      return;
    }
    
    else if(!foundUser.validatePassword(passwordCurrent)) {
      res.status(404).json({
        codeSituation: "ChangePassword_WrongPassword"
      }); 
    }
    
    else { // 유저를 찾았고, 비번도 맞을 때
      
      const filter = {_id: _id};
      const update = {passwordHashed: hash(passwordNew)};
      
      try {
        await User.updateOne(filter, update);
        console.log("successfully changed user's password");
        
        // 아래와 같이해도 로그아웃이 안되네..
        res.cookie('access_token', null, {
          maxAge: 0, 
          httpOnly: true
        });
        
        res.status(404).json({
          codeSituation: "ChangePassword_Succeeded"
        }); 
        
      } 
      catch (error) {
        console.log(error);
        res.status(500).json({
          codeSituation: "ChangePassword_UnknownError"
        }); // 여기선 내가 잘 모르는 에러라 뭘 할수가...   나중에 알수없는 에러라고 표시하자...
      }
      
    }
      
    
  } catch(error) { next(error) }
  
});




module.exports = router;









