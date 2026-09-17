const express = require('express');
const authRouter= express.Router();

const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');



authRouter.post('/register', authController.RegisterUserController);

authRouter.post('/login', authController.LoginUserController);

authRouter.post('/logout', authController.LogoutUserController);


authRouter.get('/me', authMiddleware.authUser, authController.GetCurrentUserController);
authRouter.post('/onboarding', authMiddleware.authUser, authController.OnboardUserController);



module.exports = authRouter;
