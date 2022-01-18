const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const modules = require("./src");

app.use(bodyParser.json());

app.use(modules.home);
app.use(modules.songs);
app.use(modules.artists);

module.exports = app;
