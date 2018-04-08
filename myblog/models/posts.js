var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Post Schema
var PostSchema = mongoose.Schema({
    createdAt: {
      type: Date
    },
    updatedAt: {
      type: Date
    },
  	title: {
  	 	type: String, 
  	 	required: true 
  	},
  	url: {
  	 	type: String, 
  	 	required: true 
  	},
  	summary: {
  	 	type: String, 
  	 	required: true 
  	},
    author: {
    type: String,
    required: true
  }
});

var Post = module.exports = mongoose.model('Post', PostSchema);

PostSchema.pre('save', function(next){
  var now = new Date()
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  next();
});