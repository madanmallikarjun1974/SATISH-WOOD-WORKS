SATISH INTERIOR WORLD - WEBSITE
===============================

WHAT IS IN THIS WEBSITE
- Entry form: first-time visitors fill name + mobile (+ what they need) once, then the site opens (English / Kannada).
- 3D scroll showroom, design gallery, Heritage-vs-Modern slider.
- "Our materials": Plywood (Commercial, BWR, BWP, Marine), Solid wood (Teak, Neem, Honne, Mahogany, Acacia, Red Sal,
  Rosewood), Laminated work, Veneer, MDF / HDHMR / HDF, Finishes & fittings - plus a job guide, comparison table and FAQ.
  (Edit the words in js\materials.js.)
- Instant Quote estimator (English / Kannada) with PDF quote + WhatsApp button (rates in js\rates.js).
- Detailed enquiry form, live open/closed status, map, call + WhatsApp buttons.
- Owner dashboard: /owner (password protected, separate link on the same website).

WHERE EVERY LEAD GOES
  1. E-mail to satishinteriorworld@gmail.com  - [NEW VISITOR] / [DETAILED ENQUIRY] / [QUOTATION]
  2. Google Sheet + owner.html dashboard       - connected through sheetUrl in js\config.js
  3. data\leads.xlsx                           - only when you run start-server.bat on your own PC

EDIT YOUR DETAILS  (js\config.js)
- phone / email / address / hours / map link
- sheetUrl : the Google Apps Script link for the owner dashboard (the Google Apps Script web app URL)
- reviews      : customers write reviews on the site; you approve them in owner.html (Customer reviews). You may also add real ones by hand in config.js (reviews: [...])
- previewMode : keep false on the live website (true = demo mode, nothing is sent)

HOW TO RUN ON A PC (Windows, optional)
1. Install Node.js (free, https://nodejs.org) once.
2. Double-click start-server.bat   ->   http://localhost:3000   (owner page: /owner.html)

GOING LIVE ON NETLIFY
Drag the website ZIP onto https://app.netlify.com/drop  (or connect the GitHub repo). No build step.

PHOTOS
Gallery photos are in assets\thumb and assets\full. Material texture samples are in assets\mat.
To add a design, add its photos and a line in js\catalog.js.
