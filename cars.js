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
    id: "audia5", name: "Audi A5", year: 2019, type: "Car", city: "",
    price_per_day: 45, seats: 5, transmission: "Automatic", fuel: "Gas (Premium)",
    features: ["Bluetooth", "Backup camera", "USB charging", "Air conditioning"],
    images: ["A1.jpeg", "A2.jpeg", "A3.jpeg", "A4.jpeg", "A5.jpeg", "A6.jpeg", "A7.jpeg", "A8.jpeg", "A9.jpeg"], delivery: true, active: true, booked: []
  },
  {
    id: "teslamy", name: "Tesla Model Y", year: 2023, type: "Luxury", city: "",
    price_per_day: 60, seats: 5, transmission: "", fuel: "Electric",
    features: ["Adaptive cruise control", "Blind spot warning", "Bluetooth", "All-wheel drive"],
    images: ["T1.jpeg", "T2.jpeg", "T3.jpeg", "T4.jpeg","T5.jpeg","T6.jpeg","T7.jpeg","T8.jpeg", "T9.jpeg","T10.jpeg",], delivery: true, active: true, booked: []
  },
  {
    id: "camry", name: "Toyota Camry XSE", year: 2022, type: "Car", city: "",
    price_per_day: 40, seats: 5, transmission: "Automatic", fuel: "Gas",
    features: ["Blind spot warning", "Brake assist", "Bluetooth", "Backup camera", "Lane departure warning",],
    images: ["C1.jpeg", "C2.jpeg", "C3.jpeg", "C4.jpeg", "C5.jpeg"], delivery: true, active: true, booked: []
  },
  {
    id: "kia", name: "Kia K4", year: 2026, type: "SUV", city: "",
    price_per_day: 50, seats: 5, transmission: "Automatic", fuel: "Gas",
    features: ["Blind spot warning", "Brake assist", "Bluetooth", "Backup camera", "Lane departure warning",],
    images: ["K1.jpeg","K2.jpeg", "K3.jpeg","K4.jpeg","K5.jpeg","K6.jpeg","K7.jpeg",], delivery: false, active: true, booked: []
  },
  {
    id: "fordex", name: "Ford Explorer", year: 2022, type: "SUV", city: "",
    price_per_day: 40, seats: 6, transmission: "Automatic", fuel: "Gas",
    features: ["Blind spot warning", "Brake assist", "Bluetooth", "Backup camera", "Lane departure warning",],
    images: ["F1.jpeg", "F2.jpeg", "F3.jpeg", "F4.jpeg", "F5.jpeg", "F6.jpeg", "F7.jpeg",], delivery: false, active: true, booked: []
  },
   {
    id: "mazda", name: "Mazda CX-5", year: 2022, type: "Car", city: "",
    price_per_day: 45, seats: 5, transmission: "Automatic", fuel: "Gas (Premium)",
    features: ["Bluetooth", "Backup camera", "USB charging", "Air conditioning"],
    images: ["M1.jpeg", "M2.jpeg", "M3.jpeg", "M4.jpeg", "M5.jpeg", "M6.jpeg", "M7.jpeg", "M8.jpeg",], delivery: true, active: true, booked: []
  },
   {
    id: "kiason", name: "Kia Sorento", year: 2026, type: "SUV", city: "",
    price_per_day: 60, seats: 7, transmission: "Automatic", fuel: "Gas",
    features: ["Blind spot warning", "Brake assist", "Bluetooth", "Backup camera", "Lane departure warning",],
    images: ["S1.jpeg","S2.jpeg", "S3.jpeg","S4.jpeg","S5.jpeg","S6.jpeg","S7.jpeg", "S8.jpeg"], delivery: false, active: true, booked: []
  },
   {
    id: "hyund", name: "Hyundai Tucson SE", year: 2026, type: "Car", city: "",
    price_per_day: 45, seats: 5, transmission: "Automatic", fuel: "Gas (Premium)",
    features: ["Bluetooth", "Backup camera", "USB charging", "Air conditioning"],
    images: ["H1.jpeg", "H2.jpeg", "H3.jpeg", "H4.jpeg", "H5.jpeg", "H6.jpeg", ], delivery: true, active: true, booked: []
  },
];

/* REVIEWS: only add REAL reviews from real customers (with their permission).
   Cars with no reviews show "New listing". Example (remove the // to use):
   "economy-sedan": [ { name: "Jordan M.", date: "Nov 2026", rating: 5, text: "Clean car, easy pickup." } ],  */
window.REVIEWS = {
   "audia5": [ { name: "Jordan M.", date: "Jun 30, 2026", rating: 5, text: "Clean car, easy pickup." },
               { name : "Kate S.", date: "Aug 15, 2026", rating: 5, text: "Great car and easy ride." }
             ],
   "teslamy": [ { name: "Samuel T.", date: "Mar 2, 2026", rating: 4.5, text: "Pleasurable car."}
              ],
   "camry": [ { name: "John B.", date: "Oct 10, 2026", rating: 5, text: "great car and great host."},
              { name: "Andrew P.", date: "Sept 25, 2026", rating: 5, text: "Great car. Rides nice and good on gas. Host was great with responding also.",},
              { name: "Mariam K.", date: " Sept 5, 2026", rating: 5, text: "Host was AWESOME and car is AWESOME!!! I was able to extend with no problem.",}
            ],
   "kia": [ {name: "Becky B.", date: "Jun 30, 2026", rating: 4.95, text: "Car was in great condition and hosts were super informative! Would rent again."}
          ],
   "fordex": [ { name: "Racheal G.", date: "Sept 10, 2026", rating: 5, text: "Best ride."}
             ],
   "hyund":[ { name: "Sam B.", date: "Oct 10, 2026", rating: 5, text: "Smooth and steady."}
             ],
   
};

/* Booking requests are emailed to you by Formspree (free). Paste your form link: "https://formspree.io/f/abcd1234" */
window.FORM_ENDPOINT = "https://formspree.io/f/myekjdzo";

window.POLICY = "Free cancellation up to 24 hours before pickup. Contact the owner to change or cancel a trip.";

/* Phone numbers and emails (same as Loco for now; replace with yours) */
window.CONTACT = {
  emails: ["mattewgross85@gmail.com", "alexander22gate@gmail.com"],
  phones: ["+1 502-325-6460", ""]
};
