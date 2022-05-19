const db = require('../config/db.config.js');

class Report {
    constructor(id, reason, description) {
        this.id = id
        this.reason = reason
        this.description = description
    }

    static reportAd(report, result) {
        db.query('SELECT * FROM property WHERE id = ?', [report.id], (err, res) => {
            if (err) {
                console.log(err)
                result(err, null)
                return;
            }else if (res.length == 0) {
                console.log("That ad does not exist")
                result({"type" : "no_fraud"}, null)
                return;
            }else {
                db.query('INSERT INTO reports (property_id, reason, description) VALUES (?, ?, ?)', [report.id, report.reason, report.description], (err, res) => {
                    if (err) {
                        console.log(err)
                        result(err, null)
                        return;
                    }
                    console.log("Report successfully made", report)
                    result(null, report)
                })
            }
        })
    }
}

module.exports = Report;