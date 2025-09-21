from flask import Blueprint, jsonify, request
from app.models.scholarship import Scholarship
from app.db.connection import get_db

scholarships_bp = Blueprint('scholarships', __name__)

@scholarships_bp.route('/scholarships', methods=['GET'])
def get_scholarships():
    db = get_db()
    scholarships = db.scholarships.find()
    return jsonify([scholarship for scholarship in scholarships]), 200

@scholarships_bp.route('/scholarships/<int:scholarship_id>', methods=['GET'])
def get_scholarship(scholarship_id):
    db = get_db()
    scholarship = db.scholarships.find_one({"id": scholarship_id})
    if scholarship:
        return jsonify(scholarship), 200
    return jsonify({"error": "Scholarship not found"}), 404

@scholarships_bp.route('/scholarships', methods=['POST'])
def create_scholarship():
    db = get_db()
    data = request.json
    scholarship = Scholarship(**data)
    db.scholarships.insert_one(scholarship.to_dict())
    return jsonify(scholarship.to_dict()), 201

@scholarships_bp.route('/scholarships/<int:scholarship_id>', methods=['PUT'])
def update_scholarship(scholarship_id):
    db = get_db()
    data = request.json
    result = db.scholarships.update_one({"id": scholarship_id}, {"$set": data})
    if result.modified_count:
        return jsonify({"message": "Scholarship updated"}), 200
    return jsonify({"error": "Scholarship not found or no changes made"}), 404

@scholarships_bp.route('/scholarships/<int:scholarship_id>', methods=['DELETE'])
def delete_scholarship(scholarship_id):
    db = get_db()
    result = db.scholarships.delete_one({"id": scholarship_id})
    if result.deleted_count:
        return jsonify({"message": "Scholarship deleted"}), 200
    return jsonify({"error": "Scholarship not found"}), 404