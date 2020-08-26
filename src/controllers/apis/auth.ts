import { Router } from "express";
import authService from "../../services/auth/auth";

const authRouter = Router();

authRouter.post('/signup', authService.signup);
authRouter.post('/signin', authService.signin);

export default authRouter;