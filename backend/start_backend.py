from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import routers after CORS is set up
from chat.router import router as chat_router
app.include_router(chat_router)

if __name__ == "__main__":
    uvicorn.run("start_backend:app", host="0.0.0.0", port=8000, reload=True)
