const db = require('../config/db.config.js');

class Property {
    constructor(owner, status, price, state, city, address, type, image) {
        this.owner = owner
        this.status = status
        this.price = price
        this.state = state
        this.city = city
        this.address = address
        this.type = type
        this.image = image
    }

    static createAd(newProperty, result) {
        db.query('SELECT * FROM property WHERE owner=? AND image=?', [newProperty.owner, newProperty.image], (err, res) => {
            if (err) {
                console.log(err)
                result(err, null)
                return;
            }else if (res.length) {
                console.log("That property already exists")
                result({"type":"property_exist"}, null)
                return;
            }else {
                db.query('INSERT INTO property (owner, status, price, city, address, type, image, created_on) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [newProperty.owner, newProperty.status, newProperty.price, newProperty.city, newProperty.address, newProperty.type, newProperty.image, now()], (err, res) => {
                    if (err) {
                        console.log(err)
                        result(err, null)
                        return;
                    }else {
                    console.log("Ad successfully created", {...newProperty})
                    result(null, {id:res.insertId, ...newUser})
                    }
                })
            }
        })
    }
}

module.exports = Property;