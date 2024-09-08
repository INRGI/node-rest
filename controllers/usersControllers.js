import bcrypt from 'bcrypt';
import 'dotenv/config'
import gravatar from 'gravatar';
import path from 'path';
import fs from 'fs/promises';

import HttpError from "../helpers/HttpError.js";
import { catchAsync } from "../helpers/catchAsync.js";
import { addUser, getUserByEmail, updateUser, verifyUser } from "../services/usersServices.js";
import jwt from 'jsonwebtoken';
import Jimp from 'jimp';
import { nanoid } from 'nanoid';
import {sendEmail} from '../helpers/sendEmail.js';
import { verifyEmailAgainTemplate, verifyEmailTemplate } from '../helpers/verifyPresets.js';

const { SECRET_KEY } = process.env;

const avatarPath = path.resolve("public", "avatars");

export const register = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (user) throw HttpError(409, "Email in use");

  const avatar = gravatar.url(email, { d: 'retro' });

  const hashPassword = await bcrypt.hash(password, 8);

  const verificationToken = nanoid();

  const newUser = await addUser({ ...req.body, password: hashPassword, avatarURL: avatar, verificationToken });

  sendEmail(verifyEmailTemplate(email, req, verificationToken));

  res.status(201).json({
    "user": {
      "email": newUser.email,
      "subscription": newUser.subscription,
    }
  })
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) throw HttpError(401, "Email or password is wrong");

  if(!user.verify) throw HttpError(401, "Email is not verified!");

  const checkPassword = await bcrypt.compare(password, user.password);
  if (!checkPassword) throw HttpError(401, "Email or password is wrong");

  const payload = { id: user._id };

  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });

  await updateUser(user._id, { token });

  res.status(200).json({
    token,
    "user": {
      "email": user.email,
      "subscription": user.subscription,
    }
  });
});

export const logout = catchAsync(async (req, res) => {
  const { _id } = req.user;
  const user = await updateUser(_id, { token: "" });
  if (!user) throw HttpError(401);

  throw HttpError(204, "No Content");
});

export const current = catchAsync(async (req, res) => {
  const { email, subscription } = req.user;

  const user = await getUserByEmail(email);
  if (!user) throw HttpError(401);

  res.json({ email, subscription });
});

export const updateAvatar = catchAsync(async (req, res) => {
  const { _id } = req.user;

  if (!req.file || !req.file.path) throw HttpError(400);

  const { path: oldPath, filename } = req.file;

  const uniqueFilename = `${nanoid()}${path.extname(filename)}`;

  Jimp.read(oldPath, (err, lenna) => {
    if (err) throw HttpError(401);

    lenna.resize(250, 250).write(`${avatarPath}\/${uniqueFilename}`);
    fs.rm(oldPath);
  })

  const avatarURL = path.join("avatars", uniqueFilename);

  const user = await updateUser(_id, { avatarURL });
  if(!user) throw HttpError(401);

  return res.json(avatarURL);
});

export const verify = catchAsync(async (req, res) => {
  const {verificationToken} = req.params;

  const user = await verifyUser({verificationToken}, {verificationToken: null, verify: true});
  if(!user) throw HttpError(404, "User not Found!");

  res.json("Verification successful!");
});

export const verifyAgain = catchAsync(async (req, res) => {
  const {email} = req.body;

  const user = await getUserByEmail(email);
  if (!user) throw HttpError(404, "User not Found!");

  if(user.verify) throw HttpError(200, "User already verified!");

    sendEmail(verifyEmailAgainTemplate(email, req, user.verificationToken));
    res.json("Verification token was sent");
});