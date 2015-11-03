var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/mydb');

// Define User schema
var _Links = new Schema({
    content : String
});
// export them
exports.Links = mongoose.model('Links',_Links);