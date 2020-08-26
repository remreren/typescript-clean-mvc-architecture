import { Router } from "express";
import userService from "../../services/users/user";

const userRouter = Router();

userRouter.get('/', userService.getUsers);
userRouter.get('/:id', userService.getUserById);

export default userRouter;