const express = require("express");
const ensureAuthenticated = require("../Middlewares/Auth");
const router = express.Router();

router.get("/", ensureAuthenticated, (req, res) => {
  console.log("---- logged in user detail ----", req.user);
  res.status(200).json([
    {
      name: "Mobile",
      price: 10000,
    },
    {
      name: "Laptop",
      price: 50000,
    },
  ]);
});

module.exports = router;
