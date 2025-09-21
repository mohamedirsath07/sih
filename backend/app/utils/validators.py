from flask import request
from werkzeug.exceptions import BadRequest

def validate_user_data(data):
    if not data.get('name'):
        raise BadRequest("Name is required.")
    if not isinstance(data.get('age'), int) or data['age'] <= 0:
        raise BadRequest("Age must be a positive integer.")
    if not data.get('gender') in ['male', 'female', 'other']:
        raise BadRequest("Gender must be 'male', 'female', or 'other'.")
    if not data.get('academic_interest'):
        raise BadRequest("Academic interest is required.")
    return True

def validate_college_data(data):
    if not data.get('name'):
        raise BadRequest("College name is required.")
    if not data.get('courses_offered'):
        raise BadRequest("Courses offered are required.")
    if not isinstance(data.get('facilities'), list):
        raise BadRequest("Facilities must be a list.")
    return True

def validate_scholarship_data(data):
    if not data.get('title'):
        raise BadRequest("Scholarship title is required.")
    if not data.get('eligibility'):
        raise BadRequest("Eligibility criteria are required.")
    if not isinstance(data.get('amount'), (int, float)):
        raise BadRequest("Amount must be a number.")
    return True

def validate_timeline_data(data):
    if not data.get('event'):
        raise BadRequest("Event description is required.")
    if not data.get('date'):
        raise BadRequest("Date is required.")
    return True