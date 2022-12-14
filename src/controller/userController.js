const userModel = require('../models/userModel.js');
const Validator = require('../Validator/validation.js');
const jwt = require('jsonwebtoken');

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>registerUser-Details>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//

const userRegister = async function (req, res) {
    try {
        let userDetail = req.body;
        if (!Validator.isValidRequest(userDetail)) {
            return res.status(400).send({ status: false, message: "userDetail is required"});
        }

        const { firstName,lastName, email, password,phone } = userDetail;

        if (!Validator.checkString(firstName)) {
            return res.status(400).send({ status: false, message: "firstName is required" });
        }

        if (!Validator.validateName(firstName)) {
            return res.status(400).send({ status: false, message: "Invalid firstName" });
        }
        
        if (!Validator.checkString(lastName)) {
            return res.status(400).send({ status: false, message: "lastName is required" });
        }

        if (!Validator.validateName(lastName)) {
            return res.status(400).send({ status: false, message: "Invalid lastName" });
        }

        if (!Validator.checkString(email)) {
            return res.status(400).send({ status: false, message: "email is required" });
        }
        if (!Validator.validEmail(email)) {
            return res.status(400).send({ status: false, message: "Invalid emailId" });
        }

        //--------------------------------------email should be unique---------------------------------------//

        let uniqueEmail = await userModel.findOne({ email: email });

        if (uniqueEmail) {
            return res.status(409).send({ status: false, message: "Provided Email already exist" })
        }
        if (!Validator.checkString(password)) {
            return res.status(400).send({ status: false, message: "password is required" });
        }

        if (!Validator.isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "password should be in right format" });
        }

        if(!Validator.checkString(phone)){
            return res.status(400).send({status:false,message:"phone number is required"});
        }

        if(!Validator.isValidPhone(phone)){
            return res.status(400).send({status:false,message:"only Indian Number allowed"});
        }

        let uniquePhone = await userModel.findOne({phone: phone });

        if (uniquePhone) {
            return res.status(409).send({ status: false, message: "Provided phoneNo already exist" })
        }

        const newUser = await userModel.create(userDetail);

        return res.status(201).send({ status: true, message: "User detail created successfully", Data: newUser });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Login-User>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>//
const login = async function (req, res) {
    try {
        const data = req.body;

        if (!Validator.isValidRequest(data)) { 
            return res.status(400).send({ status: false, message: "data is required" }); }

        const{email,password}=data;

        if (!Validator.checkString(email)) {
             return res.status(400).send({ status: false, message: "Email is required" }) }
        if (!Validator.validEmail(email)) { 
            return res.status(400).send({ status: false, message: "Invalid email address" }) }

        if (!Validator.checkString(password)) {
             return res.status(400).send({ status: false, message: "Password is required" }) }
        if (!Validator.isValidPassword(password)) { 
            return res.status(400).send({ status: false, message: "Password should be in right format" }) }

        const user = await userModel.findOne({ email: email});
        if (!user) { return res.status(401).send({ status: false, message: "No user found" }) }

        //......................creating a jsonWebToken and sending it to responce header and body.....................//

        let token = jwt.sign({
            userId: user._id.toString(),
            iat: Math.floor(Date.now() / 1000)
        },
            "backenedTask", { expiresIn: "1hr" }
        );

        res.header("x-api-key", token);
        return res.status(200).send({ status: true, message: "User Login Successfully", data: token })
    }
    catch (error) {
        return res.status(500).send({status : false, message: error.message })
    }
}

//..................................................................................................................//
module.exports = {userRegister,login}