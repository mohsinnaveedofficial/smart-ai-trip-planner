export const locationsData = [
  {
    city: "Paris",
    LocationPoint: {
      type: "Point",
      coordinates: [2.2945, 48.8584]
    }
  },
  {
    city: "New York",
    LocationPoint: {
      type: "Point",
      coordinates: [-74.0445, 40.6892]
    }
  },
  {
      
    city: "Fujinomiya",
    LocationPoint: {
      type: "Point",
      coordinates: [138.7274, 35.3606]
    }
  }
];





export const tripsData = [
  {
    tripName: "Europe Adventure",
    currentlocation: "687a1e8a59a9441811ffb6e1",
    date: new Date("2025-08-01"),
    transportation: "Train",
    days: 10,
    stops: ["687a1e8a59a9441811ffb6e2", "687a1e8a59a9441811ffb6e3"], // Example only
    notes: [
      { text: "Pack light", description: "Only carry essentials" },
      { text: "Currency exchange", description: "Get Euros before flight" }
    ],
    checkList: [
      { text: "Book hotels", status: "done" },
      { text: "Buy travel insurance", status: "pending" }
    ],
    recommendation: "Try local cuisine and avoid tourist traps.",
    budget: {
      transportation: 500,
      accommodation: 1000,
      food: 300,
      total: 1800
    },
    tripStatus: false
  },
  {
    tripName: "Japan Solo Trip",
    currentlocation: "687a1e8a59a9441811ffb6e2",
    date: new Date("2025-11-10"),
    transportation: "Bullet Train",
    days: 7,
    stops: ["687a1e8a59a9441811ffb6e1"],
    notes: [
      { text: "Learn basic Japanese phrases", description: "Helps with communication" }
    ],
    checkList: [
      { text: "Reserve JR Pass", status: "done" },
      { text: "Download offline maps", status: "pending" }
    ],
    recommendation: "Stay at a Ryokan for authentic experience.",
    budget: {
      transportation: 200,
      accommodation: 600,
      food: 250,
      total: 1050
    },
    tripStatus: true
  }
];
