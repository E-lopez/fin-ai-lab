import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from utils import get_doppler_secret
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

def get_engine():
    db_url = get_doppler_secret('DATABASE_URL', os.environ.get('DATABASE_URL'))
    db_password = get_doppler_secret('DATABASE_PASSWORD', os.environ.get('DB_PASSWORD'))
    url_with_password = db_url.replace('[YOUR-PASSWORD]', db_password) if '[YOUR-PASSWORD]' in db_url else db_url
    if not url_with_password:
        raise ValueError("DATABASE_URL variable not found")
    return create_engine(url_with_password)

def get_session():
    engine = get_engine()
    Session = sessionmaker(bind=engine)
    return Session()