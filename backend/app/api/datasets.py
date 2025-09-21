from flask import Blueprint, current_app, jsonify, request
from pathlib import Path
from app.utils.loader import load_json
from app.utils.streams import course_to_stream, infer_streams
from datetime import datetime
import re

bp = Blueprint("datasets", __name__)


def _data_dir() -> Path:
    return current_app.config["DATA_DIR"]


@bp.get("/colleges")
def get_colleges():
    district = request.args.get("district")
    stream = request.args.get("stream")
    degree = request.args.get("degree")
    q = request.args.get("q")

    colleges = load_json(_data_dir() / "seed_colleges.json")

    def matches_filters(c: dict) -> bool:
        # district/location filter
        if district:
            loc = (c.get("district") or c.get("location") or "").lower()
            if loc != district.lower():
                return False
        # stream filter via offered courses
        if stream:
            offered = c.get("courses_offered", [])
            inferred = {s.lower() for s in infer_streams(offered)}
            if stream.lower() not in inferred:
                return False
        # degree substring filter
        if degree:
            deg = degree.lower()
            if not any(deg in (co or "").lower() for co in c.get("courses_offered", [])):
                return False
        # name query
        if q:
            if q.lower() not in (c.get("name") or "").lower():
                return False
        return True

    filtered = [c for c in colleges if matches_filters(c)]
    return jsonify(filtered)


@bp.get("/scholarships")
def get_scholarships():
    state = request.args.get("state")
    gender = request.args.get("gender")  # male/female
    max_income = request.args.get("maxIncome")
    min_amount = request.args.get("minAmount")
    max_amount = request.args.get("maxAmount")
    category = request.args.get("category")
    before = request.args.get("deadlineBefore")
    after = request.args.get("deadlineAfter")
    q = request.args.get("q")

    def to_int(v):
        try:
            return int(v)
        except Exception:
            return None

    min_amount_i = to_int(min_amount)
    max_amount_i = to_int(max_amount)
    max_income_i = to_int(re.sub(r"[^0-9]", "", max_income)) if max_income else None

    def parse_date(s: str):
        try:
            return datetime.fromisoformat(s).date()
        except Exception:
            return None

    before_d = parse_date(before) if before else None
    after_d = parse_date(after) if after else None

    scholarships = load_json(_data_dir() / "seed_scholarships.json")

    def matches(s: dict) -> bool:
        name = (s.get("name") or "")
        details = (s.get("details") or "")
        elig = (s.get("eligibility") or "")
        text_all = f"{name} {details} {elig}".lower()

        # state filter only if data lists applicable_states
        if state and s.get("applicable_states"):
            if state.lower() not in [a.lower() for a in s.get("applicable_states", [])]:
                return False

        # gender heuristic from explicit field or text
        if gender:
            g = gender.lower()
            if s.get("gender"):
                if s.get("gender").lower() != g:
                    return False
            else:
                if g == "female" and not any(k in text_all for k in ["female", "girl", "women", "girls", "women's"]):
                    return False
                if g == "male" and not any(k in text_all for k in ["male", "boy", "men", "boys", "men's"]):
                    return False

        # income heuristic
        if max_income_i is not None:
            if "income" in text_all:
                nums = re.findall(r"[0-9]{4,8}", text_all)
                if nums:
                    try:
                        amount = int(nums[0])
                        if amount > max_income_i:
                            return False
                    except Exception:
                        pass
                # if no numeric amount but mentions income, treat as eligible (need-based)
            # if no mention of income, do not filter out

        # amount filters
        amt = s.get("amount")
        if isinstance(amt, (int, float)):
            if min_amount_i is not None and amt < min_amount_i:
                return False
            if max_amount_i is not None and amt > max_amount_i:
                return False

        # deadline filters
        d = s.get("application_deadline")
        if isinstance(d, str):
            dd = parse_date(d)
            if before_d and dd and not (dd <= before_d):
                return False
            if after_d and dd and not (dd >= after_d):
                return False

        # category keyword match in text
        if category and category.lower() not in text_all:
            return False

        # text search
        if q and q.lower() not in text_all:
            return False

        return True

    filtered = [s for s in scholarships if matches(s)]
    return jsonify(filtered)


@bp.get("/careers")
def get_careers():
    stream = request.args.get("stream")
    careers = load_json(_data_dir() / "seed_careers.json")
    if stream:
        target = stream.lower()

        def matches_stream(career: dict) -> bool:
            courses = career.get("related_courses", [])
            inferred = {s.lower() for s in infer_streams(courses)}
            return target in inferred

        careers = [c for c in careers if matches_stream(c)]
    return jsonify(careers)


@bp.get("/degrees")
def get_degrees_catalog():
    stream = request.args.get("stream")
    base = _data_dir()
    colleges = load_json(base / "seed_colleges.json")
    careers = load_json(base / "seed_careers.json")

    degree_counts = {}

    def add_degree(title: str):
        if not title:
            return
        streams = infer_streams([title])
        key = title.strip()
        if key not in degree_counts:
            degree_counts[key] = {"degree": key, "streams": sorted(streams), "count": 0}
        degree_counts[key]["streams"] = sorted({*degree_counts[key]["streams"], *streams})
        degree_counts[key]["count"] += 1

    # From colleges
    for col in colleges:
        for d in col.get("courses_offered", []) or []:
            add_degree(d)

    # From careers (related_courses)
    for car in careers:
        for d in car.get("related_courses", []) or []:
            add_degree(d)

    degrees = list(degree_counts.values())
    if stream:
        target = stream.lower()
        degrees = [d for d in degrees if any(s.lower() == target for s in d.get("streams", []))]

    # Sort by frequency desc, then name
    degrees.sort(key=lambda x: (-x["count"], x["degree"]))
    return jsonify(degrees)
