from fastapi.testclient import TestClient

def test_create_loan_schedule(client: TestClient):
    borrower_response = client.post(
        "/borrowers/",
        json={
            "name": "Schedule Borrower",
            "email": "schedule@example.com",
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
    
    response = client.post(
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
    assert response.status_code == 200
    data = response.json()
    assert data["loan_id"] == loan_id
    assert data["period"] == 1

def test_get_loan_schedule_by_loan_id(client: TestClient):
    borrower_response = client.post(
        "/borrowers/",
        json={
            "name": "Schedule Test",
            "email": "scheduletest@example.com",
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
    
    response = client.get(f"/loan_schedules/loan/{loan_id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1

def test_get_loan_schedule_by_id(client: TestClient):
    borrower_response = client.post(
        "/borrowers/",
        json={
            "name": "Schedule ID Test",
            "email": "scheduleid@example.com",
            "gender": "male"
        }
    )
    borrower_id = borrower_response.json()["id"]
    
    loan_response = client.post(
        "/loans/",
        json={
            "borrower_id": borrower_id,
            "principal": "7000.00",
            "interest_rate": "0.03",
            "amortization_type": "french",
            "payment_frequency": "monthly",
            "term_months": 12,
            "start_date": "2024-01-01"
        }
    )
    loan_id = loan_response.json()["id"]
    
    schedule_response = client.post(
        "/loan_schedules/",
        json={
            "loan_id": loan_id,
            "period": 1,
            "due_date": "2024-02-01",
            "scheduled_principal": "580.00",
            "scheduled_interest": "21.00",
            "scheduled_fees": "0.00"
        }
    )
    schedule_id = schedule_response.json()["id"]
    
    response = client.get(f"/loan_schedules/{schedule_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == schedule_id

def test_get_next_scheduled_amounts(client: TestClient):
    borrower_response = client.post(
        "/borrowers/",
        json={
            "name": "Next Amount Test",
            "email": "nextamount@example.com",
            "gender": "female"
        }
    )
    borrower_id = borrower_response.json()["id"]
    
    loan_response = client.post(
        "/loans/",
        json={
            "borrower_id": borrower_id,
            "principal": "12000.00",
            "interest_rate": "0.05",
            "amortization_type": "french",
            "payment_frequency": "monthly",
            "term_months": 24,
            "start_date": "2024-01-01"
        }
    )
    loan_id = loan_response.json()["id"]
    
    client.post(
        "/loan_schedules/",
        json={
            "loan_id": loan_id,
            "period": 1,
            "due_date": "2025-02-01",
            "scheduled_principal": "500.00",
            "scheduled_interest": "50.00",
            "scheduled_fees": "0.00"
        }
    )
    
    response = client.get(f"/loan_schedules/loan/{loan_id}/next-scheduled-amounts")
    assert response.status_code == 200
    data = response.json()
    assert "principal" in data
    assert "interest" in data
    assert "fees" in data
