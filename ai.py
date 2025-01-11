import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

def get_response(prompt):
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        api_key = input("Please enter your Gemini API key: ")
    try:
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        chat = model.start_chat(history=[])
        response = chat.send_message(prompt)
        return response.text
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    print("Welcome! Type 'quit' to exit.")
    while True:
        user_input = input("You: ")
        if user_input.lower() in ["quit", "bye", "exit"]:
            print("Gemini: Goodbye! Have a great day!")
            break
        response = get_response(user_input)
        print("Gemini:", response)