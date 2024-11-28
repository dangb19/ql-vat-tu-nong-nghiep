const { ObjectId } = require("mongodb");
const ApiError = require("../api-error");
const UserService = require("../services/user.service");
const MongoDB = require("../utils/mongodb.util");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "goodbyeworld";

function getUserDataFromReq(req) {
  return new Promise((resolve, reject) => {
    jwt.verify(req.cookies.token, jwtSecret, {}, (err, userData) => {
      if (err) throw err;

      resolve(userData);
    });
  });
}

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const userService = new UserService(MongoDB.client);
    const userDoc = await userService.create({
      name,
      email,
      passwordHash: bcrypt.hashSync(password, bcryptSalt),
      role: "staff",
      status: "active",
    });

    return res.send(userDoc);
  } catch (error) {
    console.log("error", error);
    return next(new ApiError(500, "An error occur while creating user"));
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userService = new UserService(MongoDB.client);
    const userDoc = await userService.findByEmail(email);

    if (!userDoc) return next(new ApiError(404, "User not found!"));

    // Found user
    if (userDoc) {
      const passwordOK = bcrypt.compareSync(password, userDoc.password);

      if (passwordOK) {
        jwt.sign(
          { id: userDoc._id, email: userDoc.email },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;

            res.cookie("token", token, {
              sameSite: "none",
            });
            res.json(userDoc);
          }
        );
      } else {
        res.status(422).json("Wrong password");
      }
    }
    // Not found user
    else {
      res.json("not found user");
    }
  } catch (error) {
    return next(new ApiError(500, `Error retrieving user`));
  }
};

exports.logout = async (req, res, next) => {
  res.cookie("token", "").json(true);
};

exports.getProfile = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (token) {
      const userService = new UserService(MongoDB.client);
      const verifiedUser = await getUserDataFromReq(req);
      const userDoc = await userService.findById(verifiedUser.id, {
        passwordHash: 0,
      });

      if (!userDoc) return next(new ApiError(404, "User not found!"));

      return res.json(userDoc);
    }
  } catch (error) {
    return next(new ApiError(500, `Error retrieving user`));
  }
};

exports.findAll = async (req, res, next) => {
  let documents = [];
  const projection = { passwordHash: 0 };

  console.log(req.query);

  try {
    const userService = new UserService(MongoDB.client);
    const { name } = req.query;
    if (name) {
      documents = await userService.findByName(name, projection);
    } else {
      documents = await userService.find({});
    }
  } catch (error) {
    return next(new ApiError(500, "An error occur while retrieving users"));
  }

  return res.send(documents);
};

exports.findOne = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.findById(req.params.id, {
      passwordHash: 0,
    });
    if (!document) return next(new ApiError(404, "User not found!"));
    return res.send(document);
  } catch (error) {
    return next(
      new ApiError(500, `Error retrieving user with id=${req.params.id}`)
    );
  }
};

exports.update = async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update can not be empty"));
  }

  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.update(req.params.id, req.body);

    if (!document) {
      return next(new ApiError(404, "User not found!"));
    }
    return res.send({ message: "User was updated successfully" });
  } catch (error) {
    return next(
      new ApiError(500, `Error updating user with id=${req.params.id}`)
    );
  }
};

exports.delete = async (req, res, next) => {
  try {
    const userService = new UserService(MongoDB.client);
    const document = await userService.delete(req.params.id);
    if (!document) {
      return next(new ApiError(404, "Reader not found!"));
    }
    return res.send({ message: "Reader was deleted successfully!" });
  } catch (error) {
    return next(
      new ApiError(500, `Could not delete user with id=${req.params.id}`)
    );
  }
};