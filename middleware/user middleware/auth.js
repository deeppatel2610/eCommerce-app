const jwt = require("jsonwebtoken");
const { envVariables } = require("../../utils/envVariables");

module.exports = async (req, res, next) => {
  const JWT_KEY = envVariables.JWT_SECRET;

  try {
    const token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const accessToken = token.split(" ")[1];
    const decodeToken = await jwt.verify(accessToken, JWT_KEY);

    if (!decodeToken.id) {
      return res.status(403).json({ message: "Id missing in token" });
    }

    req.user = decodeToken;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};
