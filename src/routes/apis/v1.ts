import userController from "../../controllers/apis/user";
import { Router } from "express";

const userRouter = Router();

userRouter.use('/user', userController);

export default userRouter;