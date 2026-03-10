import csv
import json
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from utils import parse_date, parse_amount

def process_payments():
    csv_dir = os.path.join(os.path.dirname(__file__), '../../csv')
    payments = []
    
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
            
            for row in reader:
                pago = parse_amount(row.get('Pago', '0'))
                fecha = row.get('Fecha', '').strip()
                
                if pago > 0 and fecha and '-' in fecha:
                    payment_date = parse_date(fecha)
                    if payment_date:
                        payments.append({
                            'user_name': user_name,
                            'loan_suffix': loan_suffix,
                            'paid_amount': pago,
                            'payment_date': payment_date
                        })
        
        user_payments = [p for p in payments if p['user_name'] == user_name and p['loan_suffix'] == loan_suffix]
        print(f"{user_name}{loan_suffix}: {len(user_payments)} payments")
    
    return json.dumps(payments, indent=2, default=str)

if __name__ == '__main__':
    print(process_payments())
