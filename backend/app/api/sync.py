from flask import Blueprint, current_app, request, jsonify
from pathlib import Path
from app.utils.loader import load_json
import json

bp = Blueprint("sync", __name__)


@bp.post("/pull")
def pull():
    # MVP: always full sync of seed data with a version tag
    payload = request.get_json(silent=True) or {}
    _ = payload.get("since")  # reserved for future deltas
    dataset_version = current_app.config.get("DATASET_VERSION", "0")
    base: Path = current_app.config["DATA_DIR"]
    return jsonify(
        {
            "mode": "full",
            "datasetVersion": dataset_version,
            "collections": {
                "colleges": load_json(base / "seed_colleges.json"),
                "scholarships": load_json(base / "seed_scholarships.json"),
                "careers": load_json(base / "seed_careers.json"),
                "timelines": load_json(base / "seed_timelines.json"),
            },
        }
    )


@bp.post("/push")
def push():
    events = (request.get_json(silent=True) or {}).get("events", [])
    # Append events to a JSONL file for durability in demo/offline
    base: Path = Path(current_app.instance_path)
    base.mkdir(parents=True, exist_ok=True)
    log_path = base / "sync_events.jsonl"
    with log_path.open("a", encoding="utf-8") as f:
        for e in events:
            f.write(json.dumps(e, ensure_ascii=False) + "\n")
    return jsonify({"accepted": len(events), "status": "ok"}), 202
