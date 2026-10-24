SATISH WOOD WORKS - WEBSITE
===========================

HOW TO RUN (Windows)
1. Install Node.js (free, https://nodejs.org) - one time only.
2. Double-click  start-server.bat
3. The site opens at http://localhost:3000

CUSTOMER ENQUIRIES -> EXCEL
Every enquiry submitted on the website is saved in:
    data\enquiries.xlsx      (open with Excel)
    data\enquiries.json      (backup copy)
Each enquiry gets a reference like SWW-0001.
If the server is not running, the visitor's enquiry is kept in their browser
and they can download it as an Excel file and send it on WhatsApp.

EDIT YOUR DETAILS  (js\config.js)
- phone         : put your 10-digit mobile number (turns on Call / WhatsApp buttons)
- hours         : opening times (Sunday closed, Mon-Sat 9:00 AM - 7:30 PM)
- testimonials  : replace the SAMPLE reviews with real customer reviews,
                  then set showSampleBadge to false.

OPEN WITHOUT SERVER
index.html also opens directly by double-click (hero 3D and gallery work);
only "save to Excel on the server" needs start-server.bat.

PHOTOS
Gallery photos are in assets\thumb and assets\full (WebP, watermark-free).
To add a new design, add its photos and a line in js\catalog.js.

INSTANT QUOTE ESTIMATOR  (English + Kannada)
- Section "Instant Quote" on the site: customer picks an item, size and material and sees an approximate price at once,
  builds a multi-item quote, then downloads a PDF, sends it on WhatsApp, or books a free site visit.
- Every quote request is e-mailed to the shop as a lead (address in js\config.js -> email).
- PRICES:  edit js\rates.js  (rupees per sq ft). The rates in the file are SAMPLE rates:
  put the shop's real rates in, then set  sample: false  to hide the "sample rates" badge.
- WhatsApp button appears when the shop's 10-digit number is set in js\config.js -> phone.
