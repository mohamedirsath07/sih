from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from pathlib import Path
from app.utils.loader import load_json

bp = Blueprint('timelines', __name__)


def _parse_date(s: str):
    try:
        return datetime.fromisoformat(s).date()
    except Exception:
        return None


@bp.get('/timelines')
def list_timelines():
    ttype = request.args.get('type')  # admission|scholarship|exam|counseling
    district = request.args.get('district')
    before = request.args.get('before')
    after = request.args.get('after')
    q = request.args.get('q')

    before_d = _parse_date(before) if before else None
    after_d = _parse_date(after) if after else None

    base: Path = current_app.config['DATA_DIR']
    items = load_json(base / 'seed_timelines.json')

    def matches(it: dict) -> bool:
        if ttype and (it.get('type') or '').lower() != ttype.lower():
            return False
        if district and (it.get('district') or '').lower() != district.lower():
            return False

        sd = _parse_date(it.get('start_date')) if isinstance(it.get('start_date'), str) else None
        ed = _parse_date(it.get('end_date')) if isinstance(it.get('end_date'), str) else None
        if before_d and ed and not (ed <= before_d):
            return False
        if after_d and sd and not (sd >= after_d):
            return False

        if q:
            text = f"{it.get('title','')} {it.get('details','')}".lower()
            if q.lower() not in text:
                return False
        return True

    filtered = [it for it in items if matches(it)]
    return jsonify(filtered)


@bp.get('/timelines/next')
def next_timelines():
    limit = int(request.args.get('limit', '5'))
    today = datetime.utcnow().date()
    base: Path = current_app.config['DATA_DIR']
    items = load_json(base / 'seed_timelines.json')

    def upcoming(it: dict) -> bool:
        sd = _parse_date(it.get('start_date')) if isinstance(it.get('start_date'), str) else None
        return sd is not None and sd >= today

    upcoming_items = [it for it in items if upcoming(it)]
    upcoming_items.sort(key=lambda it: _parse_date(it.get('start_date')) or datetime.max.date())
    return jsonify(upcoming_items[:limit])
