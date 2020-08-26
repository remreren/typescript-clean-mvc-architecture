import { Router } from "express";
import userService from "../../services/users/user";

const userRouter = Router();

userRouter.post('/create', userService.createUser);


export default userRouter;