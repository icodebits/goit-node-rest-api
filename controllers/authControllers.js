import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../db/models/User.js";
import authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

export const registerNewUser = async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        throw HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await authService.registerUser(email, hashedPassword);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await authService.getUser(email);

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, { expiresIn: "1h" });
  
    const result = await authService.updateUserToken(user.id, token);
    
    if (!result) {
      throw HttpError(401, "Email or password is wrong");
    }

    res.json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
};

export const logoutUser = async (req, res) => {
  const { id } = req.user;

  const user = await authService.getUserById(id);

  if (!user) {
      throw HttpError(401, "Not authorized");
  }

  await authService.updateUserToken(id, null);
  res.status(204).json();
};