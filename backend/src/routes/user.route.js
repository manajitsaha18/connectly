const express = require('express');
const userRouter = express.Router();

const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

userRouter.put('/profile', authMiddleware.authUser, userController.updateProfileController);

userRouter.get('/', authMiddleware.authUser, userController.getRecommendedUsersController);
userRouter.get('/friends', authMiddleware.authUser, userController.getFriendsController);

userRouter.post('/friend-request/:id', authMiddleware.authUser, userController.sendFriendRequestsController);
userRouter.put('/friend-request/:id/accept', authMiddleware.authUser, userController.acceptFriendRequestController);

userRouter.get('/friend-requests', authMiddleware.authUser, userController.getFriendRequestsController);
userRouter.get('/outgoing-friend-requests', authMiddleware.authUser, userController.getOutgoingFriendRequestsController);





module.exports = userRouter;