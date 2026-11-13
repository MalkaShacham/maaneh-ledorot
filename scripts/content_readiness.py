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
    def identity(e):
        family = e.get("evidence_family_id")
        if family:
            return str(family)
        aid = e.get("aid")
        if not aid and e.get("source_url"):
            match = re.search(r"/aid/(\d+)(?:/|$)", str(e.get("source_url")))
            if match:
                aid = match.group(1)
        if aid:
            return "aid:" + str(aid)
        return str(e.get("source_url") or e.get("key"))
    families = {}
    for entry in usable:
        families.setdefault(identity(entry), []).append(entry)

    def proposition_key(entry, proposition):
        normalize = lambda value: " ".join(str(value or "").casefold().split())
        return (normalize(proposition), normalize(entry.get("documented_circumstances")),
                normalize(entry.get("conditions_or_qualifications")),
                normalize(entry.get("audience")))

    content_verified = {
        key: members for key, members in families.items()
        if any((entry.get("canonical_status") or entry.get("status")) == "Verified"
               for entry in members)
    }
    proposition_count = 0
    for members in families.values():
        distinct = {proposition_key(entry, proposition)
                    for entry in members
                    for proposition in entry.get("response_propositions", [])
                    if str(proposition).strip()}
        proposition_count += len(distinct)
    return {
        "answer_eligible_unique_sources": len(families),
        "content_verified_unique_sources": len(content_verified),
        "answer_eligible_propositions": proposition_count,
        "content_readiness_note": "Unique sources are Evidence Families; distinct inspected propositions are aggregated across their member items. Bibliographic verification and editorial summaries do not count."
    }
