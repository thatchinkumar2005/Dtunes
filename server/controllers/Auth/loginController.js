import dotenv from "dotenv";
dotenv.config();
import { User } from "../../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { settings } from "../../config/settings.js";
import { jwtTokenCookieOpt } from "../../config/jwtTokenCookieOpt.js";

export default async function loginController(req, res) {
  try {
    const { username_email, pswd } = req.body;
    if (!username_email || !pswd)
      res.status(400).json({ message: "All fields are required" });

    const foundUser = await User.findOne({
      $or: [{ username: username_email }, { email: username_email }],
    });

    if (!foundUser)
      return res
        .status(401)
        .json({ message: "No user with such username or email" });

    const match = await bcrypt.compare(pswd, foundUser.hash);

    if (match) {
      const roles = Object.values(foundUser.roles).filter(Boolean);

      const accessToken = jwt.sign(
        {
          username: foundUser.username,
          id: foundUser._id,
          roles,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: settings.accessTokenExpiry,
        }
      );
      const refreshToken = jwt.sign(
        {
          username: foundUser.username,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: settings.refreshTokenExpiry,
        }
      );

      foundUser.refreshToken = refreshToken;
      foundUser.oauth.oauthProvider = "none";
      await foundUser.save();

      res.cookie("jwt", refreshToken, jwtTokenCookieOpt);

      return res.json({
        accessToken,
        username: foundUser.username,
        roles,
        id: foundUser._id,
      });
    } else {
      return res.status(401).json({ message: "Wrong credentials" });
    }
  } catch (error) {}
}
