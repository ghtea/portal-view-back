const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const schemaItem = new Schema({
  
  _id: String,
  
  author: String,
  
  
  link: String,   // url of img, gif, video
  text: String,

  tags: [String],  // (whatever) character, cute
  
  created: Date,
  updated: Date
  
}, { collection: 'Item_', versionKey: false, strict: false});



module.exports = mongoose.model('Item', schemaItem);