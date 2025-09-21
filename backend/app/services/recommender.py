from typing import List, Dict
import random

class Recommender:
    def __init__(self, interests: List[str], strengths: List[str], personality_traits: List[str]):
        self.interests = interests
        self.strengths = strengths
        self.personality_traits = personality_traits

    def recommend_stream(self) -> str:
        # Simple rule-based logic to recommend a stream based on interests
        if 'science' in self.interests:
            return 'Science'
        elif 'arts' in self.interests:
            return 'Arts'
        elif 'commerce' in self.interests:
            return 'Commerce'
        else:
            return 'Vocational'

    def recommend_courses(self, stream: str) -> List[str]:
        # Sample course recommendations based on the stream
        courses = {
            'Science': ['B.Sc. in Physics', 'B.Sc. in Chemistry', 'B.Sc. in Biology'],
            'Arts': ['B.A. in English', 'B.A. in History', 'B.A. in Psychology'],
            'Commerce': ['B.Com.', 'BBA', 'B.Com. in Accounting'],
            'Vocational': ['Diploma in IT', 'Diploma in Hospitality', 'Diploma in Graphic Designing']
        }
        return courses.get(stream, [])

    def map_courses_to_careers(self, courses: List[str]) -> Dict[str, List[str]]:
        # Sample mapping of courses to potential careers
        career_mapping = {
            'B.Sc. in Physics': ['Research Scientist', 'Engineer'],
            'B.A. in English': ['Teacher', 'Content Writer'],
            'B.Com.': ['Accountant', 'Financial Analyst'],
            'Diploma in IT': ['IT Technician', 'Web Developer']
        }
        return {course: career_mapping.get(course, []) for course in courses}

    def generate_recommendations(self) -> Dict[str, List[str]]:
        stream = self.recommend_stream()
        courses = self.recommend_courses(stream)
        career_mapping = self.map_courses_to_careers(courses)
        return {
            'recommended_stream': stream,
            'recommended_courses': courses,
            'career_mapping': career_mapping
        }

# Example usage
# recommender = Recommender(interests=['science', 'math'], strengths=['problem-solving'], personality_traits=['analytical'])
# recommendations = recommender.generate_recommendations()
# print(recommendations)