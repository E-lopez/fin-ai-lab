from fastapi.testclient import TestClient
from datetime import date

def test_create_loan(client: TestClient):
    borrower_response = client.post(
        "/borrowers/",
        json={
            "name": "Loan Borrower",
            "email": "loanborrower@example.com",
            "gender": "male"
        }
    )
    borrower_id = borrower_response.json()["id"]
    
    response = client.post(
        "/loans/",
        json={
            "borrower_id": borrower_id,
            "principal": "10000.00",
            "interest_rate": "0.05",
            "amortization_type": "french",
            "payment_frequency": "monthly",
            "term_months": 12,
            "start_date": "2024-01-01",
            "status": "active"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["borrower_id"] == borrower_id
    assert float(data["principal"]) == 10000.00
    assert "id" in data

def test_get_loans(client: TestClient):
    borrower_response = client.post(
        "/borrowers/",
        json={
            "name": "Test Borrower",
            "email": "testborrower@example.com",
            "gender": "female"
        }
    )
    borrower_id = borrower_response.json()["id"]
    
    client.post(
        "/loans/",
        json={
            "borrower_id": borrower_id,
            "principal": "5000.00",
            "interest_rate": "0.03",
            "amortization_type": "bullet",
            "payment_frequency": "monthly",
            "term_months": 6,
            "start_date": "2024-01-01"
        }
    )
    
    response = client.get(f"/loans/?borrower_id={borrower_id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1

def test_get_loan_by_id(client: TestClient):
    borrower_response = client.post(
        "/borrowers/",
        json={
            "name": "Another Borrower",
            "email": "another@example.com",
            "gender": "male"
        }
    )
    borrower_id = borrower_response.json()["id"]
    
    loan_response = client.post(
        "/loans/",
        json={
            "borrower_id": borrower_id,
            "principal": "15000.00",
            "interest_rate": "0.04",
            "amortization_type": "french",
            "payment_frequency": "monthly",
            "term_months": 24,
            "start_date": "2024-01-01"
        }
    )
    loan_id = loan_response.json()["id"]
    
    response = client.get(f"/loans/{loan_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == loan_id

def test_get_loans_by_status(client: TestClient):
    borrower_response = client.post(
        "/borrowers/",
        json={
            "name": "Status Test",
            "email": "status@example.com",
            "gender": "female"
        }
    )
    borrower_id = borrower_response.json()["id"]
    
    client.post(
        "/loans/",
        json={
            "borrower_id": borrower_id,
            "principal": "8000.00",
            "interest_rate": "0.06",
            "amortization_type": "interest_only",
            "payment_frequency": "quarterly",
            "term_months": 12,
            "start_date": "2024-01-01",
            "status": "active"
        }
    )
    
    response = client.get("/loans/status/active")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert all(loan["status"] == "active" for loan in data)

def test_disburse_loan(client: TestClient):
    borrower_response = client.post(
        "/borrowers/",
        json={
            "name": "Disburse Test",
            "email": "disburse@example.com",
            "gender": "male"
        }
    )
    borrower_id = borrower_response.json()["id"]
    
    loan_response = client.post(
        "/loans/",
        json={
            "borrower_id": borrower_id,
            "principal": "20000.00",
            "interest_rate": "0.05",
            "amortization_type": "french",
            "payment_frequency": "monthly",
            "term_months": 36,
            "start_date": "2024-01-01",
            "status": "active"
        }
    )
    loan_id = loan_response.json()["id"]
    
    response = client.post(
        f"/loans/{loan_id}/disburse?disbursement_date=2024-02-01"
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "disbursed"
