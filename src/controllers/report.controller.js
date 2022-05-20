const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Report = require('../models/report.model');

exports.reportFraud = (req, res) => {
    const id = req.params.id
    if (!req.body) {
        req.status(400).send({"Message" : "Please enter all fields"})
    }else {
        jwt.verify(req.token, process.env.JWT_KEY, (err, authData) => {
            if (err) {
                console.log(err)
                req.status(400).send({"Message":"Please login to report a fraudulent ad"})
            }else {
                const {reason, description} = req.body
                const report = new Report(id, reason, description)
                Report.reportAd(report, (err, data) => {
                    if (err) {
                        if (err.type == "no_fraud") {
                            res.status(400).send({"Message" : "That ad does not exist!"})
                        }else {
                            res.status(500).send({"Message" : err.message})
                        }
                    }else {
                            res.send({"status" : "success", "data" : data})
                    }
                })
            }
        })     
    }
}