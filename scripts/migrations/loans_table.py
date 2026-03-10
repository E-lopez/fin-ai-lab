import csv
import json
import os
import re
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils import parse_date, parse_amount, find_user_loan_files

def get_interest_rate(user_name, csv_dir, loan_suffix=''):
    """Extract interest rate from dashboard CSV files as decimal (e.g., 0.24 for 24%)"""
    patterns = [
        f"mainDashboard - {user_name}{loan_suffix}.csv",
        f"expiredDashboard - {user_name}{loan_suffix}.csv"
    ]
    
    for pattern in patterns:
        file_path = os.path.join(csv_dir, pattern)
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8-sig') as f:
                for line in f:
                    if 'Tasa de interes' in line:
                        match = re.search(r'(\d+)%', line)
                        if match:
                            rate = float(match.group(1)) / 100
                            print(f"{user_name}{loan_suffix}: interest_rate={rate}")
                            return rate
    print(f"{user_name}{loan_suffix}: No rate found, skipping")
    return None

def get_term_months_from_dashboard(user_name, csv_dir, loan_suffix=''):
    """Extract term_months from 'n' or 'per' column in dashboard CSV"""
    patterns = [
        f"mainDashboard - {user_name}{loan_suffix}.csv",
        f"expiredDashboard - {user_name}{loan_suffix}.csv"
    ]
    
    for pattern in patterns:
        file_path = os.path.join(csv_dir, pattern)
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8-sig') as f:
                reader = csv.reader(f)
                header = next(reader)
                n_col = None
                for i, col in enumerate(header):
                    if col.strip().lower() in ['n', 'per']:
                        n_col = i
                        break
                
                if n_col is not None:
                    count = 0
                    for row in reader:
                        if n_col < len(row):
                            val = row[n_col].strip()
                            # Count if it's a digit or a date pattern (e.g., 'Ene-26')
                            if val.isdigit() or (val and '-' in val and len(val.split('-')) == 2):
                                count += 1
                    if count > 0:
                        print(f"{user_name}{loan_suffix}: term_months={count}")
                        return count
    return None

def process_loans():
    csv_path = os.path.join(os.path.dirname(__file__), '../../csv/loans.csv')
    csv_dir = os.path.join(os.path.dirname(__file__), '../../csv')

    
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        loans = []
        for row in reader:
            user_name = row['User']
            
            # Find all loan files for this user
            loan_suffixes = find_user_loan_files(user_name, csv_dir)
            
            if not loan_suffixes:
                print(f"{user_name}: No dashboard files found, skipping")
                continue
            
            # Process each loan file
            for suffix in loan_suffixes:
                interest_rate = get_interest_rate(user_name, csv_dir, suffix)
                
                if interest_rate is None:
                    print(f"Skipping {user_name}{suffix} - no interest rate found")
                    continue
                
                term_months = get_term_months_from_dashboard(user_name, csv_dir, suffix)
                if term_months is None:
                    print(f"Skipping {user_name}{suffix} - no term_months found in dashboard")
                    continue
                
                loans.append({
                    'user_name': user_name,
                    'loan_suffix': suffix,
                    'principal': parse_amount(row['Amount']),
                    'interest_rate': interest_rate,
                    'amortization_type': row['amortization_type'].lower() if row['amortization_type'] else 'unknown',
                    'payment_frequency': 'monthly',
                    'term_months': term_months,
                    'start_date': parse_date(row['Start']),
                    'status': row['Status'].lower() if row['Status'] else 'active'
                })
    
    return json.dumps(loans, indent=2, default=str)

if __name__ == '__main__':
    print(process_loans())