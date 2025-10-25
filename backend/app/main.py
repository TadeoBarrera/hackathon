from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="My FastAPI Backend", version="0.1.0")

# CORS (ajusta origins según tu frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # en prod: pon dominios específicos
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Hello FastAPI 👋"}

@app.get("/health")
def health():
    return {"status": "ok"}

from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float
    tags: list[str] = []

@app.post("/items")
def create_item(item: Item):
    return {"received": item}
