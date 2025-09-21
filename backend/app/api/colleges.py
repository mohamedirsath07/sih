from flask import Blueprint, jsonify, request
from app.models.college import College
from app.db.connection import db

colleges_bp = Blueprint('colleges', __name__)

@colleges_bp.route('/colleges', methods=['GET'])
def get_colleges():
    colleges = College.query.all()
    return jsonify([college.to_dict() for college in colleges]), 200

@colleges_bp.route('/colleges/<int:college_id>', methods=['GET'])
def get_college(college_id):
    college = College.query.get(college_id)
    if college is None:
        return jsonify({'error': 'College not found'}), 404
    return jsonify(college.to_dict()), 200

@colleges_bp.route('/colleges', methods=['POST'])
def add_college():
    data = request.json
    new_college = College(
        name=data['name'],
        courses_offered=data['courses_offered'],
        facilities=data['facilities'],
        location=data['location']
    )
    db.session.add(new_college)
    db.session.commit()
    return jsonify(new_college.to_dict()), 201

@colleges_bp.route('/colleges/<int:college_id>', methods=['PUT'])
def update_college(college_id):
    college = College.query.get(college_id)
    if college is None:
        return jsonify({'error': 'College not found'}), 404

    data = request.json
    college.name = data.get('name', college.name)
    college.courses_offered = data.get('courses_offered', college.courses_offered)
    college.facilities = data.get('facilities', college.facilities)
    college.location = data.get('location', college.location)

    db.session.commit()
    return jsonify(college.to_dict()), 200

@colleges_bp.route('/colleges/<int:college_id>', methods=['DELETE'])
def delete_college(college_id):
    college = College.query.get(college_id)
    if college is None:
        return jsonify({'error': 'College not found'}), 404

    db.session.delete(college)
    db.session.commit()
    return jsonify({'message': 'College deleted successfully'}), 200