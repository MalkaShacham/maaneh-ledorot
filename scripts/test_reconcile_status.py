from status_normalization import status_of
from reconciliation_helpers import alias_target_pairs

assert status_of({
    "pipeline_status": "Parsed",
    "provenance": {"verification_status": "no promotion to Verified"}
}) == "Parsed"
assert status_of({
    "pipeline_status": "Parsed",
    "verification_status": "no promotion to Verified"
}) == "Parsed"
assert status_of({
    "pipeline_status": "Linked",
    "verification_status": "not yet Verified"
}) == "Linked"
assert status_of({
    "pipeline_status": "Parsed",
    "verification_status": "Verified"
}) == "Verified"
assert status_of({
    "pipeline_status": "Parsed",
    "verification_status": "unverified"
}) == "Parsed"
assert status_of({
    "pipeline_status": "Verified",
    "verification_status": "unverified"
}) == "Verified"
assert status_of({
    "pipeline_status": "Parsed",
    "verification_status": "no content verification was performed"
}) == "Parsed"

assert alias_target_pairs("aid:1273962") == [("aid:1273962", "1273962", None)]
assert alias_target_pairs("1273962") == [("aid:1273962", "1273962", None)]
assert alias_target_pairs({"alias_aid": 5357409, "canonical_aid": 4872269}) == [
    ("aid:5357409", "5357409", None),
    ("aid:4872269", "4872269", None),
]
assert alias_target_pairs("legacy-source-key") == [("id:legacy-source-key", None, "legacy-source-key")]
assert alias_target_pairs(None) == []

print("Conservative status and alias normalization: 12 checks passed")
