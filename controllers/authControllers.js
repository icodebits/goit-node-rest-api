import bcrypt from "bcrypt";
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
