import trips from "../models/trip.js";
import ExpressError from "../utils/ExpressError.js"


export const tripNotesCreate = async (req, res) => {
    let { id } = req.params;
    let { notes } = req.body;


    let newtrip = await trips.findById(id);
    if (!newtrip) {
          throw new ExpressError(401,"Trip not found")
    }
    newtrip.notes.push({ text: notes })
    await newtrip.save();
    res.send(newtrip)
}


export const UpdateNotes = async (req, res) => {

    let { id, noteId } = req.params;
    let { notes } = req.body;
    const trip = await trips.findOne({ _id: id, "notes._id": noteId });

    

    if (!trip) {
        // throw { status: 404, message: "Note not found in this trip" }
          throw new ExpressError(404,"Note not found in this trip")
    }


    let updatetrip = await trips.findOneAndUpdate({ _id: id, "notes._id": noteId }, { $set: { "notes.$.text": notes } },
        { new: true }
    )


    if (!updatetrip) {
        // throw { status: 404, message: "Not found" }
          throw new ExpressError(404,"Not found")
    }

    res.send(updatetrip);

}


export const DestroyNotes = async (req, res) => {

    let { id, noteId } = req.params;
    const trip = await trips.findOne({ _id: id, "notes._id": noteId });

 

    if (!trip) {
        // throw { status: 404, message: "Note not found in this trip" }
        throw new ExpressError(404,"Note not found in this trip")
    }
    let deleted = await trips.findByIdAndUpdate({ _id: id }, { $pull: { notes: { _id: noteId } } }, { new: true })


    if (!deleted) {
        // throw { status: 403, message: "Not found" }
        throw new ExpressError(403,"Not found ")
    }
    res.send(deleted);

}