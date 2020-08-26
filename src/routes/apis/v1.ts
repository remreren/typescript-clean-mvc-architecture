import authController from "../../controllers/apis/auth";
import userController from "../../controllers/apis/user";
import { Router } from "express";

const router = Router();

router.use('/auth', authController);
router.use('/users', userController);

export default router;