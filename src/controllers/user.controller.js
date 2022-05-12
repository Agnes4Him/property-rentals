const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const dotenv = require('dotenv')

dotenv.config()

exports.signup = (req, res) => {
    //console.log(req.body)
    const {email, first_name, last_name, password, phone, address, is_admin} = req.body;
    if (!email || !first_name || !last_name || !password || !phone || !address || !is_admin) {
        res.status(400).send({"Message":"Please fill all fields"})
    }else {
        const user = new User(email, first_name, last_name, password, phone, address, is_admin)
        User.signupUser(user, (err, data) => {
            if (err && err.type == "email_taken") {
                res.status(400).send({"Message" : "That email has already been taken"})
            }else if (err && err.type == "no_signup") {
                res.status(500).send({"Message" : "Unable to sign you up. Try again later"})
            }else {
                jwt.sign({user:user}, process.env.JWT_KEY, (err, token) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send({"Message": "Server error! Please try again later"})
                    }
                    res.send({"status": "success", "data": {token:token, ...data}})    
                })
            }
        })
    }
}

exports.login = (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        res.status(400).send({"Message": "Enter all input fields"})
    }else{
        const user = new User(email, password)
        User.loginUser(user, (err, data) => {
            if (err && err.kind == "no_email") {
                res.status(500).send({"Message" : "That email does not exist"})
            }else if (err && err.kind == "incorrect_password") {
                res.status(500).send({"Message" : "That password is incorrect"})
            }else {

                jwt.sign({user:user}, process.env.JWT_KEY, (err, token) => {
                    if (err) {
                        res.status(500).send({"Message" : "Internal server error, please try again"})
                    }
                    res.send({"status": "success", "data": {token:token, ...data}}) 
                })
            }
        })   
    } 

}