const db = require('../config/db.config.js');

class Property {
    constructor(owner, status, price, state, city, address, type, image, image_id) {
        this.owner = owner
        this.status = status
        this.price = price
        this.state = state
        this.city = city
        this.address = address
        this.type = type
        this.image = image
        this.image_id = image_id

    }

    static createAd(newProperty, result) {
        db.query('SELECT * FROM property WHERE owner=? AND type=?', [newProperty.owner, newProperty.type], (err, res) => {
            if (err) {
                console.log(err)
                result(err, null)
                return;
            }else if (res.length > 0) {
                console.log("That property already exists")
                result({"type":"property_exist"}, null)
                return;
            }else {
                db.query('INSERT INTO property (owner, status, price, state, city, address, type, image, image_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [newProperty.owner, newProperty.status, newProperty.price, newProperty.state, newProperty.city, newProperty.address, newProperty.type, newProperty.image, newProperty.image_id], (err, res) => {
                    if (err) {
                        console.log(err)
                        result(err, null)
                        return;
                    }else {
                    console.log("Ad successfully created", {...newProperty})
                    result(null, {id:res.insertId, ...newProperty})
                    }
                })
            }
        })
    }

    static markSold(owner, image_id, status, result) {
        db.query('SELECT * FROM property WHERE owner = ? AND image_id = ?', [owner, image_id], (err, res) => {
            if (err) {
                console.log(err)
                result(err, null)
                return;
            }else if (res.length == 0) {
                console.log("That property does not exist")
                result({"type": "no_property"})
                return
            }else {
                db.query('UPDATE property SET status = ? WHERE owner = ? AND image_id = ?', [status, owner, image_id], (err, res) => {
                    if ( err) {
                        console.log(err)
                        result(err, null)
                        return;
                    }
                    console.log("Ad successfully marked as sold")
                    result(null, res.affectedRows)
                })          
            }
        })
    }

    static deleteProp(owner, image_id, result) {
        db.query('SELECT * FROM property WHERE owner = ? AND image_id = ?', [owner, image_id], (err, res) => {
            if (err) {
                console.log(err)
                result(err, null)
                return;
            }else if (res.length == 0) {
                console.log("That property does not exist")
                result({"type": "no_prop"}, null)
                return
            }else {
                db.query('DELETE FROM property WHERE owner = ? AND image_id = ?', [ owner, image_id], (err, res) => {
                    if ( err) {
                        console.log(err)
                        result(err, null)
                        return;
                    }
                    console.log("Ad successfully deleted", res)
                    result(null, res.affectedRows)
                })        
                
            }
        })
    }
}

module.exports = Property;