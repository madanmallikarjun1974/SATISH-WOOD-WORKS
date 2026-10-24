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
