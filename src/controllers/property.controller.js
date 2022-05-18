const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const upload = require('../config/multer');
const cloudinary = require('../config/cloudinary');
const Property = require('../models/property.model');
const path = require('path');

dotenv.config();

//upload.single('image')
exports.addProperty = (req, res) => {
    if (!req.body) {
        res.status(400).send({"Message":"Fields cannot be empty"})
    }else {
        jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
            console.log(authData)
            if (err) {
                res.status(403).send({"Message": "You need to sign in to create an ad"})
            }else {
                console.log(authData.user['id'])
                const owner = authData.user['id']
                const {status, price, state, city, address, type} = req.body;
                cloudinary.uploader.upload(req.file.path, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send({"Message":"Cannot upload image at the moment. Try again later"})
                    }else {
                        //console.log(result)
                        const image = result.secure_url;
                        //console.log(image)
                        const image_id = result.public_id
                        const property = new Property(owner, status, price, state, city, address, type, image, image_id)
                        Property.createAd(property, (err, data) => {
                            if (err) {
                                if (err.type == "property_exist") {
                                    cloudinary.uploader.destroy(image_id, (error, result) => {
                                        if (error) {
                                            res.status(500).send({"Message" : "An error has occured, please try again!"})
                                        }
                                        res.status(400).send({"Message":"That ad already exist"})
                                    });
                                    
                                }else {
                                    res.status(500).send({"Message": err.message})
                                }
                            }else {
                                res.send({"status":"success", "data": data})
                            }
                        })
                    }
                })

            }
        })
    }
}

exports.updateSold = (req, res) => {
    const id = req.params.id;
    const status = req.query.status;  
    if (!status) {
        res.status(400).send({"Message" : "Please include the status of your ad"})
    }else {
        jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
            if (err) {
                console.log(err)
                req.status(400).send({"Message":"Please login to update your ad"})
            }else {
                const owner = authData.user['id']
                Property.markSold(owner, id, status, (err, data) => {
                    if (err) {
                        if (err.type == "no_property") {
                            res.status(400).send({"Message" : "That property does not exist!"})
                        }else {
                            res.status(500).send({"Message" : err.message})
                        }
                    }else {
                            res.send({"status" : "success", "message" : "Property successfully marked as sold"})
                    }
                })
            }
        })     
    }
}

exports.deleteProperty = (req, res) => { 
    const image_id = req.params.image_id
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if (err) {
            console.log(err)
            req.status(400).send({"Message":"Please login to delete ad"})
        }else {
            const owner = authData.user['id']
            Property.deleteProp(owner, image_id, (err, data) => {
                if (err) {
                    if (err.type == "no_prop") {
                        res.status(400).send({"Message" : "That property does not exist!"})
                    }else {
                        res.status(500).send({"Message" : err.message})
                    }
                }else {
                    cloudinary.uploader.destroy(image_id, (error, result) => {
                        if (error) {
                            console.log(error)
                            res.status(500).send({"Message" : "An error has occurred. Please try again"})
                        }
                        res.send({"status" : "success", "message" : "Ad successfully deleted"})
                    })
                    
                }
            })
        }
    })      
}

exports.viewAll = (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if (err) {
            console.log(err)
            req.status(400).send({"Message":"Please login to view ads"})
        }else {
            const owner = authData.user['id']
            Property.viewAllProps((err, data) => {
                if (err) {
                    res.status(500).send({"Message" : "An error occurred. Try again later"})
                }
                    res.send({"status" : "success", "data" : data})
            })
        }
    })         
}

exports.viewOne = (req, res) => {
    const id = req.params.id
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if (err) {
            console.log(err)
            req.status(400).send({"Message":"Please login to view ad"})
        }else {
            const owner = authData.user['id']
            Property.viewOneProp(id, (err, data) => {
                if (err) {
                    res.status(500).send({"Message" : "An error occurred. Try again later"})
                }
                    res.send({"status" : "success", "data" : data})
            })
        }
    })         
}