const authRoute = require("express").Router();
const User = require("../models/user");
const property = require("../models/property");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//SIGNUP//

authRoute.post("/register", async (req, res) => {
  try {
    // Controllo se la mail è già registrata in un account
    const isExisting = await User.findOne({ email: req.body.email });

    if (isExisting) {
      throw new Error("You already have an active account");
    }

    // Creo nuovo utente con pw criptata e token jwt
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = await User.create({
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
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw new Error("These credentials are wrong");
    }
    // Controllo password
    const comparePass = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!comparePass) {
      throw new Error("These credentials are wrong");
    }
    // Controllo del token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "5h",
    });
    const { password, ...others } = user._doc;
    return res.status(200).json({ others, token });
  } catch (error) {
    return res.status(500).json(error.message);
  }
});

// CREATE PROPERTY //

authRoute.post("/property", async (req, res) => {
  try {
    // Get the user from the request (assuming you have implemented authentication)
    const { user } = req;

    // Check if the user exists
    if (!user) {
      throw new Error("User not found");
    }

    // Create a new property
    const newProperty = await property.create({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      type: req.body.type,
      price: req.body.price,
      area: req.body.area,
      bedrooms: req.body.bedrooms,
      bathrooms: req.body.bathrooms,
      photo: req.body.photo,
      user: user._id, // Associate the property with the user
    });

    return res.status(200).json(newProperty);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//GET ALL USERS//
authRoute.get("/users", async (req, res) => {
  try {
    const users = await user.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = authRoute;
