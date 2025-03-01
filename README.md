# InterCollab: AI-Powered Virtual Whiteboard

InterCollab is an AI-powered virtual whiteboard that enables real-time handwriting recognition and language translation for seamless multilingual collaboration. This project leverages AI inference optimization using AMD Ryzen AI tools.

## **Project Structure**
```
InterCollab/
│── intercollab-backend/        # Backend server (FastAPI, ML models)
│   ├── app/                    # Main application logic
│   │   ├── routes/             # API routes
│   │   │   ├── handwriting.py  # Handwriting recognition API
│   │   │   ├── translation.py  # Translation API
│   │   │   ├── health.py       # Health check API
│   │   ├── services/           # Business logic (handwriting recognition, translation)
│   │   │   ├── handwriting.py  # Handwriting recognition service (placeholder)
│   │   │   ├── translation.py  # Translation service (placeholder)
│   │   ├── models/             # Database models (if applicable)
│   │   ├── utils/              # Helper functions
│   │   ├── config.py           # Configuration settings
│   │   ├── main.py             # FastAPI entry point
│   ├── tests/                  # Backend unit tests
│   ├── requirements.txt        # Python dependencies
│   ├── Dockerfile              # Backend container setup
│
│── intercollab-frontend/       # Frontend (React + TypeScript)
│   ├── src/                    # Source files
│   │   ├── components/         # Reusable components
│   │   ├── pages/              # Views/pages
│   │   │   ├── Home.tsx        # Handwriting recognition UI
│   │   │   ├── Translation.tsx # Translation UI
│   │   ├── assets/             # Static assets
│   │   ├── utils/              # Helper functions
│   │   ├── App.tsx             # Main React component
│   │   ├── index.tsx           # Entry point
│   ├── public/                 # Static public assets (index.html, etc.)
│   ├── package.json            # Frontend dependencies
│   ├── Dockerfile              # Frontend container setup
│
│── docker-compose.yml          # Docker orchestration (backend + frontend)
│── .gitignore                  # Ignore unnecessary files
│── README.md                   # Project documentation
```

## **Setup Instructions**
### **Prerequisites**
- Install [Docker](https://www.docker.com/get-started)
- Install [Node.js](https://nodejs.org/) (for local frontend setup)
- Install [Python 3.10+](https://www.python.org/) (for local backend setup)

### **Running the Project with Docker**
1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-repo/intercollab.git
   cd intercollab
   ```
2. **Build and start containers:**
   ```sh
   docker-compose up --build
   ```
3. **Verify the services:**
   - **Backend:** Open [http://localhost:8000](http://localhost:8000) in a browser or test with:
     ```sh
     curl http://localhost:8000
     ```
   - **Frontend:** Open [http://localhost:3000](http://localhost:3000)


## **Troubleshooting**
### **1. `react-scripts: not found` Error**
- Run inside `intercollab-frontend/`:
  ```sh
  npm install
  ```
- Then restart Docker:
  ```sh
  docker-compose up --build
  ```

### **2. `Attribute "app" not found in module "app.main"` Error**
- Ensure `intercollab-backend/app/main.py` exists and contains:
  ```python
  from fastapi import FastAPI
  app = FastAPI()
  ```
- Then rebuild Docker:
  ```sh
  docker-compose up --build
  ```

### **3. `index.html` Not Found in Frontend**
- Make sure `intercollab-frontend/public/index.html` exists with basic content.
- Then restart the frontend:
  ```sh
  docker-compose up --build
  ```

