const express = require('express');
const cors = require('cors');
const router = require('./src/routes/user.routes');

const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    //console.log(req);
    res.send({"Message" : "Welcome to ApexHauz! A home of property sales and rentals."})
})

app.use(router)

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})