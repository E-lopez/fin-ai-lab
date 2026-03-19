import csv
import json
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils import parse_date, parse_amount, find_user_loan_files, get_loan_amortization_type

def get_fee_from_dashboard(user_name, csv_dir, loan_suffix=''):
    """Extract fee value from dashboard CSV by finding 'Fee' row"""
    patterns = [
        f"mainDashboard - {user_name}{loan_suffix}.csv",
        f"expiredDashboard - {user_name}{loan_suffix}.csv"
    ]
    
    for pattern in patterns:
        file_path = os.path.join(csv_dir, pattern)
        if not os.path.exists(file_path): 
            return 0
        with open(file_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.reader(f)
            for row in reader:
                if len(row) > 1 and 'fee' in row[0].lower():
                    fee_value = parse_amount(row[1])
                    if fee_value > 0:
                        return fee_value


def process_loan_schedule():
    csv_dir = os.path.join(os.path.dirname(__file__), '../../csv')
    schedules = []
    
    # Get all dashboard files
    for filename in os.listdir(csv_dir):
        if not (filename.startswith('mainDashboard - ') or filename.startswith('expiredDashboard - ')):
            continue
        
        # Extract user_name and suffix
        base_name = filename.replace('mainDashboard - ', '').replace('expiredDashboard - ', '').replace('.csv', '')
        
        # Determine if there's a suffix
        loan_suffix = ''
        user_name = base_name
        for suffix in ['_II', '_III', '_IV', '_V', '_VI', '_VII', '_VIII', '_IX', '_X', '_feb-26']:
            if base_name.endswith(suffix):
                loan_suffix = suffix
                user_name = base_name[:-len(suffix)]
                break
        
        # Handle special cases
        if 'acuerdo_pago_' in base_name:
            user_name = base_name.replace('acuerdo_pago_', '')
            loan_suffix = '_acuerdo'
        
        file_path = os.path.join(csv_dir, filename)
        
        with open(file_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            amortization_type = get_loan_amortization_type(user_name, csv_dir, loan_suffix)
            fee_amount = get_fee_from_dashboard(user_name, csv_dir, loan_suffix)
            period = 0
            
            for row in reader:
                month = row.get('Month', '').strip()
                
                if month and '-' in month:
                    period += 1
                    
                    schedules.append({
                        'user_name': user_name,
                        'loan_suffix': loan_suffix,
                        'period': period,
                        'due_date': parse_date(month, day=10),
                        'scheduled_principal': parse_amount(row.get('Pago Capital', '0')),
                        'scheduled_interest': parse_amount(row.get('Pago Interes', '0')),
                        'scheduled_fees': fee_amount if period == 1 else 0
                    })
        
        user_schedules = [s for s in schedules if s['user_name'] == user_name and s['loan_suffix'] == loan_suffix]
        print(f"{user_name}{loan_suffix}: {len(user_schedules)} schedule entries")
    
    return json.dumps(schedules, indent=2, default=str)

if __name__ == '__main__':
    print(process_loan_schedule())
