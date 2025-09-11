import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


export async function groqrecommendation(name, days, location, transportation, stops) {
    let parsedData = {};
    console.log("grok data grok is running ")
    console.log(name, days, location, transportation, stops)
    const completion = await groq.chat.completions
        .create({
            messages: [
                {
                    role: "user",
                    content: `You are a smart AI travel assistant.

The user is planning a trip. Based on the following input:

Trip Name: ${name}

Start Location: ${location}

Transportation Mode: ${transportation}

Total Days: ${days}

Stops: ${JSON.stringify(stops)}

Return the output strictly in the following JSON format:

json
Copy
Edit
{
  "transportation": <Number>,
  "accommodation": <Number>,
  "food": <Number>,
  "total": <Number>,
  "recommendation": {
    "Packing": "<string>",
    "suggestions": "<string>",
    "Warning": "<string>",
    "precautions": "<string>",
    "WeatherRelated": "<string>",
  }
}
Instructions:

Keep all responses brief and relevant to the user’s trip.

transportation, accommodation, food, and total must be numerical budget estimates based on the trip details.

recommendation must include all five fields: Packing, suggestions, Warning, precautions, and Weather-related, each as short and informative text.

Return only the JSON. Do not include any explanation or additional text.
`
                },
            ],
            model: "llama-3.3-70b-versatile",
        })
        .then((chatCompletion) => {
            const raw = chatCompletion.choices[0]?.message?.content || "";
            console.log("raw data" ,raw);
            const cleandata = raw.replace(/```json|```/g, "").trim();
            console.log("clean data " , cleandata);
            
            parsedData = JSON.parse(cleandata);
            console.log("parsed data",parsedData)



        });

    return parsedData;
}







