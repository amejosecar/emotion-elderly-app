#C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\test\test_auth.py
# test_auth.py
# backend/tests/test_auth.py

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.session import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash, create_access_token

client = TestClient(app)

@pytest.fixture(scope="module")
def test_user():
    db = SessionLocal()
    email = "test@example.com"
    password = "test123"
    hashed = get_password_hash(password)
    user = User(email=email, hashed_password=hashed, is_active=True)
    db.add(user)
    db.commit()
    db.refresh(user)
    yield {"email": email, "password": password, "id": user.id}
    db.delete(user)
    db.commit()
    db.close()

def test_login_success(test_user):
    response = client.post("/auth/login", data={
        "username": test_user["email"],
        "password": test_user["password"]
    })
    assert response.status_code == 200
    assert "access_token" in response.json()

def test_login_fail():
    response = client.post("/auth/login", data={
        "username": "wrong@example.com",
        "password": "wrongpass"
    })
    assert response.status_code == 401

def test_protected_route_without_token():
    response = client.get("/audios")
    assert response.status_code == 401

def test_protected_route_with_token(test_user):
    token = create_access_token({"sub": str(test_user["id"])})
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("/audios", headers=headers)
    assert response.status_code == 200

def test_refresh_token(test_user):
    token = create_access_token({"sub": str(test_user["id"])})
    headers = {"Authorization": f"Bearer {token}"}
    response = client.post("/auth/refresh", headers=headers)
    assert response.status_code == 200
    assert "access_token" in response.json()

