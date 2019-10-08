require('dotenv').config();
const jwt = require("jsonwebtoken");
const BITBOXSDK = require('bitbox-sdk');
const BITBOX = new BITBOXSDK.BITBOX({ restURL: "https://rest.bitcoin.com/v2/" });

module.exports = function(req, res, next) {
  //get the token from the header if present
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  //if no token found, return response (without going to the next middelware)
  if (!token) return res.status(401).send("Access denied. No token provided.");

  const signature = req.headers["signature"];
  if (!signature) return res.status(401).send("Access denied. No signature provided.");

  try {
    //if can verify the token, set req.user and pass to next middleware
    const payload = jwt.decode(token);
    const address = payload.address;
    console.log(address);
    const verifySignature = BITBOX.BitcoinCash.verifyMessage(
      address, signature, JSON.stringify(payload)
    );
    if (verifySignature === true) {
      const decoded = jwt.verify(token, signature, {ignoreExpiration: true});
      req.address = decoded;
      next();
    } else {
      res.status(400).send("Invalid JWT Token");
    }
  } catch (ex) {
    //if invalid token
    res.status(400).send("Invalid Signature");
  }
};
