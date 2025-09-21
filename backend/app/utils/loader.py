import json
from pathlib import Path
from typing import Any


def load_json(path: Path) -> Any:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)
