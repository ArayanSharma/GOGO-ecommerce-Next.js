import mongoose from "mongoose"

const homeSliderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true

});
const HomeSlider = mongoose.model("HomeSlider", homeSliderSchema);

export default HomeSlider;