const DocumentSchema = require('./Schema');

// middleware to validate upcoming request data 
const ValidDateDocument = async(req,res,next)=>{
    console.log("this is validation middleware",req.body);
    const {error} = DocumentSchema.validate(req.body);
    if(error){
        return res.status(400).json({error : error.details[0].message});
    }
    next();
}
module.exports = ValidDateDocument;

