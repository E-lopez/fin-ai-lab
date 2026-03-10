import csv
import json
import os

def process_borrowers():
    csv_path = os.path.join(os.path.dirname(__file__), '../../csv/borrowers.csv')
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        seen_emails = set()
        borrowers = []

        for row in reader:
            email = row['email']
            print(f"Processing borrower: {row['name']} with email: {email}")
            if email not in seen_emails:
                borrowers.append({
                    'name': row['name'],
                    'email': email,
                    'gender': row['gender'],
                    'orgName': row['orgName'] if row['orgName'] != 'N/A' else None
                })
                seen_emails.add(email)
    return json.dumps(borrowers, indent=2)

if __name__ == '__main__':
    print(process_borrowers())
