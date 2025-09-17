import User from "../models/user.js";
import trips from "../models/trip.js";
import ExpressError from "../utils/ExpressError.js";


export const signUp = async (req, res) => {
  let { email, password, firstName, lastName, phone } = req.body;

  const newUser = new User({
    email: email,
    username: email,
    firstName: firstName,
    lastName: lastName,
    phoneNo: phone,
  });

  if (!email || !password || !firstName || !lastName || !phone) {
    throw new ExpressError(400, "Please provide all the required fields");
  }
  const registeruser = await User.register(newUser, password);

  req.login(registeruser, (err) => {
    if (err) {
      return next(err);
    }
    res.send({
      message: "User is register successfully register",
      loggedIn: true,
    });
  });
};

export const logIn = (req, res) => {
  console.log("Session after login:", req.session);
 req.session.user = { id: 123, name: "test" };
 console.log(req.session)
 
  res.send({ message: "successfully login ", user: req.user, loggedIn: true });
};  

export const loginFailed = (req, res) => {
  res.status(401).json({
    success: false,
    message: "Invalid username or password",
  });
};

export const checkLoggedIn = (req, res) => {
  if (req.isAuthenticated) {
    
    res.json({ user: req.user });
  } else {
    res.json({ user: null });
  }
};

export const googleauth = (req, res) => {
  res.redirect(`${process.env.FRONTEND_BASE_URL}/dashboard`);
};

export const logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    return res.status(200).json({ message: "Logout successfully" });
  });
};

export const getUserDetails = async (req, res) => {
  let userId = req.user._id;
  if (!userId) {
    throw { status: 400, message: "User ID is required" };
  }
  let countAlltrip = await trips.countDocuments({ User: userId });
  let pendingTrips = await trips.countDocuments({
    User: userId,
    tripStatus: false,
  });
  let remaingtrips = countAlltrip - pendingTrips;
  let todaydate = new Date();
  let upcomingTrips = await trips.countDocuments({
    User: userId,
    tripStatus: false,
    date: { $gte: todaydate },
  });
  const userData = await User.findById(userId);

  res.send({
    countAlltrip,
    pendingTrips,
    remaingtrips,
    upcomingTrips,
    userData,
  });
};

export const UpdateProfile = async (req, res) => {
  let { firstName, lastName, email, phoneNo, location } = req.body;

  const updateuser = await User.findOneAndUpdate(
    { username: email },
    {
      $set: {
        firstName: firstName,
        lastName: lastName,
        phoneNo: phoneNo,
        Location: location,
      },
    },
    { new: true }
  );
  if (updateuser) {
    res.send(updateuser);
  } else {
    // throw({status:400,message:"The user is not updated"});
    throw new ExpressError(400, "The user is not updated");
  }
};

export const updatePassword = async (req, res) => {
  let { email, oldPassword, newPassword } = req.body;
  if (!email || !oldPassword || !newPassword) {
    throw new ExpressError(400, "Invalid D ata Password is not change ");
  }

  let user = await User.findOne({ email: email });
  if(!user.salt || !user.hash){
    throw new ExpressError(404,"You logged in with Google. Password cannot be changed in this account")
  }
  if (!user) {
    throw new ExpressError(404, "User is not found");
  }
  await user.changePassword(oldPassword, newPassword);

  res.status(200).json({ message: "Password changed successfully" });
};

export const DestroyUser = async (req, res, next) => {
  let userId = req.user._id;

  await User.findByIdAndDelete(userId);
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.status(200).json({ message: "Account deleted successfully." });
  });
};

export const UploadImage = async (req, res) => {
  let filename = req.file.filename;
  let url = req.file.path;
  let userId = req.user._id;

  let UpdateUser = await User.findOneAndUpdate(
    { _id: userId },
    { image: { url, filename } },
    { new: true }
  );

  res.status(200).json({ image: UpdateUser.image });
};
