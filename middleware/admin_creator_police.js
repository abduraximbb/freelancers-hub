const { to } = require("../helpers/to_promise");
const myJwt = require("../services/jwt_service_admin");

module.exports = async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res.status(403).send({ message: "Token berilmagan" });
    }

    const bearer = authorization.split(" ")[0];
    const token = authorization.split(" ")[1];

    if (bearer !== "Bearer" || !token) {
      return res.status(401).send({ message: "Token noto'g'ri berilgan" });
    }

    const [error, decodedToken] = await to(myJwt.verifyAccessToken(token));
    if (error) {
      return res.status(403).send({ message: error.message });
    }

    if (!decodedToken.is_super_admin) {
      return res.status(400).send({ message: "You are not super admin" });
    }

    req.admin = decodedToken;

    next();
  } catch (error) {
    res.status(403).send({ message: "Admin ro'yxatdan o'tmagan" });
  }
};
