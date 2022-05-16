const verifyToken = (req, res, next) => {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        //console.log(req.token);
        next()
    }else {
        res.status(403).send({"Message" : "You're not signed in"})
    }
}

module.exports = verifyToken;