import os
import pytest
from fastapi import status
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import app
from database import Base, get_db

# SQLite in-memory database voor de tests
SQLALCHEMY_DATABASE_URL = "sqlite:///testing.db"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="function")
def client():
    with TestClient(app) as c:
        # Database tabellen aanmaken
        Base.metadata.create_all(bind=engine)
        yield c
        # Droppen van de tabellen na de tests
        Base.metadata.drop_all(bind=engine)

def test_register_user(client):
    response = client.post(
        "/register",
        json={"username": "testuser", "password": "testpassword"},
    )
    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "message": "User created successfully",
        "data": {"user_id": 1, "username": "testuser"}
    }


def test_register_user_already_exists(client):
    client.post(
        "/register",
        json={"username": "testuser", "password": "testpassword"},
    )
    response = client.post(
        "/register",
        json={"username": "testuser", "password": "otherpassword"}
    )
    assert response.status_code == 400
    assert response.json() == {
        "detail": {
        "success": False,
        "message": "Username already registered",
        "data": None
        }
    }


def test_login_user(client):
    client.post(
        "/register",
        json={"username": "testuser", "password": "testpassword"},
    )
    response = client.post(
        "/login",
        data={"username": "testuser", "password": "testpassword"},
    )
    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["message"] == "Login successful"
    assert "access_token" in response.json()["data"]


def test_login_user_wrong_password(client):
    client.post(
        "/register",
        json={"username": "testuser", "password": "testpassword"},
    )
    response = client.post(
        "/login",
        data={"username": "testuser", "password": "wrongpassword"},
    )
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    assert response.json() == {
        "detail": {
        "success": False,
        "message": "Incorrect username or password",
        "data": None
        }
    }


def test_verify_token(client):
    client.post(
        "/register",
        json={"username": "testuser", "password": "testpassword"},
    )
    login_response = client.post(
        "/login",
        data={"username": "testuser", "password": "testpassword"},
    )
    token = login_response.json()["data"]["access_token"]

    response = client.get(f"/verify-token/{token}")
    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "message": "Token is valid",
        "data": None
    }


def test_verify_invalid_token(client):
    invalid_token = "invalidtoken123"
    response = client.get(f"/verify-token/{invalid_token}")
    assert response.status_code == 401
    assert response.json() == {
        'detail': 'Token is invalid or expired.'
    }


def test_revoke_token(client):
    client.post("/register", json={"username": "testuser", "password": "testpassword"})
    login_response = client.post("/login", data={"username": "testuser", "password": "testpassword"})
    token = login_response.json()["data"]["access_token"]

    response = client.post(f"/revoke-token/{token}")
    assert response.status_code == 200
    assert response.json() == {
        "success": True,
        "message": "Token has been revoked.",
        "data": None
    }

    verify_response = client.get(f"/verify-token/{token}")
    assert verify_response.status_code == 401
    assert verify_response.json() == {
        'detail': 'Token has been revoked.'
    }


def test_revoke_already_revoked_token(client):
    client.post("/register", json={"username": "testuser", "password": "testpassword"})
    login_response = client.post("/login", data={"username": "testuser", "password": "testpassword"})
    token = login_response.json()["data"]["access_token"]

    client.post(f"/revoke-token/{token}")

    second_revoke_response = client.post(f"/revoke-token/{token}")
    assert second_revoke_response.status_code == 400
    assert second_revoke_response.json() == {
        "detail": {
        "success": False,
        "message": "Token has already been revoked.",
        "data": None
        }
    }
