import "dotenv/config";
import JWT from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function verifyJWT(req, res, next) {
  // Strips "Bearer" off "Bearer <token>" in request header
  const token = req.headers["x-access-token"].split(" ")[1];

  if (token) {
    JWT.verify(token, JWT_SECRET, (err, decoded) => {
      if (err)
        return res.status(401).json({
          result: "failure",
          message: "Failed to authenticate",
          isLoggedIn: false,
        });
      req.user = {};
      req.user.id = decoded.id;
      req.user.email = decoded.email;
      next();
    });
  } else {
    res.status(401).json({
      result: "failure",
      message: "Incorrect token given",
      isLoggedIn: false,
    });
  }
}
