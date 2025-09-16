  import express from "express";
  import mongoose from "mongoose";
  import session from "express-session";
  import passport from "passport";
  import localStrategy from "passport-local";
  import User from "./models/user.js";
  import { Strategy as googleStrategy } from "passport-google-oauth2";
  import "dotenv/config";
  import tripRouter from "./routes/trip.js";
  import userRouter from "./routes/user.js";
  import tripNotesRouter from "./routes/tripsnotes.js";
  import tripCheckListRouter from "./routes/tripchecklist.js";
  import cors from "cors";
  import MongoStore from "connect-mongo";

  const app = express();
  const port = 3000;
  const mongourl = process.env.MONGODB_URL;


  app.use(
    cors({
      origin: process.env.FRONTEND_BASE_URL,
      credentials: true,
    })
  );

  main()
    .then(() => {
      console.log("connected to db");
    })
    .catch((e) => console.log(e));

  async function main() {
    await mongoose.connect(mongourl);
  }


  const store = MongoStore.create({
    mongoUrl: mongourl,
    crypto: {
      secret: "this is my strong secret",
    },
    touchAfter: 24 * 3600,
  });

  store.on("error", (err) => {
    console.log("MONGO SESSION ERRORS ", err);
  });


  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  


  app.use(
    session({
      store,
      secret: "this is my secret",
      resave: false,
      saveUninitialized: false,
      cookie: { 
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",   
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", 
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());


  passport.use(new localStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  passport.use(
    new googleStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.PASSPORT_CALLBACK_URL,
        passReqToCallback: true,
      },
      async function (request, accessToken, refreshToken, profile, done) {
        let res = await fetch(
          "https://people.googleapis.com/v1/people/me?personFields=phoneNumbers",
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const data = await res.json(); 
        const phoneNo = data.phoneNumbers?.[0].value || null;

        const existingUser = await User.findOne({
          username: profile.emails[0].value,
        });
        if (existingUser) {
          if (phoneNo) existingUser.phoneNo = phoneNo;
          await existingUser.save();
          return done(null, existingUser);
        }

        const newUser = await new User({
          email: profile.emails[0].value,
          username: profile.emails[0].value,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: {
            url:
              profile.photos && profile.photos.length > 0
                ? profile.photos[0].value
                : null,
            filename: "google-profile",
          },
          phoneNo: phoneNo,
        }).save();
        return done(null, newUser);
      }
    )
  );


  app.use((req, res, next) => {
    res.locals.currentuser = req.user;
    next();
  });

  app.use("/trip", tripRouter);
  app.use("/users", userRouter);
  app.use("/trip/:id/notes", tripNotesRouter);
  app.use("/trip/:id/checklist", tripCheckListRouter);

  app.get("/", (req, res) => {
    return res.send(req.user);
  });


  app.use((err, req, res, next) => {
    let { status = 500, message, extra = {} } = err;
    return res.status(status).json({ message, ...extra });
  });

  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
