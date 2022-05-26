const express = require(`express`);
const mongoose = require(`mongoose`);
const router = express.Router();
const User = require(`../models/Users`);
const uid2 = require(`uid2`);
const SHA256 = require(`crypto-js/sha256`);
const encBase64 = require("crypto-js/enc-base64");

router.post(`/users/signup`, async (req, res) => {
  try {
    const { username, email, password, newsletter } = req.fields;

    const userSignUp = await User.find({ email });
    console.log(userSignUp);
    console.log(userSignUp.email);

    if (!userSignUp.email) {
      if (username) {
        const salt = uid2(16); // je génère mon salt
        console.log(salt);
        //je génére un hash
        const hash = SHA256(salt + password).toString(encBase64);
        console.log(hash);
        const token = uid2(64);
        console.log(token);
        const newUser = new User({
          email,
          account: {
            username,
            avatar: null,
          },
          newsletter,
          token,
          hash,
          salt,
        });
        console.log(newUser._id);
        await newUser.save();
        return res.json({
          id: newUser._id,
          token,
          account: {
            username,
          },
        });
      } else {
        res.status(400).json({ message: `Please choose an username` });
      }
    } else {
      res.status(400).json({ message: `User already exist` });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

router.post(`/users/login`, async (req, res) => {
  try {
    const userLogin = await User.findOne({ email: req.fields.email });

    if (userLogin) {
      const userSalt = userLogin.salt;
      console.log(userSalt);

      console.log(userLogin);
      const hashLogin = SHA256(userSalt + req.fields.password).toString(
        encBase64
      );
      console.log(hashLogin);

      if (hashLogin === userLogin.hash) {
        res.status(200).json({
          _id: userLogin._id,
          token: userLogin.token,
          account: {
            username: userLogin.account.username,
          },
        });
      } else {
        res.status(400).json({ message: `wrong password` });
      }
    } else {
      res.status(400).json({ message: `User doesn't exist` });
    }
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = router;
