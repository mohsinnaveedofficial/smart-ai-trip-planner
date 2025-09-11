
import mongoose, { Schema } from "mongoose";
import LocationModel from "./Location.js";

const tripSchema = new Schema({
    tripName: {
        type: String,
        required: true
    },
    currentlocation: {
        type: Schema.Types.ObjectId,
        ref: "Location"
    },
    date: Date,
    transportation: String,
    days: {
        type: Number,
        required: true
    },
    stops: [{
        type: Schema.Types.ObjectId,
        ref: "Location"
    }],
  
    notes: [{
        text: String,
        time: { type: Date, default: Date.now }
    }],
    checkList: {
        type: [
            {
                text: { type: String, required: true },
                status: {
                    type: String,
                    enum: ["Pending", "Done"],
                    default: "Pending"
                },
                category:{
                    type:String,
                    required:true,
                }
            }
        ],
        default: [
            { text: "Passport",category:"Documents", status: "Pending" },
            { text: "Book Accommodation",category:"Booking", status: "Pending" },
            { text: "Make Travel Itinerary",category:"Preparation", status: "Pending" },


        ]

    },
    recommendation: {
        Packing: String,
        suggestions: String,
        Warning: String,
        precautions: String,
        WeatherRelated: String,
    },
    budget: {
        transportation: { type: Number, default: 0, min: 0 },
        accommodation: { type: Number, default: 0, min: 0 },
        food: { type: Number, default: 0, min: 0 },
        total: { type: Number, default: 0, min: 0 }
    },
    tripStatus: {
        type: Boolean,
        default: false
    },
    User: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
})



tripSchema.post("findOneAndDelete", async (trips) => {

    if (trips) {
        const allIds = [...trips.stops, trips.currentlocation];
        await LocationModel.deleteMany({ _id: { $in: allIds } });
    }

})
const trips = mongoose.model("trips", tripSchema);
export default trips;