import { Router } from "express";
import { registerUserController , verifyEmailController, resendOtpController, loginUserController, logoutsController, forgotPasswordController, verifyForgetPassword, changePasswordController, authWithGoogle } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";

const userRouter = Router();
userRouter.post("/register", registerUserController);

userRouter.post("/verifyEmail", verifyEmailController);

userRouter.post("/resendOtp", resendOtpController);

userRouter.post("/login", loginUserController);

userRouter.get("/logout",  logoutsController);

userRouter.post("/forgot-password", forgotPasswordController);
userRouter.post("/verify-forgot-password", verifyForgetPassword);
userRouter.post("/forgot-password/change-password", changePasswordController);
userRouter.post("/authWithGoogle", authWithGoogle);



export default userRouter;