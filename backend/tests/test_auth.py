import pytest
from src.app import app
import json

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_register_user(client):
    """Test user registration endpoint"""
    response = client.post('/api/auth/register', json={
        'email': 'test@example.com',
        'password': 'testpassword123'
    })
    assert response.status_code == 201
    assert 'token' in json.loads(response.data)

def test_login_user(client):
    """Test user login endpoint"""
    # First register a user
    client.post('/api/auth/register', json={
        'email': 'test2@example.com',
        'password': 'testpassword123'
    })
    
    # Then try to login
    response = client.post('/api/auth/login', json={
        'email': 'test2@example.com',
        'password': 'testpassword123'
    })
    assert response.status_code == 200
    assert 'token' in json.loads(response.data)

def test_invalid_login(client):
    """Test login with invalid credentials"""
    response = client.post('/api/auth/login', json={
        'email': 'nonexistent@example.com',
        'password': 'wrongpassword'
    })
    assert response.status_code == 401
