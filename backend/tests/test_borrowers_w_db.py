import pytest
import logging

# List of real IDs from your Dev DB
BORROWER_IDS = [
    {"id": "29cfc8aa-33fd-42b7-b50d-d2485f884573", "name": "Diana_Lopez", "assertion": "active"},
    {"id": "d8f289e2-7e94-4f9b-ba25-f3e7393d70d4", "name": "Danielea_Bolivar", "assertion": "inactive"},
    {"id": "06af5c22-04e5-4328-883a-730ea68a2965", "name": "G_Bolivar", "assertion": "active"},
    {"id": "a8f0fe51-df99-4079-8fff-55a617f3c7fd", "name": "D_alba", "assertion": "inactive"},
    {"id": "3a910d88-9323-4a38-bff0-82f7720902cd", "name": "A_Mogollon", "assertion": "active"},
    {"id": "1f9ae342-10a0-42ff-b43c-6f97c890b193", "name": "S_Guevara", "assertion": "active"},
    {"id": "7888a5ac-fae0-4696-a56e-31a7f205698e", "name": "A_Ramos", "assertion": "active"},
    {"id": "31be170b-085d-43c1-b8ee-5ad821adcbbb", "name": "H_Leon", "assertion": "active"},
]

@pytest.mark.database
@pytest.mark.parametrize("borrower_data", BORROWER_IDS)
def test_next_payment_with_real_dev_data(client, borrower_data):
    # This uses the Read-Only Postgres Dev DB
    response = client.get(f"/borrowers/{borrower_data['id']}/next-payment")

    logging.info(f"Response from /next-payment: {borrower_data['name']} | {response.json()}")

    assert response.status_code == 200
    # Add assertions for known values in your Dev DB
    if borrower_data["assertion"] == "inactive":
        assert response.json() == {"message": "All loans are fully paid or no active loans found."}
    else:
        assert "amount_due" in response.json()
        assert "due_date" in response.json()
        assert "status" in response.json()