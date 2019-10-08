const sigAuth = require("../middleware/sigAuth");
const bcrypt = require("bcrypt");
const { Address, validate } = require("../models/address.model");
const express = require("express");
const router = express.Router();

router.get("/current", sigAuth, async (req, res) => {
  const address = await Address.find({ address: req.address.address}).select("address signature");
  res.send(address);
});

router.post("/", async (req, res) => {
  // validate the request body first
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  //find an existing address
  let address = await Address.findOne({ address: req.body.address });
  if (address) return res.status(400).send("Address already registered.");

  address = new Address({
    address: req.body.address,
    signature: req.body.signature,
  });
  await address.save();

  const token = address.generateAuthToken();
  res.header("x-auth-token", token).send({
    address: address.address,
    signature: address.signature,
  });
});

module.exports = router;
