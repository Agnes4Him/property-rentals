const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const upload = require('../config/multer');
const cloudinary = require('../config/cloudinary');
const Property = require('../models/property.model');
const path = require('path');

dotenv.config();

//Create property ad function
exports.addProperty = (req, res) => {
    if (!req.body) {
        res.status(400).send({"Message":"Fields cannot be empty"})
    }else {
        jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
            console.log(authData)
            if (err) {
                res.status(403).send({"Message": "You need to sign in to create an ad"})
            }else {
                //console.log(authData.user['id'])
                const owner = authData.user['id']
                const {status, price, state, city, address, type} = req.body;
                cloudinary.uploader.upload(req.file.path, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send({"Message":"Cannot upload image at the moment. Try again later"})
                    }else {
                        const image = result.secure_url;
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

//Mark property as being sold function
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

//Delete ad function
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

//View all function
exports.viewAll = (req, res) => {
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if (err) {
            console.log(err)
            req.status(400).send({"Message":"Please login to view ads"})
        }else {
            Property.viewAllProps((err, data) => {
                if (err) {
                    if (err.type == "no_ads") {
                        res.status(500).send({"Message" : "Sorry, no ads to display"})
                    }else {
                        res.status(500).send(err.message)
                    }
                }
                    res.send({"status" : "success", "data" : data})
            })
        }
    })         
}

//View one ad function
exports.viewOne = (req, res) => {
    const id = req.params.id
    jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
        if (err) {
            console.log(err)
            req.status(400).send({"Message":"Please login to view ad"})
        }else {
            Property.viewOneProp(id, (err, data) => {
                if (err) {
                    if (err.type == "no_ad") {
                        res.status(500).send({"Message" : "That ad no longer exist"})
                    }else {
                        res.status(500).send(err.message)
                    }
                }
                    res.send({"status" : "success", "data" : data})
            })
        }
    })         
}

//View ad based on type function
exports.viewType = (req, res) => {
    const type = req.query.type;
    if (!type) {
        res.status(400).send({"Message" : "Enter property type"})
    }else {
        jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
            if (err) {
                console.log(err)
                req.status(400).send({"Message":"Please login to view ads"})
            }else {
                Property.viewPropType(type, (err, data) => {
                    if (err) {
                        if (err.type == "no_type") {
                            res.status(500).send({"Message" : "No ads with that property type"})
                        }else {
                            res.status(500).send(err.message)
                        }
                    }
                        res.send({"status" : "success", "data" : data})
                })
            }
        })         
    }
}

//Update property function
exports.updateProperty = (req, res) => {
    const old_imageid = req.params.old_imageid
    if (!req.body) {
        res.status(400).send({"Message":"Fields cannot be empty"})
    }else {
        jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
            console.log(authData)
            if (err) {
                res.status(403).send({"Message": "You need to sign in to update your ad"})
            }else {
                cloudinary.uploader.destroy(old_imageid, (error, result) => {
                    if (error) {
                        res.status(500).send({"Message" : "An error has occured, please try again!"})
                    }
                });
                //console.log(authData.user['id'])
                const owner = authData.user['id']
                const {status, price, state, city, address, type} = req.body;
                cloudinary.uploader.upload(req.file.path, (err, result) => {
                    if (err) {
                        console.log(err)
                        res.status(500).send({"Message":"Cannot upload image at the moment. Try again later"})
                    }else {
                        const image = result.secure_url;
                        const image_id = result.public_id
                        const property = new Property(owner, status, price, state, city, address, type, image, image_id)
                        Property.updateAd(old_imageid, property, (err, data) => {
                            if (err) {
                                if (err.type == "no_ad") {
                                    res.status(400).send({"Message":"That ad does not exist"})                              
                                }else {
                                    res.status(500).send({"Message": err.message})
                                }
                            }else {
                                res.send({"status":"success", "Message":"Ad successfully updated"})
                            }
                        })
                    }
                })

            }
        })
    }
}