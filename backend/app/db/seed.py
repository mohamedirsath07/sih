from app.db.connection import get_db
import json

def seed_colleges():
    db = get_db()
    with open('data/jk/seed_colleges.json') as f:
        colleges = json.load(f)
        db.colleges.insert_many(colleges)

def seed_scholarships():
    db = get_db()
    with open('data/jk/seed_scholarships.json') as f:
        scholarships = json.load(f)
        db.scholarships.insert_many(scholarships)

def seed_careers():
    db = get_db()
    with open('data/jk/seed_careers.json') as f:
        careers = json.load(f)
        db.careers.insert_many(careers)

def seed_database():
    seed_colleges()
    seed_scholarships()
    seed_careers()

if __name__ == '__main__':
    seed_database()