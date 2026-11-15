import re

PIPE = ("Verified", "Linked", "Parsed", "Indexed", "Discovered")
NEGATIVE_VERIFICATION = re.compile(
    r"\bunverified\b|\bno\s+promotion\s+to\s+verified\b|"
    r"\bnot\s+promoted\s+to\s+verified\b|\bnot\s+(?:yet\s+)?verified\b",
    re.I,
)


def status_of(record):
    """Normalize explicit status fields; never infer Verified from negated explanatory prose."""
    if not isinstance(record, dict):
        return None
    provenance = record.get("provenance")
    values = [
        record.get("pipeline_status"),
        record.get("verification_status"),
        provenance.get("verification_status") if isinstance(provenance, dict) else None,
    ]
    text = " ".join(str(value) for value in values if value)
    pipeline = record.get("pipeline_status")

    if NEGATIVE_VERIFICATION.search(text):
        # An explicit pipeline status remains authoritative. This keeps Parsed records
        # Parsed when a note says "no promotion to Verified", without downgrading records
        # already explicitly promoted to Verified for unrelated reasons.
        return pipeline if pipeline in PIPE else None

    # Only a leading status token in an explicit verification field can promote a
    # non-Verified pipeline record; incidental mentions later in explanatory prose do not.
    for value in values[1:]:
        if not value:
            continue
        for stage in PIPE:
            if re.match(rf"^\s*{re.escape(stage)}(?:\b|[:;,-])", str(value), re.I):
                return stage
    if pipeline in PIPE:
        return pipeline
    for value in values:
        if not value:
            continue
        for stage in PIPE:
            if re.match(rf"^\s*{re.escape(stage)}(?:\b|[:;,-])", str(value), re.I):
                return stage
    return None
