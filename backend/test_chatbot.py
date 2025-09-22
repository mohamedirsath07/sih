#!/usr/bin/env python3
"""
Test script for the enhanced chatbot API
"""
import requests
import json

def test_chatbot_stats():
    """Test the chatbot stats endpoint"""
    try:
        response = requests.get('http://localhost:5000/api/chatbot/stats')
        print(f"Stats endpoint - Status: {response.status_code}")
        if response.status_code == 200:
            print(f"Stats: {response.json()}")
        else:
            print(f"Error: {response.text}")
        return response.status_code == 200
    except Exception as e:
        print(f"Error testing stats: {e}")
        return False

def test_chatbot_ask():
    """Test the chatbot ask endpoint"""
    try:
        test_messages = [
            "Tell me about colleges in Jammu",
            "What scholarships are available for girls?",
            "I want to know about engineering careers",
            "Show me timelines for admission"
        ]
        
        for message in test_messages:
            payload = {
                "message": message,
                "user_profile": {
                    "name": "Test User",
                    "location": "Jammu"
                }
            }
            
            response = requests.post(
                'http://localhost:5000/api/chatbot/ask',
                json=payload,
                headers={'Content-Type': 'application/json'}
            )
            
            print(f"\nMessage: {message}")
            print(f"Status: {response.status_code}")
            
            if response.status_code == 200:
                result = response.json()
                print(f"Response: {result.get('response', 'No response')[:200]}...")
            else:
                print(f"Error: {response.text}")
                
        return True
    except Exception as e:
        print(f"Error testing ask endpoint: {e}")
        return False

if __name__ == "__main__":
    print("Testing Enhanced Chatbot API")
    print("=" * 40)
    
    # Test stats endpoint
    print("\n1. Testing Stats Endpoint:")
    stats_ok = test_chatbot_stats()
    
    # Test ask endpoint
    print("\n2. Testing Ask Endpoint:")
    ask_ok = test_chatbot_ask()
    
    print("\n" + "=" * 40)
    print(f"Stats endpoint: {'✓' if stats_ok else '✗'}")
    print(f"Ask endpoint: {'✓' if ask_ok else '✗'}")