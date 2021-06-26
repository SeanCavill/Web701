const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Animal = db.animal;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    tokens: 0,
    lastClaimed: 0,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

      Role.findOne({ name: req.body.role }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    
  });
};

exports.refresh = (req,res) => {
    let token = req.headers["x-access-token"];
    User.findOne({"_id": req.userId}).populate("roles", "-__v").exec((err, user) => {
        if (err) {    
          res.status(500).send({ message: err });
          return;
        }
        if (!user) {
          return res.status(404).send({ message: "User Not found." });
        }

        var authorities = [];

        for (let i = 0; i < user.roles.length; i++) {
          authorities.push("ROLE_" + user.roles[i].name.toUpperCase());}

        res.status(200).send({
          id: user._id,
          username: user.username,
          email: user.email,
          tokens: user.tokens,
          roles: authorities,
          accessToken: token
        });
      });
  };
  

//updates existing user
exports.update = (req, res) => {

  //finds the user and updates the username, email, and password. The "new:true" is so I can return the new record instead of the old.
 User.findOneAndUpdate({username: req.body.username}, { "$set": { "username": req.body.username, "email": req.body.email, "password": (bcrypt.hashSync(req.body.newpassword, 8))}}, {new: true}
  )
  .populate("roles", "-__v")
      .exec((err, user) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    //generates a new token
    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400 // 24 hours
    });

    var authorities = [];

    for (let i = 0; i < user.roles.length; i++) {
      authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
    }
    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      tokens: user.tokens,
      roles: authorities,
      accessToken: token
    });
  });
};

//signs in existing user
exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

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

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        tokens: user.tokens,
        roles: authorities,
        accessToken: token
      });
    });
};


exports.listAnimal = (req, res) => {

  const animal = new Animal({
    animalName: req.body.animalName,
    species: req.body.species,
    description: req.body.description,
    lister: req.userId

  });
  
  animal.save((err, animal) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    return res.status(200).send({message: "Animal Listed Successfully."});
  });
};

exports.getAllAnimals = (req, res) => {
  Animal.find((err, animals) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      res.status(200).send(animals);
    });
  };


exports.getAnimal = (req, res) => {
  Animal.findOne({"_id": req.body.animalId},(err, animal) => {
      if (err) {    
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send(animal);
    });
  };


exports.getUserAnimals = (req, res) => {
  Animal.find({"lister": req.userId},(err, animals) => {
      if (err) {    
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send(animals);
    });
  };

      
exports.deleteAnimal = (req, res) => {
  Animal.findOneAndDelete({"_id": req.body.animalId},(err, animal) => {
      if (err) {    
        res.status(500).send({ message: err });
        return;
      }
      res.status(200).send({message: "Animal deleted"});
    });
  };

exports.adoptAnimal = (req, res) => {
  Animal.findOneAndDelete({"_id": req.body.animalId},(err, theAnimal) => {
      if (err) {    
        res.status(500).send({ message: err });
        return;
      }

      if(!theAnimal){
        res.status(404).send({ message: "animal doesn't exist"})
        return;
      }

      User.findOneAndUpdate({"_id": req.userId}, {$inc: { tokens: -1}},(err) => {
        if (err) {    
          res.status(500).send({ message: err });
          return;
        }

      });

      User.findOneAndUpdate({"_id": theAnimal.lister}, {$inc: { tokens: 1}},(err) => {
        if (err) {    
          res.status(500).send({ message: err });
          return;
        }
      

      });

      res.status(200).send({message: "Animal deleted"});
    
    });
  };

  exports.claimToken = (req, res) => {
    User.findOneAndUpdate({"_id": req.userId},{lastClaimed: req.body.lastClaimed, $inc: { tokens: 1}},(err, user) => {
        if (err) {    
          res.status(500).send({ message: err });
          return;
        }

        res.status(200).send({message: "Token Claimed"});

      });
    };
