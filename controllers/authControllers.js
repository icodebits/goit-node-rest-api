import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../db/models/User.js";
import authService from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";
import gravatar from "gravatar";
import path from "node:path";
import fs from "node:fs/promises";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const avatarsDir = path.resolve("public/avatars");

const {BASE_URL} = process.env;

const createVerifyEmail = (email, verificationCode) => {
    return {
        to: email,
        subject: "Verify your email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click to verify email</a>`
    };
}

export const registerNewUser = async (req, res) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        throw HttpError(409, "Email in use");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const avatarURL = await gravatar.url(email, { s: "250", d: "retro" }, true);
  
    const verificationToken = nanoid();
  
    const newUser = await authService.registerUser(email, hashedPassword, avatarURL, verificationToken);
  
    const verifyEmail = createVerifyEmail(email, verificationToken);

    await sendEmail(verifyEmail);

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
        avatarURL: newUser.avatarURL,
      },
    });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await authService.getUser(email);

    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }
  
    if (!user.verify) {
      throw HttpError(403, "Email not verified");
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

export const getCurrentUser = async (req, res) => {
  const { id } = req.user;
  const user = await authService.getUserById(id);

  if (!user) {
      throw HttpError(401, "Not authorized");
  }

  res.json({
    email: user.email,
    subscription: user.subscription
  })
};

export const updateAvatar = async (req, res) => {
  if (!req.file) {
    throw HttpError(400, "No file uploaded");
  }

  const { path: tempPath, filename } = req.file;
  const newAvatarName = `${req.user.id}-${Date.now()}${path.extname(filename)}`;
  const newAvatarPath = path.join(avatarsDir, newAvatarName);

  await fs.rename(tempPath, newAvatarPath);

  const avatarURL = `/avatars/${newAvatarName}`;
  await authService.updateUserAvatar(req.user.id, avatarURL);

  res.json({ avatarURL });
}

export const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ where: { verificationToken } });

    if (!user) {
        throw HttpError(404, "User not found");
    }

    await user.update({ verificationToken: null, verify: true });
    res.status(200).json({ message: "Verification successful" });
}

export const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
        throw HttpError(404, "User not found");
    } else if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    } else {    
        const verifyEmail = createVerifyEmail(email, user.verificationToken);

        await sendEmail(verifyEmail); 

        res.status(200).json({ message: "Verification email sent" });
    }
}