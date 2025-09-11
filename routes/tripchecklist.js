import express from "express"
import { isLogIn, isOwned } from "../middleware.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import { tripCheckListCreate } from "../controller/tripChecklist.js";
const router=express.Router({mergeParams:true});

router.put("/", isLogIn,isOwned, wrapAsync(tripCheckListCreate))
export default router;