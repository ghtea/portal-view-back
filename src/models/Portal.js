const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const schemaPortal = new Schema({    //   동일한 링크라도 사용 유저에 따라 다큐먼트 따로 생성
  
  _id: String,
  user: String,   // 이 링크 이용 하는 유저 

  kind: String,   //  basic, search, both
  
  name: String,
  initials: String,  // up to 3 letters
  url: String,  
  
  // note: String,
  
  // 0 점 되면 죽는다.
  lifespan: Number,   //  1~30days   
  listBooleanVisited: [Boolean],  //  [true, false, ...(30days)]    (30 + 1) * 30 / 2 =  465
  dateVisitedLast: Date,  
  
  tags: [String],  // (whatever) character, cute
  hue: String,   // hue:0, 10, 20, ... 350
  
  created: Date,
  updated: Date
  
}, { collection: 'Portal_', versionKey: false, strict: false});



module.exports = mongoose.model('Portal', schemaPortal);