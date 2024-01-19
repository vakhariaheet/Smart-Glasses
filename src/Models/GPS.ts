import { Schema, model } from "mongoose";

const GPSSchema = new Schema({
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true,
    },
    altitude: {
        type: Number,
        required: true,
    },
    speed: {
        type: Number,
        required: true,
    },
    glassesId: {
        type: String,
        required: true,
    },
    climb: {
        type: Number,
        required: true,
  
    }
}, { timestamps: true });

export default model("GPS", GPSSchema);