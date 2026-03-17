import os
from typing import Annotated, TypeAlias
from fastapi import Depends, FastAPI, HTTPException, Query
from sqlmodel import Field, Session, SQLModel, create_engine, select

from functions.utils import get_doppler_secret

engine = None

def get_engine():
    global engine
    if engine is not None:
        return engine
    
    db_url = get_doppler_secret('DATABASE_URL', os.environ.get('DATABASE_URL'))
    if not db_url:
        raise ValueError("DATABASE_URL not found in Doppler or environment variables")
    
    db_password = get_doppler_secret('DATABASE_PASSWORD', os.environ.get('DB_PASSWORD'))
    if not db_password:
        raise ValueError("DATABASE_PASSWORD not found in Doppler or environment variables")
    
    url_with_password = db_url.replace('[YOUR-PASSWORD]', db_password) if '[YOUR-PASSWORD]' in db_url else db_url
    engine = create_engine(url_with_password)
    return engine

def create_db_and_tables():
    SQLModel.metadata.create_all(get_engine())

def get_session():
    with Session(get_engine()) as session:
        yield session

SessionDep: TypeAlias = Annotated[Session, Depends(get_session)]
