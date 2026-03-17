from fastapi.testclient import TestClient
from sqlmodel import Session

def test_create_borrower(client: TestClient):
    response = client.post(
        "/borrowers/",
        json={
            "name": "John Doe",
            "email": "john@example.com",
            "gender": "male",
            "orgName": "Test Org"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "John Doe"
    assert data["email"] == "john@example.com"
    assert "id" in data

def test_read_borrowers(client: TestClient):
    client.post(
        "/borrowers/",
        json={
            "name": "Jane Doe",
            "email": "jane@example.com",
            "gender": "female"
        }
    )
    
    response = client.get("/borrowers/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1

def test_get_borrower_by_id(client: TestClient):
    create_response = client.post(
        "/borrowers/",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "gender": "other"
        }
    )
    borrower_id = create_response.json()["id"]
    
    response = client.get(f"/borrowers/{borrower_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == borrower_id
    assert data["name"] == "Test User"

def test_get_borrower_by_id_not_found(client: TestClient):
    response = client.get("/borrowers/00000000-0000-0000-0000-000000000000")
    assert response.status_code == 404

def test_search_borrowers(client: TestClient):
    client.post(
        "/borrowers/",
        json={
            "name": "Alice Smith",
            "email": "alice@example.com",
            "gender": "female",
            "orgName": "Smith Corp"
        }
    )
    
    response = client.get("/borrowers/search?query=Alice")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert any(b["name"] == "Alice Smith" for b in data)

def test_update_borrower(client: TestClient):
    create_response = client.post(
        "/borrowers/",
        json={
            "name": "Old Name",
            "email": "old@example.com",
            "gender": "male"
        }
    )
    borrower_id = create_response.json()["id"]
    
    response = client.patch(
        f"/borrowers/{borrower_id}",
        json={"name": "New Name"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "New Name"
    assert data["email"] == "old@example.com"
