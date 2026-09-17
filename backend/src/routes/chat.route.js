const express = require('express');

const chatRouter = express.Router();

const chatController = require('../controllers/chat.controller');
const authMiddleware = require('../middlewares/auth.middleware');

chatRouter.get('/token', authMiddleware.authUser, chatController.getStreamTokenController);


module.exports = chatRouter;