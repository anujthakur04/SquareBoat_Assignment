const express = require('express');
const dotenv = require('dotenv');
const cors = require("cors");
const bodyParser = require("body-parser");
const { sequelize } = require('./src/models');
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(bodyParser.json());
app.use(cors());

app.use("/", require("./src/routes/index"));


app.listen(port, async (req, res) => {
    console.log(`Server is running at ${port}`)
    sequelize.authenticate();
    console.log("Database is connected successfully")
})