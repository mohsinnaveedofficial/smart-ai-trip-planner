import trips from "./models/trip.js";

export const isLogIn = (req, res, next) => {
    if (!req.isAuthenticated()) {

        
        next({ status: 403, message: "You have not logged in ", extra: { loggedIn: false } });

    } else {
        next();
    }
}


export const saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

export const isOwned = async (req, res, next) => {
    const user = res.locals.currentuser;

    let { id } = req.params;
    let Trip = await trips.findById(id);
    if (!Trip.User.equals(user.id)) {
        next("Invalid Trip id");
    }
    next();

}