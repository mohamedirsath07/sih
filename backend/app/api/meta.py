from flask import Blueprint, current_app, jsonify
from datetime import datetime
from pathlib import Path

bp = Blueprint("meta", __name__)


@bp.get("/meta")
def meta():
    data_dir: Path = current_app.config.get("DATA_DIR")
    dataset_version: str = current_app.config.get("DATASET_VERSION", "0")
    last_updated = None
    if data_dir and data_dir.exists():
        try:
            mtimes = [p.stat().st_mtime for p in data_dir.glob("*.json")]
            last_updated = max(mtimes) if mtimes else None
        except Exception:
            last_updated = None

    return jsonify(
        {
            "service": "student-guidance-backend",
            "datasetVersion": dataset_version,
            "lastUpdated": (
                datetime.utcfromtimestamp(last_updated).isoformat() + "Z"
                if last_updated
                else None
            ),
        }
    )
