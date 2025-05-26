import { verify } from "jsonwebtoken";
import User from "../models/User";

export const authGuard = async (req, res, next) => {
  // Get the token from the Authorization header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify the JWT
      const decoded = verify(token, process.env.JWT_SECRET);
      
      // Find the user by ID from the decoded token and exclude the password field
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // Attach the user object to the request
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      return res.status(401).json({ message: "Invalid token", error: error.message });
    }
  } else {
    return res.status(401).json({ message: "No token provided or token is malformed" });
  }
};

export { authGuard };
