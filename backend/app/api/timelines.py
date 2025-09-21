from flask import Blueprint, jsonify, request
from datetime import datetime

timelines_bp = Blueprint('timelines', __name__)

# Sample data for timelines
timelines_data = {
    "admissions": {
        "undergraduate": {
            "start_date": "2023-05-01",
            "end_date": "2023-06-30",
            "description": "Undergraduate admissions for various degree programs."
        },
        "postgraduate": {
            "start_date": "2023-07-01",
            "end_date": "2023-08-15",
            "description": "Postgraduate admissions for master's programs."
        }
    },
    "scholarships": {
        "application_period": {
            "start_date": "2023-04-01",
            "end_date": "2023-05-31",
            "description": "Scholarship applications for the academic year."
        }
    },
    "exams": {
        "entrance_exams": {
            "dates": [
                {
                    "name": "JEE Main",
                    "date": "2023-04-15"
                },
                {
                    "name": "NEET",
                    "date": "2023-05-07"
                }
            ]
        }
    }
}

@timelines_bp.route('/admissions', methods=['GET'])
def get_admissions_timeline():
    return jsonify(timelines_data["admissions"])

@timelines_bp.route('/scholarships', methods=['GET'])
def get_scholarships_timeline():
    return jsonify(timelines_data["scholarships"])

@timelines_bp.route('/exams', methods=['GET'])
def get_exams_timeline():
    return jsonify(timelines_data["exams"])