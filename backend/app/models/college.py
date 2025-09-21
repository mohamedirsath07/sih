from mongoengine import Document, StringField, ListField, IntField, ReferenceField

class College(Document):
    name = StringField(required=True)
    courses_offered = ListField(StringField(), required=True)
    facilities = ListField(StringField())
    location = StringField(required=True)
    cut_offs = ListField(IntField())
    medium_of_instruction = StringField()
    
    meta = {
        'collection': 'colleges'
    }