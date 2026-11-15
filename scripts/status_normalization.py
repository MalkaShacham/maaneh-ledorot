import re

PIPE = ("Verified", "Linked", "Parsed", "Indexed", "Discovered")

NEGATIVE_VERIFICATION = re.compile(
    r"\bunverified\b|\bno\s+promotion\s+to\s+verified\b|"
    r"\bnot\s+promoted\s+to\s+verified\b|"
    r"\bnot\s+(?:yet\s+)?verified\b|"
    r"\bno\s+(?:content\s+)?verification\b|"
    r"\bverification\s+not\s+(?:performed|completed|done)\b",
    re.I,
)


def status_of(record):
    """Return the strongest supported pipeline status without reading negated prose as Verified."""
    if not isinstance(record, dict):
        return None
    provenance = record.get("provenance")
    values = [
        record.get("pipeline_status"),
        record.get("verification_status"),
        provenance.get("verification_status") if isinstance(provenance, dict) else None,
    ]
    text = " ".join(str(value) for value in values if value)
    if NEGATIVE_VERIFICATION.search(text):
        pipeline = record.get("pipeline_status")
        return pipeline if pipeline in PIPE and pipeline != "Verified" else None
    if re.search(r"\bverified\b", text, re.I):
        return "Verified"
    for stage in PIPE:
        if re.search(rf"\b{re.escape(stage)}\b", text, re.I):
            return stage
    pipeline = record.get("pipeline_status")
    return pipeline if pipeline in PIPE else None
