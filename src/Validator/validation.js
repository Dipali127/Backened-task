const mongoose = require('mongoose');
//Globally used function
//checking that there is something as input
const isValidRequest = function (value) {
    return Object.keys(value).length > 0
}

// validating that the input must be a non-empty string
const checkString = function (value) {
    return (typeof (value) === 'string' && value.trim().length > 0)
}

//functions to validate fullname
const validateName = function (name) {
    return ((/^[a-z]+$/i.test(name)));
}

//function to validate user objectId
const validId = function (id) {
    return mongoose.isValidObjectId(id);
}

//function to validate email

const validEmail = function (email) {
    return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
}
//function to validate password

const isValidPassword = function (password) {
    return (/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password))
}

//function to validate phone No.(only indian number allowed)

const isValidPhone = function (phone) {
    return ((/^((\+91)?|91)?[6789][0-9]{9}$/g).test(phone));
}

//function to validate marks
const isValidMarks = function (marks) {
    return (marks>=0 && marks<=1000)
}


module.exports = { isValidRequest, validateName, checkString, validId, validEmail, isValidPassword, isValidPhone, isValidMarks }