import { getweather } from "../utils/externalApi/weatherApi.js";
import { groqrecommendation } from "../utils/externalApi/groqApi.js";
import trips from "../models/trip.js";
import Location from "../models/Location.js";
import ExpressError from "../utils/ExpressError.js"



export const index = async (req, res) => {

   let user = req.user?._id;
   
    
    let alltrip = await trips.find({User:user}).populate("User").populate("stops");
    res.send(alltrip);
}


export const newtrip = async (req, res) => {


    let { name, date, location, transportation, days, stops } = req.body;
    if(!name||!date||!location||!transportation||typeof days !== "number"||!Array.isArray(stops) ){
          throw new ExpressError(400,"The data is inValid or incorrect")
    }
    console.log(req.body);

   const todaydate=new Date()
 
   todaydate.setHours(0,0,0,0);
     
   const inputDate=new Date(date);
   if(isNaN(inputDate.getTime())){
          throw new ExpressError(400,"The date is inValid or incorrect")
   }

   if(inputDate<=todaydate){
    throw new ExpressError(400,"Date must be greater than today")
   }
  
    const stopIds = [];

    for (let stop of stops) {
        const weatherdata = await getweather(stop);
        const SID = await SaveLocation(weatherdata);
        stopIds.push(SID);
    }
    

    const currLocationWeather = await getweather(location);

    const currID = await SaveLocation(currLocationWeather);

    console.log("groq is going to runing");
    
    const recommnedatioData = await groqrecommendation(name, days, location, transportation, stops);
    console.log(recommnedatioData)

    const newtrip = new trips({
        tripName: name,
        currentlocation: currID,
        date: date,
        transportation: transportation,
        stops: stopIds,
        days: 5,
        budget: {
            transportation: recommnedatioData.transportation,
            accommodation: recommnedatioData.accommodation,
            food: recommnedatioData.food,
            total: recommnedatioData.total,

        },
        recommendation: {
            Packing: recommnedatioData.recommendation.Packing,
            suggestions: recommnedatioData.recommendation.suggestions,
            Warning: recommnedatioData.recommendation.Warning,
            precautions: recommnedatioData.recommendation.precautions,
            WeatherRelated: recommnedatioData.recommendation.WeatherRelated,

        },
        User: req.user,
    })
    

    const tripResult = await newtrip.save();
  

    res.status(200).send({message:"Data is save successfully"});

}

export const destroyTrip = async (req, res) => {

    let { id } = req.params;

    let deletetrip = await trips.findByIdAndDelete(id)
    if (!deletetrip) {
        throw ({ status: 404, message: "Trip not found" });
    }
    res.send(deletetrip);
  
}


export const tripDetails = async (req, res, next) => {
    let { id } = req.params;
    let tripDetails = await trips.findById(id).populate("currentlocation").populate("stops")
    if (!tripDetails) {

        // throw ({ status: 404, message: "Trip not found" });
          throw new ExpressError(401,"Trip not found")
    }
    res.send(tripDetails)
}
export const tripStatus = async (req, res) => {
    let { id } = req.params;
    
    let newtrip = await trips.findOne({ _id: id });
    if (!newtrip) {
         throw new ExpressError(404,"Trip not found")
    } else {
        if (newtrip.tripStatus) {
            // throw ({ status: 409, message: "Trip is already mark as done" })
              throw new ExpressError(409,"Trip is already mark as done")
        } else {
            newtrip.tripStatus = true;
            await newtrip.save();
        }
    }
    res.send(newtrip);


}


async function SaveLocation(weatherdata) {

    const stopLocation = new Location({
        city: weatherdata.name,
        locationPoint: {
            type: "Point",
            coordinates: [weatherdata.coordinates.lon, weatherdata.coordinates.lat],

        },
        weather: weatherdata.weather
    })


    const saveStop = await stopLocation.save();
    return saveStop._id;

}

