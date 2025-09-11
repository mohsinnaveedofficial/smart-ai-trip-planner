import { destroyTrip, index, newtrip, tripDetails, tripStatus } from "../controller/trip.js";
import express from 'express';
import { isLogIn, isOwned } from "../middleware.js";
const router = express.Router();
import { wrapAsync } from "../utils/wrapAsync.js";



router.route("/")
    .get(isLogIn, wrapAsync(index))                    //get for all trips of user 
    .post(isLogIn, wrapAsync(newtrip))               //post request for trip 




router.route("/:id")
    .delete(isLogIn, isOwned,wrapAsync(destroyTrip))        //delete request for trips
    .get(isLogIn, isOwned,wrapAsync(tripDetails))           // get trips details




//put request to add the checklist 


// // put request to add the notes
// router.put("/:id/notes", isLogIn,isOwned ,wrapAsync(tripNotesCreate))

// put for marks as done trip || trip done 
router.put("/:id/status", isLogIn, isOwned,wrapAsync(tripStatus))



export default router;