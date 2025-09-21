from typing import Iterable, Set


SCIENCE_KEYS = [
    "mbbs", "bds", "b.tech", "btech", "b.sc", "bsc", "nursing",
    "statistics", "data science", "it", "computer", "engineering", "physics", "chemistry", "biology"
]
COMMERCE_KEYS = ["b.com", "bcom", "bba", "finance", "account", "commerce", "economics"]
ARTS_KEYS = [
    "b.a", "ba ", "bfa", "b.des", "design", "english", "history", "psychology", "fine arts", "arts", "sociology"
]


def course_to_stream(course: str) -> str:
    name = (course or "").lower()
    if any(k in name for k in SCIENCE_KEYS):
        return "Science"
    if any(k in name for k in COMMERCE_KEYS):
        return "Commerce"
    if any(k in name for k in ARTS_KEYS):
        return "Arts"
    if "diploma" in name:
        return "Vocational"
    return ""


def infer_streams(courses: Iterable[str]) -> Set[str]:
    return {course_to_stream(c) for c in (courses or []) if course_to_stream(c)}
