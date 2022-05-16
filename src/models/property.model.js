const db = require('../config/db.config.js');

class Property {
    constructor(user_id, status, price, state, city, address, type, image_url) {
        this.user_id = user_id
        this.status = status
        this.price = price
        this.state = state
        this.city = city
        this.address = address
        this.type = type
        this.image_url = image_url
    }
}

module.exports = Property;