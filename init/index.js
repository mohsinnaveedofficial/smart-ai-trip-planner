import mongoose from "mongoose";
import locationModel from "../models/Location.js"
import tripModel from "../models/trip.js"
import {tripsData,locationsData} from "./data.js"


main().then(()=>{
    console.log("connected to db")
}).catch(e=>console.log(e));

async function main() {
   await mongoose.connect("mongodb://127.0.0.1:27017/smartTripPlanner")
}



async function init() {
    console.log(tripsData)
//  let result=await locationModel.insertMany(locationsData)
    let result=await tripModel.insertMany(tripsData)
 console.log(result);
    
}
