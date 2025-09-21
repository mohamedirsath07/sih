from app.models.college import College
from app.models.scholarship import Scholarship
from app.models.recommendation import Recommendation
from app.models.user import User

def map_colleges_to_degrees(colleges_data, degrees_data):
    college_degree_mapping = {}
    for college in colleges_data:
        college_name = college['name']
        offered_degrees = college['courses_offered']
        college_degree_mapping[college_name] = offered_degrees
    return college_degree_mapping

def map_scholarships_to_colleges(scholarships_data, colleges_data):
    scholarship_college_mapping = {}
    for scholarship in scholarships_data:
        scholarship_name = scholarship['name']
        eligible_colleges = [
            college['name'] for college in colleges_data if scholarship_name in college['eligible_scholarships']
        ]
        scholarship_college_mapping[scholarship_name] = eligible_colleges
    return scholarship_college_mapping

def map_user_recommendations(user_data, recommendations_data):
    user_recommendations = {}
    user_interests = user_data.get('interests', [])
    for recommendation in recommendations_data:
        if any(interest in recommendation['fields'] for interest in user_interests):
            user_recommendations[recommendation['name']] = recommendation['details']
    return user_recommendations

def map_careers_to_degrees(careers_data, degrees_data):
    career_degree_mapping = {}
    for career in careers_data:
        career_name = career['name']
        required_degrees = career['required_degrees']
        career_degree_mapping[career_name] = required_degrees
    return career_degree_mapping