import trips from "../models/trip.js";
import ExpressError from "../utils/ExpressError.js"


export const tripCheckListCreate = async (req, res) => {
    let { id } = req.params;
    let { checkList } = req.body;
    
   

    if (!Array.isArray(checkList)) {
        // throw ({ status: 402, message: "Not Found checkList" });
        throw new ExpressError(402,"Not found checkList")
    }
    const newtrip = await trips.findByIdAndUpdate(id, { checkList }, { new: true });

    res.send(newtrip);

}


