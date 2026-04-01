import { Router } from "express";
import { registerUserController , verifyEmailController , loginUserController, logoutsController, forgotPasswordController, verifyForgetPassword, changePasswordController } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";

const userRouter = Router();
userRouter.post("/register", registerUserController);

userRouter.post("/verifyEmail", verifyEmailController);

userRouter.post("/login", loginUserController);

userRouter.get("/logout",  logoutsController);

userRouter.post("/forgot-password", forgotPasswordController);
userRouter.post("/verify-forgot-password", verifyForgetPassword);
userRouter.post("/forgot-password/change-password", changePasswordController);



export default userRouter;