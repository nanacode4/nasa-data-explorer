# 🚀 NASA Explorer

Explore NASA’s open APIs with React frontend and Express backend.

## 🌐 Live Demo

- **Frontend**: [https://nasa-frontend-kpp6.onrender.com](https://nasa-frontend-kpp6.onrender.com)  
- **Backend**: [https://nasa-backend-6asb.onrender.com](https://nasa-backend-6asb.onrender.com)



## 🔧 Tech Stack

- **Frontend**: React + Bootstrap
- **Backend**: Node.js + Express
- **API**: [NASA Open APIs](https://api.nasa.gov/)
- **Hosting**: Render



## ✅ Public API Routes (Proxy to NASA Open APIs)

| Method | Endpoint                                                              | Description                                      |
|--------|-----------------------------------------------------------------------|--------------------------------------------------|
| GET    | `/api/apod?date=YYYY-MM-DD`                                           | Fetch Astronomy Picture of the Day by date       |
| GET    | `/api/epic?date=YYYY-MM-DD`                                           | Fetch Earth EPIC satellite data by date          |
| GET    | `/api/mars?rover=name&date=YYYY-MM-DD`                                | Fetch Mars Rover photos by rover & date          |
| GET    | `/api/neows?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD`               | Fetch NEO asteroid data in date range            |
| GET    | `/api/library?q=searchTerm`                                           | Search NASA Image and Video Library              |

> All endpoints are unauthenticated. Query parameters are required for date-based APIs.



## 🛠️ API Endpoint Details (Backend Logic from `server.js`)

| Method | Endpoint       | Description                                |
|--------|----------------|--------------------------------------------|
| GET    | `/api/apod`    | Proxy to NASA's Astronomy Picture API      |
| GET    | `/api/epic`    | Proxy to NASA's EPIC satellite API         |
| GET    | `/api/mars`    | Proxy to NASA's Mars Rover Photo API       |
| GET    | `/api/neows`   | Proxy to NASA's NEO Web Service            |
| GET    | `/api/library` | Proxy to NASA's Image & Video Search API   |

---

## 🛰 Features Overview

### 1. Astronomy Picture of the Day (APOD)
Select a date and view NASA’s featured space image.  
<img src="frontend/src/assets/APOD.png" alt="APOD Screenshot" height="500" />


---

### 2. Earth Polychromatic Imaging Camera (EPIC)
View Earth satellite images from DSCOVR on a selected date, including geospatial and motion data.  
<img src="frontend/src/assets/EPIC.png" alt="EPIC Screenshot"  height="600" />


---

### 3. Mars Rover Photos
Choose a rover (e.g. Curiosity) and Earth date to browse high-res Mars surface images.  
<img src="frontend/src/assets/Mars%20Rovers.png" alt="Mars Rovers"  height="600" />

---

### 4. Near Earth Object Web Service (NeoWs)
Check upcoming asteroid passes with size, distance, and danger indicators.  
<img src="frontend/src/assets/NeoWs.png" alt="NeoWs Screenshot"  height="500" />

---

### 5. NASA Image and Video Library
Search historical photos and videos from NASA’s rich multimedia archive.  
<img src="frontend/src/assets/Library.png" alt="Library Screenshot"  height="500" />
<img src="frontend/src/assets/Library2.png" alt="Library Modal" height="500" />

---

## ⚙️ How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/nanacode4/nasa-data-explorer.git
cd nasa-data-explorer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run backend

```bash
node server.js
```

### 4. Run frontend

```bash
cd frontend
npm install
npm run dev
```



## ⚠️ Notes

- NASA APIs occasionally fail due to rate limits or missing data for some dates — this is expected.
- Make sure your NASA API key is valid and not expired (stored in `.env`).


