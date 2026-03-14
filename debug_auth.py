#!/usr/bin/env python
"""
Detailed debugging test for authentication endpoint
"""

import urllib.request
import json
import sys

def debug_auth():
    """Debug authentication with detailed error info"""
    print("Testing authentication endpoint...\n")
    
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
        
        try:
            response = urllib.request.urlopen(req, timeout=5)
            result = json.loads(response.read().decode())
            print("✓ Success!")
            print(json.dumps(result, indent=2))
        except urllib.error.HTTPError as e:
            print(f"✗ HTTP Error {e.code}")
            error_body = e.read().decode()
            print(f"Error response:\n{error_body}")
            
            # Try to parse as JSON
            try:
                error_json = json.loads(error_body)
                print("\nParsed error:")
                print(json.dumps(error_json, indent=2))
            except:
                pass
                
    except Exception as e:
        print(f"✗ Exception: {e}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    debug_auth()
