"""
Test Gemini API Connection
Run this to verify if the Gemini API key is working
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

print("=" * 60)
print("GEMINI API CONNECTION TEST")
print("=" * 60)

# Step 1: Check if API key exists
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    print(f"✓ API Key found: {api_key[:20]}...{api_key[-4:]}")
else:
    print("❌ NO API KEY FOUND IN .env FILE")
    print("\nPlease add to .env:")
    print("GEMINI_API_KEY=your_key_here")
    exit(1)

# Step 2: Try to import google.genai
try:
    from google import genai
    print("✓ google-genai package imported successfully")
except ImportError as e:
    print(f"❌ Failed to import google-genai: {e}")
    print("\nRun: pip install google-genai")
    exit(1)

# Step 3: Try to initialize client
try:
    client = genai.Client(api_key=api_key)
    print("✓ Gemini client initialized successfully")
except Exception as e:
    print(f"❌ Failed to initialize client: {e}")
    exit(1)

# Step 4: Try to generate a response
try:
    print("\nTesting API with a simple prompt...")
    response = client.models.generate_content(
        model='gemini-1.5-flash-latest',
        contents="Say 'Hello! I am Whiz, your AI companion.' in a friendly way."
    )
    
    if response and hasattr(response, 'text') and response.text:
        print("✓ API call successful!")
        print(f"\nResponse from Gemini:\n{response.text}")
    else:
        print("❌ API returned empty response")
        print(f"Response object: {response}")
        
except Exception as e:
    print(f"❌ API call failed: {e}")
    print(f"Error type: {type(e).__name__}")
    
    if "API_KEY_INVALID" in str(e) or "403" in str(e):
        print("\n🔑 Your API key is INVALID or EXPIRED")
        print("Get a new one from: https://aistudio.google.com/app/apikey")
    elif "quota" in str(e).lower():
        print("\n⚠️ API quota exceeded")
        print("Wait a few minutes or get a new API key")
    else:
        print("\n⚠️ Unknown error - check your internet connection")
    
    exit(1)

print("\n" + "=" * 60)
print("✅ ALL TESTS PASSED - Gemini API is working correctly!")
print("=" * 60)
print("\nIf Whiz still isn't working, the issue is in the chat integration.")
print("Check that GeminiChat class is being instantiated properly.")
