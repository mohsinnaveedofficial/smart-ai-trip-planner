import mongoose from "mongoose";
const Schema = mongoose.Schema;


const locationSchema = new Schema({

    city: {
        type: String,
        required: true
    },
    locationPoint: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },

        coordinates: {
            type: [Number]
        },

    },


    weather: {
        main:String,
        description: String,
        temp: Number,
        visibility: Number,
    }

})




const Location = mongoose.model("Location", locationSchema);
export default Location;

