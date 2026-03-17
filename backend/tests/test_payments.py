from fastapi.testclient import TestClient

def test_create_payment(client: TestClient):
    borrower_response = client.post(
        "/borrowers/",
        json={
            "name": "Payment Borrower",
            "email": "payment@example.com",
            "gender": "male"
        }
    )
    borrower_id = borrower_response.json()["id"]
    
    loan_response = client.post(
        "/loans/",
        json={
            "borrower_id": borrower_id,
            "principal": "10000.00",
            "interest_rate": "0.05",
            "amortization_type": "french",
            "payment_frequency": "monthly",
            "term_months": 12,
            "start_date": "2024-01-01"
        }
    )
    loan_id = loan_response.json()["id"]
    
    client.post(
        "/loan_schedules/",
        json={
            "loan_id": loan_id,
            "period": 1,
            "due_date": "2024-02-01",
            "scheduled_principal": "800.00",
            "scheduled_interest": "50.00",
            "scheduled_fees": "0.00"
        }
    )
    
    response = client.post(
        "/payments/",
        json={
            "loan_id": loan_id,
            "paid_amount": "850.00",
            "payment_date": "2024-02-01"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["loan_id"] == loan_id
    assert float(data["paid_amount"]) == 850.00

def test_get_payments_by_loan_id(client: TestClient):
    borrower_response = client.post(
        "/borrowers/",
        json={
            "name": "Payment Test",
            "email": "paymenttest@example.com",
            "gender": "female"
        }
    )
    borrower_id = borrower_response.json()["id"]
    
    loan_response = client.post(
        "/loans/",
        json={
            "borrower_id": borrower_id,
            "principal": "5000.00",
            "interest_rate": "0.04",
            "amortization_type": "bullet",
            "payment_frequency": "monthly",
            "term_months": 6,
            "start_date": "2024-01-01"
        }
    )
    loan_id = loan_response.json()["id"]
    
    client.post(
        "/loan_schedules/",
        json={
            "loan_id": loan_id,
            "period": 1,
            "due_date": "2024-02-01",
            "scheduled_principal": "0.00",
            "scheduled_interest": "20.00",
            "scheduled_fees": "0.00"
        }
    )
    
    client.post(
        "/payments/",
        json={
            "loan_id": loan_id,
            "paid_amount": "20.00",
            "payment_date": "2024-02-01"
        }
    )
    
    response = client.get(f"/payments/loan/{loan_id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1

def test_reverse_payment(client: TestClient):
    borrower_response = client.post(
        "/borrowers/",
        json={
            "name": "Reverse Test",
            "email": "reverse@example.com",
            "gender": "male"
        }
    )
    borrower_id = borrower_response.json()["id"]
    
    loan_response = client.post(
        "/loans/",
        json={
            "borrower_id": borrower_id,
            "principal": "8000.00",
            "interest_rate": "0.03",
            "amortization_type": "french",
            "payment_frequency": "monthly",
            "term_months": 12,
            "start_date": "2024-01-01"
        }
    )
    loan_id = loan_response.json()["id"]
    
    client.post(
        "/loan_schedules/",
        json={
            "loan_id": loan_id,
            "period": 1,
            "due_date": "2024-02-01",
            "scheduled_principal": "650.00",
            "scheduled_interest": "24.00",
            "scheduled_fees": "0.00"
        }
    )
    
    payment_response = client.post(
        "/payments/",
        json={
            "loan_id": loan_id,
            "paid_amount": "674.00",
            "payment_date": "2024-02-01"
        }
    )
    payment_id = payment_response.json()["id"]
    
    response = client.delete(f"/payments/{payment_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["payment_id"] == payment_id

def test_get_daily_payment_stats(client: TestClient):
    response = client.get("/payments/stats/daily?target_date=2024-01-15")
    assert response.status_code == 200
    data = response.json()
    assert "total_collections" in data
    assert "number_of_payments" in data

def test_get_monthly_payment_stats(client: TestClient):
    response = client.get("/payments/stats/monthly?year=2024&month=1")
    assert response.status_code == 200
    data = response.json()
    assert "total_collections" in data
    assert "number_of_payments" in data
