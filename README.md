# nasa-data-explorer
# 🚀 NASA Explorer

Explore NASA’s open APIs with a sleek, modern React frontend and Express backend.

## 🌐 Live Demo

Frontend: [https://nasa-frontend-kpp6.onrender.com](https://nasa-frontend-kpp6.onrender.com)  
Backend: [https://nasa-backend-6asb.onrender.com](https://nasa-backend-6asb.onrender.com)

---

## 🔧 Tech Stack

- Frontend: React + CSS Modules / Bootstrap
- Backend: Node.js + Express
- API: [NASA Open APIs](https://api.nasa.gov/)
- Hosting: Render

---
✅ Public API Routes (Proxy to NASA Open APIs)
Method	Endpoint	Description
GET	/api/apod?date=YYYY-MM-DD	Fetch Astronomy Picture of the Day by date
GET	/api/epic?date=YYYY-MM-DD	Fetch Earth EPIC satellite data by date
GET	/api/mars?rover=name&date=YYYY-MM-DD	Fetch Mars Rover photos by rover & date
GET	/api/neows?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD	Fetch NEO asteroid data in date range
GET	/api/library?q=searchTerm	Search NASA Image and Video Library

All endpoints are unauthenticated. Query parameters are required for date-based APIs.

## 🛰 Features

### 1. Astronomy Picture of the Day (APOD)
- Select a date and view NASA’s featured space image.
![APOD Screenshot](./APOD.png)

---

### 2. Earth Polychromatic Imaging Camera (EPIC)
- View Earth satellite images from DSCOVR on a selected date.
- Includes geospatial position and motion data.
![EPIC Screenshot](./EPIC.png)

---

### 3. Mars Rover Photos
- Choose rover (e.g. Curiosity) and Earth date to browse Mars surface photos.
![Mars Rovers](./Mars%20Rovers.png)

---

### 4. Near Earth Object Web Service (NeoWs)
- Check approaching asteroids and their estimated size, distance, and danger level.
![NeoWs Screenshot](./NeoWs.png)

---

### 5. NASA Image and Video Library
- Search for historical photos and videos from NASA's open archive.
![Library Screenshot](./Library.png)
![Library Modal](./Library2.png)

---

## ⚙️ How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nasa-explorer.git
cd nasa-explorer

##⚠️ Notes
The free NASA APIs sometimes fail due to rate limits or missing data for selected dates. This is expected behavior.

Make sure your API key is valid and not expired.

Render free-tier may take 20-30s cold start time.
