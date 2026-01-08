import jwt from "jsonwebtoken";

export const optionalProtect = (req, res, next) => {
  const auth = req.headers.authorization;

  if (auth?.startsWith("Bearer ")) {
    try {
      const token = auth.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.user = decoded; 
    } catch {}
  }
  next();
};
