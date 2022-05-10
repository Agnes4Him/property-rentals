const express = require('express');

const app = express();
const port = process.env.PORT || 7000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})