import os
import requests
import logging

logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)

def get_doppler_secret(key, default=None):
    """Get secret from Doppler API"""
    token = os.environ.get('DOPPLER_TOKEN')
    if not token:
        return default
    
    try:
        response = requests.get(
            'https://api.doppler.com/v3/configs/config/secrets/download',
            headers={'Authorization': f'Bearer {token}'},
            params={'format': 'json'}
        )
        response.raise_for_status()
        secrets = response.json()
        return secrets.get(key, default)
    except Exception as e:
        logger.error(f"Error getting Doppler secret {key}: {e}")
        return default