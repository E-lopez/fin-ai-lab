from fastapi.testclient import TestClient

def test_create_payment_allocation(client: TestClient):
    borrower_response = client.post(
        "/borrowers/",
        json={
            "name": "Allocation Borrower",
            "email": "allocation@example.com",
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
    
    schedule_response = client.post(
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
    schedule_id = schedule_response.json()["id"]
    
    payment_response = client.post(
        "/payments/",
        json={
            "loan_id": loan_id,
            "paid_amount": "850.00",
            "payment_date": "2024-02-01"
        }
    )
    payment_id = payment_response.json()["id"]
    
    response = client.post(
        "/payment_allocations/",
        json={
            "payment_id": payment_id,
            "schedule_id": schedule_id,
            "allocated_principal": "800.00",
            "allocated_interest": "50.00",
            "allocated_fees": "0.00"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["payment_id"] == payment_id
    assert data["schedule_id"] == schedule_id

def test_get_allocations_by_payment_id(client: TestClient):
    borrower_response = client.post(
        "/borrowers/",
        json={
            "name": "Allocation Test",
            "email": "allocationtest@example.com",
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
    
    schedule_response = client.post(
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
    schedule_id = schedule_response.json()["id"]
    
    payment_response = client.post(
        "/payments/",
        json={
            "loan_id": loan_id,
            "paid_amount": "20.00",
            "payment_date": "2024-02-01"
        }
    )
    payment_id = payment_response.json()["id"]
    
    response = client.get(f"/payment_allocations/payment/{payment_id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
