//VALIDATION
const Joi = require('joi');

//Register Validation
const RegisterValidation = data => {
    const schema = Joi.object(
    {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    //Validation
    return schema.validate(data);
    
}

//loginValid
const LoginValidation = data => {
    const schema = Joi.object(
    {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    //Validation
    return schema.validate(data);
    
}

module.exports.RegisterValidation = RegisterValidation;
module.exports.LoginValidation = LoginValidation;