const express = require("express");
const router = express.Router();



router.get("/", (req, res) => {
  res.json({
    hello: "Welcome to our API!",
  });
});

module.exports = router;
