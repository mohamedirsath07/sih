from mongoengine import Document, StringField, ListField, DateTimeField, FloatField

class Scholarship(Document):
    title = StringField(required=True)
    description = StringField(required=True)
    eligibility_criteria = StringField(required=True)
    amount = FloatField(required=True)
    application_deadline = DateTimeField(required=True)
    website = StringField()
    tags = ListField(StringField())
    
    meta = {
        'collection': 'scholarships'
    }