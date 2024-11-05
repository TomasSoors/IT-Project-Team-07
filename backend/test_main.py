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
    assert response.json() == "complete"

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
    assert "access_token" in response.json()

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

def test_verify_token(client):
    # Eerst een gebruiker registreren en inloggen om een token te krijgen
    client.post(
        "/register",
        json={"username": "testuser", "password": "testpassword"},
    )
    login_response = client.post(
        "/login",
        data={"username": "testuser", "password": "testpassword"},
    )
    token = login_response.json()["access_token"]

    # Verifieer de token
    response = client.get(f"/verify-token/{token}")
    assert response.status_code == 200
    assert response.json() == {"message": "token is valid"}

def test_verify_invalid_token(client):
    # Gebruik een ongeldig token
    invalid_token = "invalidtoken123"
    response = client.get(f"/verify-token/{invalid_token}")
    assert response.status_code == 403
