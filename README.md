# Pickup & Go (Vercel, no database)

Plain HTML site. Cars, photos, reviews and contact info live in `cars.js`. Booking requests are emailed by Formspree (free).

## 1. Booking emails (Formspree)
formspree.io -> New form -> your email -> copy the link (https://formspree.io/f/abcd1234) -> paste it into `window.FORM_ENDPOINT = "";` in `cars.js`.

## 2. Put it online
New private GitHub repo -> upload all the unzipped files -> vercel.com -> Add New -> Project -> import it. Framework Preset: **Other**. Leave build settings empty. Deploy.

## 3. Edit
- Cars, prices, features, photos: edit `cars.js` on GitHub (pencil, then Commit).
- Photos: upload next to the other files; use the exact name in `images: ["photo1.jpg"]`. Keep each under 1 MB.
- Your email and phone: `CONTACT` at the bottom of `cars.js`.
- Cancellation policy: `POLICY` in `cars.js`. Write your real policy.
- Reviews: add REAL customer reviews only, in `REVIEWS` (example inside the file).
- When you accept a booking, add its dates to that car's `booked` list so search and booking block them.

## Limits
Availability depends on you updating `booked`. No online payment, no ID verification, no admin login.
