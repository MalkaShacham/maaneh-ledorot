"""Measure answer evidence separately from bibliographic verification.

Keep this predicate aligned with normalizeEvidenceIntegrity in the browser.
The parity regression compares the resulting identities on the actual corpus.
"""
import re

LOCATOR_ONLY = re.compile(
    r"bibliographic_locator_verified_only|identity/locator|bibliographic identity|"
    r"index[- ]first|metadata[_ -]and[_ -]locator[_ -]only", re.I)


def answer_eligible(entry):
    if not entry.get("has_content_evidence") or not entry.get("response_propositions"):
        return False
    scope = " ".join(str(entry.get(k) or "") for k in
                     ("context_status", "verification_scope", "rights_status"))
    if LOCATOR_ONLY.search(scope):
        return False
    if entry.get("proposition_origin") == "editorial_summary_derived":
        return False
    if entry.get("proposition_verbatim") is False:
        return (entry.get("proposition_origin") == "source_grounded_paraphrase"
                and entry.get("proposition_verification") == "source_text_inspected"
                and bool(entry.get("proposition_source_locator")))
    return True


def summarize(entries):
    usable = [e for e in entries if answer_eligible(e)]
    identity = lambda e: str(e.get("evidence_family_id") or e.get("aid")
                             or e.get("source_url") or e["key"])
    unique = {identity(e): e for e in usable}
    content_verified = {
        key: entry for key, entry in unique.items()
        if (entry.get("canonical_status") or entry.get("status")) == "Verified"
    }
    return {
        "answer_eligible_unique_sources": len(unique),
        "content_verified_unique_sources": len(content_verified),
        "answer_eligible_propositions": sum(len(e["response_propositions"])
                                            for e in unique.values()),
        "content_readiness_note": "Only evidence accepted by the answer engine; "
                                 "bibliographic verification and editorial summaries do not count."
    }
