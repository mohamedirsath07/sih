from flask import Blueprint

# Lightweight package init: expose an optional aggregate blueprint without
# eagerly importing all submodules. Individual modules define their own
# blueprints and are registered explicitly by the app factory as needed.
api = Blueprint('api', __name__)
