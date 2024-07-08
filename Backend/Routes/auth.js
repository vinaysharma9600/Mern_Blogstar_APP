const express = require("express");
const User = require("../Models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");
const JWT_SECRET = 'Harryisgoodboy';
//  Route 1 : create a User using : POST "/api/auth/createuser." Doesn't require auth

router.post(
  "/createuser",
  [
    body("email", "Enter a valid Name").isEmail(),
    body("name", "Enter a valid email").isLength({ min: 3 }),
    body("password", "PAssword Must be at least 5 character").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //if there are errors ,return Bad request and errors
    let Success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ Success,errors: errors.array() });
    }
    //check wheteher the user with this email exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({Success, error: "Sorry a user with this email already exists" });
      }
      //Create a new user
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash( req.body.password,salt);

      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
         user:{
            id:user.id
         }
      }
      
      const authToken = jwt.sign(data,JWT_SECRET);
      Success = true;
      res.json({Success,authToken,
          message: "User created successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).send("Internal server Error Occured");
    }
  }
);





// Route :2  Authenticate  a User using : POST "/api/auth/login." Doesn't require auth

router.post('/login',[
  body('email','Enter a valid email').isEmail(),
  body('password','Password cannot be blank').exists(),
], async (req,res)=>{

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {email,password} = req.body;
  try{
    let user = await User.findOne({email});
    if(!user){
      return res.status(400).json({error:"Please try to Login with correct Credentials"});

    }
    const passwordCompare = await bcrypt.compare(password,user.password);
    if(!passwordCompare){
      return res.status(400).json({error:"Please try to Login with correct Credentials"});
    }
    const payload ={
      user:{
        id:user.id
      }
    }
    const authToken = jwt.sign(payload,JWT_SECRET);
    res.json({authToken: authToken,Success: true});

  }catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error Occured");
  }

})

// Route 3: Get Login User Details "api/auth/getuser"

router.post('/getuser',fetchuser,async (req,res)=>{

  
  try{
    userId = req.user.id;   // it user id append by fetchuser function in req object
    const user = await User.findById(userId).select("-password");
    res.send(user);

  }catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error Occured");
  }



})












module.exports = router;
