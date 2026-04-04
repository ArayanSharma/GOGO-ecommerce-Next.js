import mongoose from "mongoose"

const homeSliderSchema = new mongoose.Schema({
    image: [
        {
        type: String,
        required: true
    },

    ],
    dateCreated: {
        type: Date,
        default: Date.now
    }
},{
    timestamps: true

});
const HomeSlider = mongoose.model("HomeSlider", homeSliderSchema);

export default HomeSlider;