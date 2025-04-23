const Joi = require('joi');

// validating data using Joi
const DocumentSchema = Joi.object({
    name : Joi.string().required(),
    idNumber  : Joi.string().required(),
    dob : Joi.string().required(),
    gender : Joi.string().required(),
    fathername : Joi.string().required(),
    idType : Joi.string().valid("AadharCard", "PanCard", "VoterId").required(),
}).required();

module.exports = DocumentSchema;