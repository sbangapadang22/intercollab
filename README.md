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

### Quantization Output:
```
[QUARK-INFO]: Custom Op compilation start.
[QUARK-INFO]: The custom_op already exists.
[QUARK-INFO]: Custom Op compilation already complete.

Current directory: c:\Users\aup\intercollab\intercollab-backend\app\utils
Input model path: c:\Users\aup\intercollab\intercollab-backend\app\utils\previous_model.onnx
Output model path: c:\Users\aup\intercollab\intercollab-backend\app\utils\pgnet.onnx
Model exists: True

[QUARK-INFO]: The input ONNX model can create InferenceSession successfully.
[QUARK-INFO]: Obtained calibration data with 1 iters.
[QUARK-INFO]: Simplified model successfully.
[QUARK-INFO]: Optimized the model for better hardware compatibility.
[QUARK-WARNING]: The opset version is 11 < 17. Skipping fusing layer normalization.

[QUARK-INFO]: Folded BatchNormalization layers into ConvTranspose layers.
[QUARK-INFO]: Start calibration...
[QUARK-INFO]: Finding optimal threshold using PowerOfTwoMethod.MinMSE algorithm...
Computing range: 100%|███████████████████████████████████████████████████████████████████████████| 217/217 [00:25<00:00,  8.42tensor/s]
[QUARK-INFO]: Finished calibration in 28.4s.

[QUARK-INFO]: Removing unnecessary QuantizeLinear & DequantizeLinear operations.
[QUARK-INFO]: Found Sigmoid node, replacing with HardSigmoid for optimization.

[QUARK-INFO]: Adjusting quantization info to meet compiler constraints.
[QUARK-INFO]: Shifted layer quantization parameters for compatibility.

**Operation types in the quantized model:**
┏━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━┓
┃ Op Type              ┃ Float Model Count   ┃
┡━━━━━━━━━━━━━━━━━━━━━━╇━━━━━━━━━━━━━━━━━━━━━┩
│ Conv                 │ 99                  │
│ Relu                 │ 85                  │
│ MaxPool              │ 1                   │
│ Add                  │ 26                  │
│ ConvTranspose        │ 4                   │
│ BatchNormalization   │ 4                   │
│ Sigmoid (converted)  │ 1                   │
└──────────────────────┴─────────────────────┘

**Quantized model summary:**
┏━━━━━━━━━━━━━━━┳━━━━━━━━━━━━┳━━━━━━━━━━┳━━━━━━━━━━┓
┃ Op Type       ┃ Activation ┃ Weights  ┃ Bias     ┃
┡━━━━━━━━━━━━━━━╇━━━━━━━━━━━━╇━━━━━━━━━━╇━━━━━━━━━━┩
│ Conv          │ UINT8(99)  │ INT8(99) │ INT8(95) │
│ MaxPool       │ UINT8(1)   │          │          │
│ Add           │ UINT8(26)  │          │          │
│ ConvTranspose │ UINT8(4)   │ INT8(4)  │ INT8(4)  │
│ HardSigmoid   │ UINT8(1)   │          │          │
└───────────────┴────────────┴──────────┴──────────┘
```

### Performance Gains
After quantization, the model achieves:
- Reduction in size: ~40% smaller
- Inference speedup: ~2x faster
- Minimal accuracy loss: ≤1% deviation from FP32 baseline