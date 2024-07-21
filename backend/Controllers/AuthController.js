const UserModel = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //if user is already in our system then we will revert them back
    const user = await UserModel.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User already exist, You can directly login",
        success: false,
      });
    }

    const userModel = new UserModel({ name, email, password });
    //encrypt the password
    userModel.password = await bcrypt.hash(password, 10);
    await userModel.save();
    res.status(201).json({ message: "SignUp Successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    //if user is already in our system then we will revert them back
    const user = await UserModel.findOne({ email });
    const errorMsg = "Authentication failed, email or pass must be invalid";
    if (!user) {
      return res.status(403).json({
        message: errorMsg,
        success: false,
      });
    }
    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        message: errorMsg,
        success: false,
      });
    }

    //if email and pass is right then only we will create JWT token
    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res
      .status(200)
      .json({
        message: "LogIn Successfully",
        success: true,
        jwtToken,
        email,
        name: user.name,
      });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", success: false });
  }
};
module.exports = {
  signup,
  login,
};
