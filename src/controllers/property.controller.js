const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const upload = require('../config/multer');
const cloudinary = require('../config/cloudinary');
const Property = require('../models/property.model');

dotenv.config();

//upload.single('image')
exports.addProperty = (req, res) => {
    if (!req.body) {
        res.status(400).send({"Message":"Fields cannot be empty"})
    }else {
        jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
            if (err) {
                res.status(403).send({"Message": "You need to sign in to create an ad"})
            }else {
                console.log(authData.user[0]['id'])
                const owner = authData.user[0]['id']
                const {status, price, state, city, address, type} = req.body;
                cloudinary.uploader.v2.upload(req.file.path, (err, result) => {
                    if (err) {
                        res.status(500).send({"Message":"Cannot upload image at the moment. Try again later"})
                    }else {
                        const image = result.url;
                        console.log(image)
                        const property = new Property(owner, status, price, state, city, address, type, image)
                        Property.createAd(property, (err, data) => {
                            if (err) {
                                if (err.type == "property_exist") {
                                    res.status(400).send({"Message":"That ad already exist"})
                                }else {
                                    res.status(500).send({"Message":err.message})
                                }
                            }else {
                                res.send({"status":"success", "data":data})
                            }
                        })
                    }
                })

            }
        })
    }
}