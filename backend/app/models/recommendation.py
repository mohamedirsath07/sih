from mongoengine import Document, StringField, ListField, ReferenceField
from app.models.user import User
from app.models.college import College

class Recommendation(Document):
    user = ReferenceField(User, required=True)
    recommended_courses = ListField(StringField(), required=True)
    recommended_colleges = ListField(ReferenceField(College), required=True)
    career_paths = ListField(StringField(), required=True)
    created_at = StringField()  # Store the timestamp of when the recommendation was created
    updated_at = StringField()  # Store the timestamp of when the recommendation was last updated