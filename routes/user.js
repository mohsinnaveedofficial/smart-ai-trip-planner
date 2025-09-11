import { logIn, logOut, signUp ,loginFailed, checkLoggedIn, googleauth, getUserDetails, UpdateProfile, updatePassword, DestroyUser, UploadImage, } from "../controller/user.js";
import express from 'express'
const router = express.Router();
import { wrapAsync } from "../utils/wrapAsync.js"
import passport from "passport";
import { isLogIn } from "../middleware.js";
import {storage} from "../cloudConfig.js"
import multer from "multer";
const Upload=multer({storage})


// post register 
router.post("/register", wrapAsync(signUp))

//get login
router.post('/login',passport.authenticate('local', { failureRedirect: '/login/failed' }), logIn);

router.get("/login/failed",loginFailed)

router.get("/islogged",checkLoggedIn)


router.get("/auth/google", passport.authenticate('google', {
    scope:
        ['email', 'profile', "https://www.googleapis.com/auth/user.phonenumbers.read"]
}));




router.get("/auth/google/callback", passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_BASE_URL,
}),googleauth
)

router.route("/")
.get(isLogIn,wrapAsync(getUserDetails))
.put(isLogIn,wrapAsync(UpdateProfile))
.delete(isLogIn,wrapAsync(DestroyUser))


router.patch("/password",isLogIn,wrapAsync(updatePassword))


router.get("/logout", logOut)

router.post("/UploadImage",isLogIn,Upload.single("userImage"), wrapAsync(UploadImage))

export default router;
