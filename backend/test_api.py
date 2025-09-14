#!/usr/bin/env python
"""
Simple API test script for Alumni Connect
Run this after starting the Django server
"""

import requests
import json

BASE_URL = "http://127.0.0.1:8000/api"

def test_api():
    print("Testing Alumni Connect API...")
    
    # Test 1: Register a new user
    print("\n1. Testing user registration...")
    register_data = {
        "username": "test_alumni",
        "email": "test@example.com",
        "password": "testpassword123",
        "password_confirm": "testpassword123",
        "first_name": "Test",
        "last_name": "Alumni",
        "role": "alumni",
        "batch": "2020",
        "department": "Computer Science"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register/", json=register_data)
        if response.status_code == 201:
            print("✅ User registration successful")
            user_data = response.json()
            token = user_data.get('token')
        else:
            print(f"❌ Registration failed: {response.text}")
            return
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure Django server is running.")
        return
    
    # Test 2: Login
    print("\n2. Testing user login...")
    login_data = {
        "username": "test_alumni",
        "password": "testpassword123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login/", json=login_data)
    if response.status_code == 200:
        print("✅ User login successful")
    else:
        print(f"❌ Login failed: {response.text}")
    
    # Test 3: Get alumni list
    print("\n3. Testing alumni list...")
    headers = {"Authorization": f"Token {token}"}
    response = requests.get(f"{BASE_URL}/alumni/", headers=headers)
    if response.status_code == 200:
        print("✅ Alumni list retrieved successfully")
        alumni = response.json()
        print(f"   Found {len(alumni)} alumni")
    else:
        print(f"❌ Failed to get alumni list: {response.text}")
    
    # Test 4: Create an event
    print("\n4. Testing event creation...")
    event_data = {
        "title": "Test Alumni Meetup",
        "description": "A test event for alumni networking",
        "date": "2024-12-31T18:00:00Z",
        "location": "Test Location"
    }
    
    response = requests.post(f"{BASE_URL}/events/", json=event_data, headers=headers)
    if response.status_code == 201:
        print("✅ Event created successfully")
        event = response.json()
        event_id = event['id']
    else:
        print(f"❌ Event creation failed: {response.text}")
        return
    
    # Test 5: Get events list
    print("\n5. Testing events list...")
    response = requests.get(f"{BASE_URL}/events/", headers=headers)
    if response.status_code == 200:
        print("✅ Events list retrieved successfully")
        events = response.json()
        print(f"   Found {len(events)} events")
    else:
        print(f"❌ Failed to get events list: {response.text}")
    
    # Test 6: Register for event
    print("\n6. Testing event registration...")
    response = requests.post(f"{BASE_URL}/events/{event_id}/register/", headers=headers)
    if response.status_code == 201:
        print("✅ Event registration successful")
    else:
        print(f"❌ Event registration failed: {response.text}")
    
    print("\n🎉 API testing completed!")
    print("\nTo test more features:")
    print("- Visit http://127.0.0.1:8000/admin/ for Django admin")
    print("- Use Postman or curl to test other endpoints")
    print("- Check the SETUP.md file for complete API documentation")

if __name__ == "__main__":
    test_api()


