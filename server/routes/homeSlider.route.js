import { Router } from "express";
import { uploadImage } from "../controllers/homeSlider.controller.js";
import upload from "../config/multerConfig.js";

const homeSliderRouter = Router();

homeSliderRouter.post("/uploadImage", upload.single('image'), uploadImage);

export default homeSliderRouter;