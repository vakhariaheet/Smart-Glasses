import { Schema, model } from "mongoose";
// Stores GPA data for a single pair of glasses

const GPSRouteSchema = new Schema({
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
    glassesId: {
        type: String,
        required: true,
    }
}, { timestamps: true });

export default model("GPSRoute", GPSRouteSchema);