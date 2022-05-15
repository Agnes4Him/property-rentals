const jwt = require('jsonwebtoken');
const {User, UserUpdate} = require('../models/user.model');
const dotenv = require('dotenv');
const upload = require('../config/multer');
const cloudinary = require('../config/cloudinary');

dotenv.config()

exports.signup = (req, res) => {
    //console.log(req.body)
    if (!req.body) {
        res.status(400).send({"Message":"Please fill all fields"})
    }else {
        const {email, first_name, last_name, password, phone, address, is_admin} = req.body;
        const user = new User(email, first_name, last_name, password, phone, address, is_admin)
        User.signupUser(user, (err, data) => {
            if (err && err.type == "email_taken") {
                res.status(400).send({"Message" : "That email has already been taken"})
            }else if (err && err.type == "no_signup") {
                res.status(500).send({"Message" : "Unable to sign you up. Try again later"})
            }else {
                jwt.sign({user:data}, process.env.JWT_KEY, (err, token) => {
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
        User.loginUser(email, password, (err, data) => {
            if (err && err.kind == "no_email") {
                res.status(500).send({"Message" : "That email does not exist"})
            }else if (err && err.kind == "incorrect_password") {
                res.status(500).send({"Message" : "That password is incorrect"})
            }else {

                jwt.sign({user:data}, process.env.JWT_KEY, (err, token) => {
                    if (err) {
                        res.status(500).send({"Message" : "Internal server error, please try again"})
                    }
                    res.send({"status": "success", "data": {token:token, ...data}}) 
                })
            }
        })   
    } 

}

exports.resetPassword = (req, res) => {
    const {email, new_password} = req.body;
    if (!email || !new_password) {
        res.status(400).send({"Message":"Fields cannot be empty"})
    }else {
        jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
            if (err) {
                res.status(403).send({"Message": "Sign in to access resources"})
            }else {
                //console.log(authData.user[0]['email'])
                UserUpdate.updateUser(email, new_password, (err, data) => {
                    if (err) {
                        if (err.type == "no_user") {
                            res.status(400).send({"Message" : "User does not exist"})
                        }else {
                            res.status(400).send(err.message)
                        }
                    }else {
                        res.send({"status": "success", "data":authData})
                    }
                })
            }
        })
    }
    
}

exports.deleteuser = (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if (err) {
            res.status(403).send({"Message": "Sign in to access resources"})
        }else {
            const id = authData.user[0]['id']
            UserUpdate.deleteUser(id, (err, data) => {
                //console.log(id)
                if (err) {
                    res.status(500).send({"Message":"Unable to delete user. Try again later"})
                }
                res.send({"status":"success", "Message":"Deleted user with id " + id})
            })
        }       
    })  
}