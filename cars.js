/* ===== PICKUP & GO: EDIT YOUR CARS, REVIEWS AND DETAILS HERE =====
   Keep every comma and quote exactly as in the examples.
   ADD a car: copy one { ... } block, paste it after the last one (add a comma between), change the values.
   HIDE a car: active: false.
   PHOTOS: upload the picture next to this file, then write its exact name in images: ["my-car-1.jpg","my-car-2.jpg"].
   BOOKED DATES: when you accept a booking add { from: "2026-11-10", to: "2026-11-14" } to that car's booked list.
   type must be one of: Car, SUV, Truck, Van, Luxury, Electric.
   The 4 cars below are SAMPLES with drawings. Replace names, prices and photos with your real cars. */
window.CARS = [
  {
    id: "economy-sedan", name: "Economy Sedan", year: 2021, type: "Car", city: "Your City",
    price_per_day: 55, seats: 5, transmission: "Automatic", fuel: "Gas",
    features: ["Bluetooth", "Backup camera", "USB charging", "Air conditioning"],
    description: "Comfortable, fuel-efficient sedan. Clean and easy to drive. Great for city trips and daily use.",
    images: ["car-economy-sedan.svg"], delivery: true, active: true, booked: []
  },
  {
    id: "family-suv", name: "Family SUV", year: 2022, type: "SUV", city: "Your City",
    price_per_day: 85, seats: 7, transmission: "Automatic", fuel: "Gas",
    features: ["Third row seating", "Roof rack", "Bluetooth", "Cruise control"],
    description: "Roomy SUV with space for luggage and the whole family. Smooth ride for long highway trips.",
    images: ["car-family-suv.svg"], delivery: true, active: true, booked: []
  },
  {
    id: "pickup-truck", name: "Pickup Truck", year: 2020, type: "Truck", city: "Your City",
    price_per_day: 95, seats: 5, transmission: "Automatic", fuel: "Gas",
    features: ["Large truck bed", "Tow hitch", "Bluetooth", "Backup camera"],
    description: "Strong, practical pickup with a large bed for moving, hauling and work trips.",
    images: ["car-pickup-truck.svg"], delivery: true, active: true, booked: []
  },
  {
    id: "sport-coupe", name: "Sport Coupe", year: 2021, type: "Luxury", city: "Your City",
    price_per_day: 140, seats: 4, transmission: "Automatic", fuel: "Gas",
    features: ["Leather seats", "Premium sound", "Sunroof", "Bluetooth"],
    description: "Stylish two-door coupe for weekend drives and special occasions.",
    images: ["car-sport-coupe.svg"], delivery: false, active: true, booked: []
  }
];

/* REVIEWS: only add REAL reviews from real customers (with their permission).
   Cars with no reviews show "New listing". Example (remove the // to use):
   "economy-sedan": [ { name: "Jordan M.", date: "Nov 2026", rating: 5, text: "Clean car, easy pickup." } ],  */
window.REVIEWS = {
  // "economy-sedan": [ { name: "Jordan M.", date: "Nov 2026", rating: 5, text: "Clean car, easy pickup." } ],
};

/* Booking requests are emailed to you by Formspree (free). Paste your form link: "https://formspree.io/f/abcd1234" */
window.FORM_ENDPOINT = "";

window.POLICY = "Free cancellation up to 24 hours before pickup. Contact the owner to change or cancel a trip. (Edit this to your real policy.)";

/* Phone numbers and emails (same as Loco for now; replace with yours) */
window.CONTACT = {
  emails: ["mattewgross85@gmail.com", "alexander22gate@gmail.com"],
  phones: ["(201) 619-8112", "(303) 616-0578"]
};
