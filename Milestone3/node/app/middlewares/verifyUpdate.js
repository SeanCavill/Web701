const db = require("../models");
const User = db.user;
var bcrypt = require("bcryptjs");

checkPassword = (req, res, next) => {
    User.findOne({
        username: req.body.username
      })
        .exec((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
    
          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }
          
          //checks to see if current password entered matches
          var passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password
          );
    
          if (!passwordIsValid) {
            return res.status(401).send({
              accessToken: null,
              message: "Invalid Password!"
            });
          }
  
    next();
    });
    
  };

const verifyUpdate = {
    checkPassword
  };
  
  module.exports = verifyUpdate;