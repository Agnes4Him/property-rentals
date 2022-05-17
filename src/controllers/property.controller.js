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
                        console.log(result)
                        const image = result.secure_url;
                        //console.log(image)
                        const image_id = result.public_id
                        const property = new Property(owner, status, price, state, city, address, type, image, image_id)
                        Property.createAd(property, (err, data) => {
                            if (err) {
                                if (err.type == "property_exist") {
                                    cloudinary.uploader.destroy(image_id, (error, result) => {
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