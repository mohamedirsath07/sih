from flask import Blueprint, request, jsonify
import json

chatbot_bp = Blueprint('chatbot', __name__)

# Load FAQ data from JSON file
def load_faq_data():
    with open('app/chatbot/faq.json') as f:
        return json.load(f)

faq_data = load_faq_data()

@chatbot_bp.route('/chatbot/faq', methods=['GET'])
def get_faq():
    return jsonify(faq_data)

@chatbot_bp.route('/chatbot/ask', methods=['POST'])
def ask_chatbot():
    user_input = request.json.get('question', '')
    response = generate_response(user_input)
    return jsonify({'response': response})

def generate_response(user_input):
    # Simple rule-based response generation
    if 'career' in user_input.lower():
        return "Choosing a career depends on your interests and strengths. Consider taking our aptitude test!"
    elif 'college' in user_input.lower():
        return "You can find information about nearby government colleges in our directory."
    elif 'scholarship' in user_input.lower():
        return "Check our scholarships section for available opportunities."
    else:
        return "I'm sorry, I don't have an answer for that. Please try asking something else."