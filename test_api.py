#!/usr/bin/env python
"""
Test script for the Loan Application API
Tests connectivity, authentication, and basic endpoints
"""

import urllib.request
import json
import time
import sys

def test_backend_connectivity():
    """Test if backend is running"""
    print("\n" + "="*50)
    print("BACKEND CONNECTIVITY TEST")
    print("="*50)
    
    time.sleep(1)
    
    try:
        response = urllib.request.urlopen('http://127.0.0.1:8000/api/', timeout=5)
        status = response.status
        print(f"✓ Backend API is accessible")
        print(f"  Status Code: {status}")
        return True
    except Exception as e:
        print(f"✗ Backend not accessible: {e}")
        return False

def test_authentication():
    """Test authentication endpoint"""
    print("\n" + "="*50)
    print("AUTHENTICATION TEST")
    print("="*50)
    
    try:
        url = 'http://127.0.0.1:8000/api/auth/token/'
        data = json.dumps({
            "username": "admin",
            "password": "admin"
        }).encode('utf-8')
        
        req = urllib.request.Request(
            url,
            data=data,
            headers={'Content-Type': 'application/json'},
            method='POST'
        )
        
        response = urllib.request.urlopen(req, timeout=5)
        result = json.loads(response.read().decode())
        
        print("✓ Authentication successful")
        print(f"  Token (first 50 chars): {result['access'][:50]}...")
        return result['access']
    except Exception as e:
        print(f"✗ Authentication failed: {e}")
        return None

def test_api_endpoints(token):
    """Test basic API endpoints"""
    print("\n" + "="*50)
    print("API ENDPOINTS TEST")
    print("="*50)
    
    endpoints = [
        '/api/customers/',
        '/api/loans/',
        '/api/dashboard/admin/',
    ]
    
    for endpoint in endpoints:
        try:
            url = f'http://127.0.0.1:8000{endpoint}'
            req = urllib.request.Request(
                url,
                headers={
                    'Authorization': f'Bearer {token}',
                    'Content-Type': 'application/json'
                }
            )
            
            response = urllib.request.urlopen(req, timeout=5)
            result = json.loads(response.read().decode())
            
            print(f"✓ {endpoint}")
            print(f"  Status: {response.status}")
            
        except Exception as e:
            print(f"✗ {endpoint}: {e}")

def test_frontend_connectivity():
    """Test if frontend is running"""
    print("\n" + "="*50)
    print("FRONTEND CONNECTIVITY TEST")
    print("="*50)
    
    try:
        response = urllib.request.urlopen('http://127.0.0.1:3000', timeout=5)
        print(f"✓ Frontend is accessible")
        print(f"  Status Code: {response.status}")
        return True
    except Exception as e:
        print(f"✗ Frontend not accessible: {e}")
        return False

def main():
    """Run all tests"""
    print("\n" + "█"*50)
    print("  LOAN APPLICATION - CODEBASE TEST SUITE")
    print("█"*50)
    
    # Test backend connectivity
    if not test_backend_connectivity():
        print("\n✗ Backend not running. Exiting tests.")
        sys.exit(1)
    
    # Test authentication
    token = test_authentication()
    
    # Test API endpoints if authenticated
    if token:
        test_api_endpoints(token)
    
    # Test frontend connectivity
    test_frontend_connectivity()
    
    print("\n" + "█"*50)
    print("  TEST SUITE COMPLETE")
    print("█"*50 + "\n")

if __name__ == '__main__':
    main()
