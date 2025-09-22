from flask import Flask
from flask_cors import CORS
from pathlib import Path

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Load configuration and offline dataset paths
    app.config.from_object('config.Config')
    # Default dataset directory: backend/data/jk
    root = Path(__file__).resolve().parents[1]
    app.config.setdefault('DATA_DIR', root / 'data' / 'jk')
    app.config.setdefault('DATASET_VERSION', '2025-09-21.1')

    # Register existing aggregated API blueprint (if used elsewhere)
    try:
        from .api import api as api_blueprint
        app.register_blueprint(api_blueprint, url_prefix='/api')
    except Exception:
        # If the older aggregator blueprint isn't compatible, we still expose new endpoints below
        pass

    # Register new offline-first endpoints
    from .api import meta as meta_bp
    from .api import datasets as datasets_bp
    from .api import sync as sync_bp
    from .api import recommendations as recommendations_bp
    from .api import timelines_api as timelines_bp
    from .api import auth_lite as auth_lite_bp
    from .api import chatbot as chatbot_bp

    app.register_blueprint(meta_bp.bp, url_prefix='/api')
    app.register_blueprint(datasets_bp.bp, url_prefix='/api/datasets')
    app.register_blueprint(sync_bp.bp, url_prefix='/api/sync')
    app.register_blueprint(recommendations_bp.bp, url_prefix='/api/recommendations')
    app.register_blueprint(timelines_bp.bp, url_prefix='/api')
    app.register_blueprint(auth_lite_bp.bp, url_prefix='/api')
    app.register_blueprint(chatbot_bp.bp, url_prefix='/api/chatbot')

    return app

app = create_app()