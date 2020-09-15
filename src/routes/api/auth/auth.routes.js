import express from 'express';
import authMiddleware from '../../../middlewares/auth.js';
import authController from '../../../controllers/auth.controller.js';
import passport from 'passport';

const router = express.Router();
const { signUp, logIn } = authController;
const { userDuplicationAccount, checkLoginCredentials } = authMiddleware;

router
  .post('/auth/signup', [userDuplicationAccount], signUp)
  .post('/auth/login', [checkLoginCredentials], logIn)
  .get('/auth/facebook', passport.authenticate('facebook'), () => {
    console.log('error');
  })
  .get(
    '/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/',
      failureRedirect: '/fail',
    }),
    () => {
      console.log('error');
    }
  )
  .get('/fail', (req, res) => {
    res.send('Failed attempt');
  })
  .get('/', (req, res) => {
    res.send('Success attempt');
  });
export default router;
