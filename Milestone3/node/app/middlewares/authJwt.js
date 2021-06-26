const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({ message: "No token provided! Please login" });
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

isbeneficiary = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }



    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "beneficiary") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require beneficiary Role!" });
        return;
      }
      
    );
  });
};

ismember = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.find(
      {
        _id: { $in: user.roles }
      },
      (err, roles) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        for (let i = 0; i < roles.length; i++) {
          if (roles[i].name === "member") {
            next();
            return;
          }
        }

        res.status(403).send({ message: "Require member Role!" });
        return;
      }
    );
  });
};

hasTokens = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if(user.tokens <= 0){
      res.status(403).send({ message: "You don't have enough tokens to adopt an animal. Get limited tokens on the 'Get a Token'."});
      return;
    }
    next();
  });
};

canClaimToken = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }
    if(req.body.lastClaimed <= ((user.lastClaimed)+60000)){

      res.status(403).send({ message: "Wait Before claiming Again", textt: user.lastClaimed });
        return;
    }

    next();
  });
};



const authJwt = {
  verifyToken,
  isbeneficiary,
  ismember,
  hasTokens,
  canClaimToken
};
module.exports = authJwt;
