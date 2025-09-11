import ExpressError from "../ExpressError.js";

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather?q=";

export async function getweather(stop) {
    let data = await fetch(`${WEATHER_API_URL}${stop}&appid=${process.env.WEATHER_API_KEY}&units=metric`);
    let response = await data.json()
    console.log(response)
    if(response.cod==404){
          throw new ExpressError(404,`${stop} City name is not found`)
    }
    return ({
        name: response.name,
        coordinates: response.coord,
        weather: {
            main:response.weather[0].main,
            description: response.weather[0].description,
            temperature: response.main.temp,
            visibility: response.visibility
        }
    });
}

