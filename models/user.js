import mongoose from "mongoose";

import passportLocalMongoose from "passport-local-mongoose";
import trips from "./trip.js";
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNo: {
    type: String
  },
  Created_At: {
    type: Date,
    default: Date.now,
  },
  Location: {
    type: String,
  },
  image:{
    url:String,
    filename:String
  }
});
UserSchema.plugin(passportLocalMongoose);


UserSchema.post("findOneAndDelete", async (user) => {
   
  if (user) {
    await trips.deleteMany({User:user._id });
  }
});

const User = mongoose.model("User", UserSchema);
export default User;
