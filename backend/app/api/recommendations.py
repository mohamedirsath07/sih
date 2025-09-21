from flask import Blueprint, request, jsonify, current_app
from app.services.recommender import Recommender
from app.utils.loader import load_json
from app.utils.streams import course_to_stream, infer_streams
from pathlib import Path

bp = Blueprint('recommendations', __name__)


@bp.post('/quiz')
def recommend_from_quiz():
    payload = request.get_json(silent=True) or {}
    answers = payload.get('answers', [])  # list of { id, choice }

    # Heuristic: map certain answer keywords to interest tags
    text = " ".join([str(a.get('choice', '')).lower() for a in answers])
    interests = []
    if any(k in text for k in ['math', 'physics', 'chemistry', 'code', 'lab']):
        interests.append('science')
    if any(k in text for k in ['business', 'finance', 'account', 'commerce']):
        interests.append('commerce')
    if any(k in text for k in ['art', 'history', 'writing', 'language', 'design']):
        interests.append('arts')
    if any(k in text for k in ['hands-on', 'skilled', 'repair', 'mechanic', 'hospitality']):
        interests.append('vocational')
    if not interests:
        interests = ['vocational']

    rec = Recommender(interests=interests, strengths=[], personality_traits=[])
    result = rec.generate_recommendations()

    # Attach top colleges by stream and optional district
    recommended_stream = result.get('recommended_stream')
    district = payload.get('district')

    base: Path = current_app.config['DATA_DIR']
    colleges = load_json(base / 'seed_colleges.json')

    def matches(col):
        # stream match
        inferred = infer_streams(col.get('courses_offered', []))
        if recommended_stream not in inferred:
            return False
        # optional district/location match
        if district:
            loc = (col.get('district') or col.get('location') or '').lower()
            if loc != district.lower():
                return False
        return True

    top_colleges = [c for c in colleges if matches(c)]
    # simple rank: prefer those with labs/library/hostel; truncate to 5
    def score(c):
        fac = {f.lower() for f in c.get('facilities', [])}
        return sum(1 for k in ['laboratories', 'laboratory', 'lab', 'library', 'hostel'] if k in fac)

    top_colleges = sorted(top_colleges, key=score, reverse=True)[:5]
    result['top_colleges'] = top_colleges
    return jsonify(result)