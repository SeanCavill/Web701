const { verifySignUp } = require("../middlewares");
const { verifyUpdate } = require("../middlewares");
const { authJwt } = require("../middlewares");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsername,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/update", verifyUpdate.checkPassword, controller.update);

  app.get("/api/auth/refresh", authJwt.verifyToken, controller.refresh);

  app.post(
    "/api/auth/list",
    [authJwt.verifyToken, authJwt.ismember],
    controller.listAnimal
  );

  app.get(
    "/api/auth/getAnimals",
    controller.getAllAnimals
  );
  
  app.get(
    "/api/auth/getUserAnimals",
    [authJwt.verifyToken, authJwt.ismember],
    controller.getUserAnimals
  );

  app.post(
    "/api/auth/animal",
    controller.getAnimal
  )

  app.post(
    "/api/auth/deleteAnimal",
    [authJwt.verifyToken, authJwt.ismember],
    controller.deleteAnimal
  );

  app.post(
    "/api/auth/adoptAnimal",
    [authJwt.verifyToken, authJwt.isbeneficiary, authJwt.hasTokens],
    controller.adoptAnimal
  );

  app.post(
    "/api/auth/claimToken",
    [authJwt.verifyToken, authJwt.canClaimToken],
    controller.claimToken
  );
};