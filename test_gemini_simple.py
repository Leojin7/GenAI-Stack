import os
import google.generativeai as genai

# Set API key directly (temporarily for testing)
API_KEY = "AIzaSyBRPzlvNoVQg-R52sr_EJtA_hTpp_XzjGw"

print("Testing Gemini API...")
genai.configure(api_key=API_KEY)

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
    import traceback
    traceback.print_exc()
