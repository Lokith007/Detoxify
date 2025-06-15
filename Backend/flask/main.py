import os
from dotenv import load_dotenv
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS

load_dotenv()
api_key = os.getenv("CHAT_API_KEY")
if not api_key:
    raise ValueError("API key not found. Add it to your .env file.")

genai.configure(api_key=api_key)
model = genai.GenerativeModel("models/gemini-1.5-flash")
chat = model.start_chat()

chat.send_message(
    "You are a compassionate and knowledgeable mental health support assistant for Detoxify, a platform that helps users recover from drug addiction. "
    "Your role is to encourage, listen, and offer helpful, non-judgmental advice in simple and kind language. Avoid complex medical jargon. "
    "Be calm, supportive, and always remind users they are not alone. You are not a doctor, but you can guide users to take small steps toward recovery, "
    "offer motivation, suggest healthy coping strategies, and encourage them to reach out to their assigned counselor or mentor if needed."
    "If anyone has any severe issues or continuously keep explaining their issue tell them to book a session with the mentors at Detoxify."
)

app = Flask(__name__)
CORS(app)

def get_response(prompt):
    try:
        response = chat.send_message(prompt)
        return response.text
    except Exception as e:
        print("Error:", e)
        return "Sorry, something went wrong."

@app.route("/chat", methods=["POST"])
def chat_endpoint():
    data = request.get_json()
    prompt = data.get("prompt", "")
    if not prompt:
        return jsonify({"response": "Prompt is empty"}), 400
    reply = get_response(prompt)
    return jsonify({"response": reply})

if __name__ == "__main__":
    app.run(port=5001,debug=True, use_reloader=False)

