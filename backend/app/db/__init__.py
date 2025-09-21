from flask import Blueprint

db_blueprint = Blueprint('db', __name__)

from .connection import connect_to_database
from .seed import seed_database

def init_db():
    connect_to_database()
    seed_database()