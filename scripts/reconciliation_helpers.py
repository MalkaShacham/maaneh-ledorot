import re

def alias_target_pairs(alias):
    """Return stable-key/AID/item-id triples for legacy string and structured alias targets."""
    if isinstance(alias, str):
        value = alias.strip()
        if not value:
            return []
        match = re.fullmatch(r"(?:aid:)?(\d+)", value, flags=re.IGNORECASE)
        if match:
            aid = match.group(1)
            return [("aid:" + aid, aid, None)]
        return [("id:" + value, None, value)]
    if not isinstance(alias, dict):
        return []
    pairs = []
    alias_aid = str(alias.get("alias_aid") or "").strip()
    canonical_aid = str(alias.get("canonical_aid") or "").strip()
    if alias_aid.isdigit():
        pairs.append(("aid:" + alias_aid, alias_aid, None))
    if canonical_aid.isdigit():
        pairs.append(("aid:" + canonical_aid, canonical_aid, None))
    if not pairs:
        identity = str(alias.get("identity") or alias.get("id") or "").strip()
        if identity:
            pairs.append(("id:" + identity, None, identity))
    return pairs


def has_frozen_metrics_snapshot(batch_data):
    """True when a batch already has a reconciled, immutable metrics boundary."""
    if not isinstance(batch_data, dict):
        return False
    return (
        batch_data.get("reconciliation_status") in ("reconciled", "reconciled_with_variance")
        and isinstance(batch_data.get("metrics_actual_before"), dict)
        and isinstance(batch_data.get("metrics_actual_after"), dict)
    )
