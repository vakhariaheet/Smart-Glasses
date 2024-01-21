import { model, Schema } from "mongoose";
// Stores RMC data for a single pair of glasses
const CurrentGPSSchema = new Schema({
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    speed: {
        type: Number,
        required: true,
    },
    track: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

export default model("CurrentGPS", CurrentGPSSchema);
