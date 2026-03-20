import os
import sys

import pytest
from fastapi.testclient import TestClient
from scripts.utils import get_doppler_secret
from sqlmodel import Session, SQLModel, create_engine, text
from sqlmodel.pool import StaticPool
from main import app
from dependencies.db_client import get_session

@pytest.fixture(name="session")
def session_fixture(request):
    """
    Dynamic fixture that switches between SQLite and Read-Only Postgres
    based on the @pytest.mark.database marker.
    """
    # Check if the test has the "database" marker
    marker = request.node.get_closest_marker("database")
    
    if marker:
        # STRATEGY A: Read-Only Dev Database
        db_url = get_doppler_secret('DATABASE_URL', os.environ.get('DATABASE_URL'))
        if not db_url:
            raise ValueError("DATABASE_URL not found in Doppler or environment variables")
        
        db_password = get_doppler_secret('DATABASE_PASSWORD', os.environ.get('DB_PASSWORD'))
        if not db_password:
            raise ValueError("DATABASE_PASSWORD not found in Doppler or environment variables")
        
        url_with_password = db_url.replace('[YOUR-PASSWORD]', db_password) if '[YOUR-PASSWORD]' in db_url else db_url
        engine = create_engine(url_with_password)
        connection = engine.connect()
        # Ensure the session cannot write/delete anything
        connection.execute(text("SET SESSION CHARACTERISTICS AS TRANSACTION READ ONLY"))
        session = Session(bind=connection)
        yield session
        session.close()
        connection.close()
    else:
        # STRATEGY B: In-Memory SQLite (Default)
        engine = create_engine(
            "sqlite:///:memory:",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        SQLModel.metadata.create_all(engine)
        with Session(engine) as session:
            yield session

@pytest.fixture(name="client")
def client_fixture(session: Session):
    def get_session_override():
        yield session

    app.dependency_overrides[get_session] = get_session_override
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()