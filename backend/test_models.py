import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, get_db
from models import User

# SQLite in-memory database voor de tests
SQLALCHEMY_DATABASE_URL = "sqlite:///testing.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

def test_create_user(db):
    new_user = User(username="testuser", hashed_password="hashedpassword")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    assert new_user.id is not None
    assert new_user.username == "testuser"
    assert new_user.hashed_password == "hashedpassword"

def test_get_user(db):
    new_user = User(username="testuser", hashed_password="hashedpassword")
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    user = db.query(User).filter(User.username == "testuser").first()
    assert user is not None
    assert user.username == "testuser"
    assert user.hashed_password == "hashedpassword"
