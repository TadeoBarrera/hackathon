# db.py
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

load_dotenv()

# Permite dos formas: URL completa o parámetros separados
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"postgresql+asyncpg://{os.getenv('PGUSER','postgres')}:{os.getenv('PGPASSWORD','')}"
    f"@{os.getenv('PGHOST','localhost')}:{os.getenv('PGPORT','5432')}/{os.getenv('PGDATABASE','hackaton')}"
)

engine = create_async_engine(DATABASE_URL, echo=False, pool_pre_ping=True)
SessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_session() -> AsyncSession:
    async with SessionLocal() as session:
        yield session
