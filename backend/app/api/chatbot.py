from flask import Blueprint, request, jsonify
import json
import os

chatbot_bp = Blueprint('chatbot', __name__)

# Load FAQ data from JSON file
faq_file_path = os.path.join(os.path.dirname(__file__), 'faq.json')

def load_faq_data():
    with open(faq_file_path, 'r') as f:
        return json.load(f)

faq_data = load_faq_data()

@chatbot_bp.route('/api/chatbot/faq', methods=['GET'])
def get_faq():
    return jsonify(faq_data)

@chatbot_bp.route('/api/chatbot/ask', methods=['POST'])
def ask_chatbot():
    user_input = request.json.get('question', '')
    # Simple rule-based response for demonstration
    if user_input:
        response = generate_response(user_input)
        return jsonify({'response': response})
    return jsonify({'error': 'No question provided'}), 400

def generate_response(question):
    # Basic keyword matching for response generation
    if 'graduation' in question.lower():
        return "Graduation is important as it opens up various career opportunities."
    elif 'courses' in question.lower():
        return "You can choose from various courses like B.A., B.Sc., B.Com., etc."
    elif 'scholarships' in question.lower():
        return "There are several scholarships available for students in Jammu & Kashmir."
    else:
        return "I'm sorry, I don't have an answer for that. Please check the FAQ."