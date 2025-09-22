from flask import Blueprint, request, jsonify
from app.services.chatbot import enhanced_chatbot

bp = Blueprint('chatbot', __name__)

@bp.route('/ask', methods=['POST'])
def ask_chatbot():
    data = request.get_json()
    query = data.get('message', '').strip()  # Changed from 'question' to 'message' to match frontend
    user_profile = data.get('user_profile', {})
    
    if not query:
        return jsonify({'error': 'Message is required'}), 400
    
    try:
        response = enhanced_chatbot.generate_response(query, user_profile)
        return jsonify({'response': response})
    except Exception as e:
        print(f"Chatbot API error: {e}")
        return jsonify({'response': 'Sorry, I encountered an error. Please try again.'}), 500

@bp.route('/faq', methods=['GET'])
def get_faq():
    return jsonify({'faq': enhanced_chatbot.data_sources.get('faq', [])})

@bp.route('/stats', methods=['GET'])
def get_chatbot_stats():
    """Get statistics about loaded data sources"""
    stats = {}
    for key, data in enhanced_chatbot.data_sources.items():
        stats[key] = len(data) if isinstance(data, list) else 0
    return jsonify(stats)