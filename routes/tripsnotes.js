import express from "express";
const router = express.Router({ mergeParams: true });
import { wrapAsync } from "../utils/wrapAsync.js";
import { isLogIn, isOwned } from "../middleware.js";
import { DestroyNotes, tripNotesCreate, UpdateNotes } from "../controller/tripNotes.js";


router.route("/:noteId")
    .put(isLogIn, isOwned, wrapAsync(UpdateNotes))
    .delete(isLogIn, isOwned, wrapAsync(DestroyNotes))


router.post("/",isLogIn, isOwned, wrapAsync(tripNotesCreate)
)
export default router;