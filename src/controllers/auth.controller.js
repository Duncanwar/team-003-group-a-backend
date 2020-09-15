import userService from '../services/user.service.js';
import responses from '../helpers/responses.js';
import helper from '../helpers/helper.js';
import userModel from '../models/user.model.js';
import passport from 'passport';
import strategy from 'passport-facebook';
import dotenv from 'dotenv';

dotenv.config();

const FacebookStrategy = strategy.Strategy;
const { createUser, getUserByEmail } = userService;
const { successResponse, errorResponse } = responses;
const { generateToken, hashPassword } = helper;

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user);
});

passport.deserializeUser(function (object, done) {
  console.log(object);
  done(null, object);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/auth/facebook/callback',
      profileFields: ['email', 'name'],
    },
    function (accessToken, refreshToken, profile, done) {
      const { email, first_name, last_name } = profile._json;
      const userData = {
        email: email,
        firstName: first_name,
        lastName: last_name,
      };
      new userModel(userData).save();
      console.log(userData);
      done(null, profile);
    }
  )
);

const signUp = async (req, res) => {
  try {
    const { name, profession, password, email } = req.body;
    const encryptPassword = await hashPassword(password);
    let user = new userModel({
      name,
      profession,
      password: encryptPassword,
      email,
    });
    user = await createUser(user);
    const token = await generateToken(user);
    return successResponse(res, 201, token, 'signup successfully', user);
  } catch (error) {
    return errorResponse(res, 401, `you can not signup`);
  }
};

const logIn = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);
    const token = await generateToken(user);
    return successResponse(res, 200, token, 'successfully logged In', user);
  } catch (error) {
    return errorResponse(res, 401, error.message);
  }
};

export default {
  signUp,
  logIn,
};
