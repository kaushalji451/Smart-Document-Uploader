const mongoose  = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
    name :{
        type : String,
        required : true
    },
    idNumber : {
        type : String,
        required : true
    },
    dob : {
        type : Date,
        required : true
    },
    gender : {
        type : String,
        required : true
    },
    fathername : {
        type : String,
        required : true
    },
    idType : {
        type : String,
        required : true
    },
}
, {
    timestamps: true,
});

module.exports = mongoose.model('Document', DocumentSchema);