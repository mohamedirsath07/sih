from pymongo import MongoClient
import os

def get_db_connection():
    mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    client = MongoClient(mongo_uri)
    db_name = os.getenv("DB_NAME", "student_guidance")
    return client[db_name]