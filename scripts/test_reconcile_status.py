from status_normalization import status_of

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

print("Conservative status normalization: 7 checks passed")
