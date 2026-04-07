import { Router } from "express";
import { createSlide, getSlides, uploadImage, updateSlide, deleteSlide } from "../controllers/homeSlider.controller.js";
import upload from "../config/multerConfig.js";

const homeSliderRouter = Router();

homeSliderRouter.get("/", getSlides);
homeSliderRouter.post("/", createSlide);
homeSliderRouter.post("/uploadImage", upload.single('image'), uploadImage);
homeSliderRouter.put("/:id", updateSlide);
homeSliderRouter.delete("/:id", deleteSlide);

export default homeSliderRouter;