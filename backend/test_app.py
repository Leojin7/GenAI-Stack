from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For testing only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello, World!"}

@app.post("/api/auth/test")
async def test_auth():
    return {"status": "success", "message": "Auth test endpoint works!"}

if __name__ == "__main__":
    print("Starting test server on http://localhost:8000")
    print("Test endpoints:")
    print("  GET  /")
    print("  POST /api/auth/test")
    uvicorn.run("test_app:app", host="0.0.0.0", port=8000, reload=True)
