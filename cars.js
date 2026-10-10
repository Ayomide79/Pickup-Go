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
    id: "audia5", name: "Audi A5", year: 2019, type: "Car", city: "Orlando",
    price_per_day: 45, seats: 5, transmission: "Automatic", fuel: "Gas (Premium)",
    features: ["Bluetooth", "Backup camera", "USB charging", "Air conditioning"],
    images: ["A1.jpeg", "A2.jpeg", "A3.jpeg", "A4.jpeg", "A5.jpeg", "A6.jpeg", "A7.jpeg", "A8.jpeg", "A9.jpeg"], delivery: true, active: true, booked: []
  },
  {
    id: "teslamy", name: "Tesla Model Y", year: 2023, type: "Luxury", city: "Orlando",
    price_per_day: 60, seats: 5, transmission: "", fuel: "Electric",
    features: ["Adaptive cruise control", "Blind spot warning", "Bluetooth", "All-wheel drive"],
    images: ["T1.jpeg", "T2.jpeg", "T3.jpeg", "T4.jpeg","T5.jpeg","T6.jpeg","T7.jpeg","T8.jpeg", "T9.jpeg","T10.jpeg",], delivery: true, active: true, booked: []
  },
  {
    id: "pickup-truck", name: "Pickup Truck", year: 2020, type: "Truck", city: "Your City",
    price_per_day: 95, seats: 5, transmission: "Automatic", fuel: "Gas",
    features: ["Large truck bed", "Tow hitch", "Bluetooth", "Backup camera"],
    images: ["car-pickup-truck.svg"], delivery: true, active: true, booked: []
  },
  {
    id: "sport-coupe", name: "Sport Coupe", year: 2021, type: "Luxury", city: "Your City",
    price_per_day: 140, seats: 4, transmission: "Automatic", fuel: "Gas",
    features: ["Leather seats", "Premium sound", "Sunroof", "Bluetooth"],
    images: ["car-sport-coupe.svg"], delivery: false, active: true, booked: []
  }
];

/* REVIEWS: only add REAL reviews from real customers (with their permission).
   Cars with no reviews show "New listing". Example (remove the // to use):
   "economy-sedan": [ { name: "Jordan M.", date: "Nov 2026", rating: 5, text: "Clean car, easy pickup." } ],  */
window.REVIEWS = {
   "audia5": [ { name: "Jordan M.", date: "Jun 2026", rating: 5, text: "Clean car, easy pickup." },
               { name : "Kate S.", date: "Aug 2026", rating: 5, text: "Great car and easy ride." }
             ],
   "teslamy"; [ { name: "Samuel T.", date: "Mar 2026", rating: 4.5, text: "Pleasurable car."}
              ]
};

/* Booking requests are emailed to you by Formspree (free). Paste your form link: "https://formspree.io/f/abcd1234" */
window.FORM_ENDPOINT = "";

window.POLICY = "Free cancellation up to 24 hours before pickup. Contact the owner to change or cancel a trip. (Edit this to your real policy.)";

/* Phone numbers and emails (same as Loco for now; replace with yours) */
window.CONTACT = {
  emails: ["mattewgross85@gmail.com", "alexander22gate@gmail.com"],
  phones: ["(201) 619-8112", "(303) 616-0578"]
};
