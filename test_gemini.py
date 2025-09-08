import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv("GOOGLE_API_KEY")
print(f"API Key found: {api_key[:5]}...{api_key[-5:] if api_key else ''}")

# Configure the API
print("Configuring Gemini API...")
genai.configure(api_key=api_key)

# List available models
print("\nAvailable models:")
for m in genai.list_models():
    if 'generateContent' in m.supported_generation_methods:
        print(f"- {m.name}")

# Test with a simple prompt
print("\nTesting with a simple prompt...")
try:
    model = genai.GenerativeModel('gemini-1.5-pro-latest')
    response = model.generate_content("Hello, what's your name?")
    print("\nResponse:")
    print(response.text)
except Exception as e:
    print(f"Error: {str(e)}")
