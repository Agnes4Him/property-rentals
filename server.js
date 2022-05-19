const express = require('express');
const cors = require('cors');
const userRoutes = require('./src/routes/user.routes');
const propertyRoutes = require('./src/routes/property.routes');
const reportRoutes = require('./src/routes/report.routes')

const app = express();
const port = process.env.PORT || 7000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    //console.log(req);
    res.send({"Message" : "Welcome to ApexHauz! A home of property sales and rentals."})
})

app.use(userRoutes);
app.use(propertyRoutes);
app.use(reportRoutes);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})