const authRoute = require("express").Router();
const user = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//SIGNUP//

authRoute.post("/register", async (req, res) => {
  try {
    //Controllo se la mail è già registrata in un account//
    const isExisting = await user.findOne({ email: req.body.email });

    if (isExisting) {
      throw new Error("You already have an active account");
    }

    //Creo nuovo utente con pw criptata e token jwt//
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await user.create({
     username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });
    const { password, ...others } = newUser._doc;
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });

    return res.status(200).json({ others, token });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

//LOGIN//

authRoute.post("/login", async (req, res) => {
  try {
    // Controllo email
    const foundUser = await user.findOne({ email: req.body.email }); 
    if (!foundUser) {
      throw new Error("These credentials are wrong");
    }
    // Controllo password
    const comparePassword = await bcrypt.compare(
      req.body.password,
      foundUser.password
    );
    if (!comparePassword) {
      throw new Error("These credentials are wrong");
    }
    // Controllo del token
    const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
    const { password, ...others } = foundUser._doc;
    return res.status(200).json({ others, token });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

module.exports = authRoute;
