from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.db import engine, get_db
from app.models import Base, role_enum, trash_enum

app = FastAPI(title="Alphabot API", version="0.1.0")


@app.on_event("startup")
def on_startup() -> None:
    # Ensure ENUM types exist before tables to match the pg_dump schema.
    with engine.begin() as connection:
        role_enum.create(connection, checkfirst=True)
        trash_enum.create(connection, checkfirst=True)
        Base.metadata.create_all(bind=connection)


@app.get("/health", tags=["monitoring"])
def healthcheck(db: Session = Depends(get_db)):
    # Touch the connection so connection issues surface early.
    db.execute(text("SELECT 1"))
    return {"status": "ok"}
