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

    static markSold(owner, id, status, result) {
        db.query('SELECT * FROM property WHERE owner = ? AND id = ?', [owner, id], (err, res) => {
            if (err) {
                console.log(err)
                result(err, null)
                return;
            }else if (res.length == 0) {
                console.log("That property does not exist")
                result({"type": "no_property"})
                return
            }else {
                db.query('UPDATE property SET status = ? WHERE owner = ? AND id = ?', [status, owner, id], (err, res) => {
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

    static viewAllProps(result) {
        db.query('SELECT * FROM property', (err, res) => {
            if (err) {
                console.log(err)
                result(err, null)
                return;
            }else if (res.length == 0) {
                console.log("No ads to display") 
                result({"type" : "no_ads"}, null)
                return;
            }
            console.log("Properties:", res)
            result(null, {"Number of properties":res.length, ...res})
        })
    }

    static viewOneProp(id, result) {
        db.query('SELECT * FROM property WHERE id = ?', [id], (err, res) => {
            if (err) {
                console.log(err)
                result(err, null)
                return;
            }else if (res.length == 0) {
                console.log("That ad does not exist any longer")
                result({"type" : "no_ad"}, null)
                return;
            }
            console.log("Property:", res)
            result(null, res)
        })
    }

    static viewPropType(type, result) {
        db.query('SELECT * FROM property WHERE type = ?', [type], (err, res) => {
            if (err) {
                console.log(err)
                result(err, null)
                return;
            }else if (res.length == 0) {
                console.log("No property type")
                result({"type" : "no_type"})
                return;
            }
            console.log("Property:", res)
            result(null, res)
        })
    }

    static updateAd(old_imageid, property, result) {
        db.query('SELECT * FROM property WHERE image_id = ? AND owner = ?', [old_imageid, property.owner], (err, res) => {
            if (err) {
                console.log(err)
                result(err, null)
                return;
            }else if (res.length == 0) {
                console.log("That ad does not exist")
                result({"type" : "no_ad"}, null)
                return;
            }else {
                db.query('UPDATE property SET status = ?, price = ?, state = ?, city = ?, address = ?, type = ?, image = ?, image_id = ? WHERE owner = ? AND image_id = ?', [property.status, property.price, property.state, property.city, property.address, property.type, property.image, property.image_id, property.owner, property.old_imageid], (err, res) => {
                    if (err) {
                        console.log(err)
                        result(err, null)
                        return;
                    }
                    console.log("Ad successfully updated. Ad affected: ", res.affectedRows)
                    result(null, res.affectedRows)
                })
            }
        })
    }
}

module.exports = Property;