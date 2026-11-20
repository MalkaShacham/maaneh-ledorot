from status_normalization import status_of
from reconciliation_helpers import alias_target_pairs, has_frozen_metrics_snapshot, is_audit_descriptor

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

assert has_frozen_metrics_snapshot({
    "reconciliation_status": "reconciled",
    "metrics_actual_before": {"answer_eligible_unique_sources": 792},
    "metrics_actual_after": {"answer_eligible_unique_sources": 792},
}) is True
assert has_frozen_metrics_snapshot({
    "reconciliation_status": "reconciled_with_variance",
    "metrics_actual_before": {"answer_eligible_unique_sources": 792},
    "metrics_actual_after": {"answer_eligible_unique_sources": 791},
}) is True
assert has_frozen_metrics_snapshot({
    "reconciliation_status": "pending_reconciliation",
    "metrics_actual_before": {"answer_eligible_unique_sources": 792},
    "metrics_actual_after": {"answer_eligible_unique_sources": 792},
}) is False
assert has_frozen_metrics_snapshot({
    "reconciliation_status": "reconciled",
    "metrics_actual_before": {"answer_eligible_unique_sources": 792},
}) is False

print("Historical snapshot immutability: 4 checks passed")


print("Conservative status and alias normalization: 12 checks passed")


# Legacy Batch209 update descriptors are audit metadata, not extra source identities.
legacy_update = {
    "aid": 3140221,
    "id": "sicha-5752-13-tishrei-haazinu-aid3140221",
    "canonical": "data/items/content-research-batch-185-2026-11-19.json",
    "locator": "he.chabad.org AID 3140221, סעיף ז׳",
    "section": "ז׳",
    "prop": "legacy update descriptor",
    "limit": "partial context",
    "evidence_family_id": "sicha-5752-13-tishrei-haazinu-aid3140221",
    "proposition": "A source-grounded paraphrase",
    "source_url": "https://he.chabad.org/library/article_cdo/aid/3140221",
}
assert is_audit_descriptor(legacy_update) is True
assert is_audit_descriptor({
    "id": "sicha-5721-example-aid123456",
    "aid": 123456,
    "title": "A canonical source",
    "source_url": "https://he.chabad.org/library/article_cdo/aid/123456",
    "evidence_family_id": "example-family",
    "response_propositions": ["A proposition"],
}) is False
assert is_audit_descriptor({
    "action": "enriched_existing_identity_in_place",
    "existing_identity": True,
    "aid": 123456,
    "canonical_file": "data/items/example.json",
    "propositions_added": 1,
    "total_propositions_after": 2,
}) is True
print("Legacy update-descriptor exclusion: 3 checks passed")
