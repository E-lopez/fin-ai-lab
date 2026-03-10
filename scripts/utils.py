import os
import requests
import logging
import csv
from datetime import datetime

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

def parse_date(date_str, day=1):
    """Convert 'Dec-23' format to date object"""
    month_map = {
        'jan': 1, 'feb': 2, 'mar': 3, 'apr': 4, 'may': 5, 'jun': 6,
        'jul': 7, 'aug': 8, 'sep': 9, 'oct': 10, 'nov': 11, 'dec': 12,
        'ene': 1, 'abr': 4, 'ago': 8, 'dic': 12
    }
    parts = date_str.split('-')
    month = month_map[parts[0].lower()]
    year = 2000 + int(parts[1])
    return datetime(year, month, day).date()

def parse_amount(amount_str):
    """Convert '$4,580,000.00' or '1.666.66667' to 4580000.00"""
    if not amount_str or amount_str.strip() == '' or amount_str == '$0.00' or amount_str == '$ -':
        return 0.0
    cleaned = amount_str.replace('$', '').replace(',', '').replace(' ', '').strip()
    if cleaned.count('.') > 1:
        cleaned = cleaned.replace('.', '', cleaned.count('.') - 1)
    return float(cleaned)

def find_user_loan_files(user_name, csv_dir):
    """Find all loan files for a user including roman numeral suffixes"""
    loan_files = []
    
    # Check for base file (no suffix)
    for prefix in ['mainDashboard - ', 'expiredDashboard - ']:
        base_file = f"{prefix}{user_name}.csv"
        if os.path.exists(os.path.join(csv_dir, base_file)):
            loan_files.append('')
            break
    
    # Check for files with suffixes (_II, _III, _IV, etc.)
    roman_numerals = ['_II', '_III', '_IV', '_V', '_VI', '_VII', '_VIII', '_IX', '_X', '_feb-26']
    for suffix in roman_numerals:
        for prefix in ['mainDashboard - ', 'expiredDashboard - ']:
            file_name = f"{prefix}{user_name}{suffix}.csv"
            if os.path.exists(os.path.join(csv_dir, file_name)):
                if suffix not in loan_files:
                    loan_files.append(suffix)
                break
    
    return loan_files

def get_loan_amortization_type(user_name, csv_dir, loan_suffix=''):
    """Detect amortization type: bullet (principal paid at end) or french (amortized)"""
    patterns = [
        f"mainDashboard - {user_name}{loan_suffix}.csv",
        f"expiredDashboard - {user_name}{loan_suffix}.csv"
    ]
    
    for pattern in patterns:
        file_path = os.path.join(csv_dir, pattern)
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                principal_payments = []
                
                for row in reader:
                    month = row.get('Month', '').strip()
                    if month and '-' in month:
                        principal = parse_amount(row.get('Pago Capital', '0'))
                        principal_payments.append(principal)
                
                if len(principal_payments) > 0:
                    non_zero_count = sum(1 for p in principal_payments if p > 0)
                    if non_zero_count <= 1:
                        return 'bullet'
                    else:
                        return 'french'
    
    return 'french'