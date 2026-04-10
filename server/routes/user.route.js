import { Router } from "express";
import { registerUserController , verifyEmailController, resendOtpController, loginUserController, logoutsController, forgotPasswordController, verifyForgetPassword, changePasswordController, authWithGoogle, getAllUsersController, deleteUserController, resendForgotPasswordOtpController } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";

const userRouter = Router();
userRouter.get("/all", getAllUsersController);
userRouter.post("/register", registerUserController);
userRouter.delete("/:id", deleteUserController);

userRouter.post("/verifyEmail", verifyEmailController);

userRouter.post("/resendOtp", resendOtpController);

userRouter.post("/login", loginUserController);

userRouter.get("/logout",  logoutsController);

userRouter.post("/forgot-password", forgotPasswordController);
userRouter.post("/resend-forgot-password-otp", resendForgotPasswordOtpController);
userRouter.post("/verify-forgot-password", verifyForgetPassword);
userRouter.post("/forgot-password/change-password", changePasswordController);
userRouter.post("/authWithGoogle", authWithGoogle);



export default userRouter;