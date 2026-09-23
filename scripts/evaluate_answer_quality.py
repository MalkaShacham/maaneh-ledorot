#!/usr/bin/env python3
"""Fail-fast structural/evidence quality gate for the Maaneh Ledorot answer engine.

This does not pretend to grade semantics with string matching. It enforces the
preconditions that make proposition-level retrieval/citation entailment possible
and audits the regression suite for the required two-mode contract.
"""
from __future__ import annotations
import json, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
INDEX = ROOT / "data/public-search-index.json"
SUITE = ROOT / "data/evaluation/answer-quality-regression.json"
REPORT = ROOT / "data/evaluation/latest-quality-gate.json"

REQUIRED_ENTRY_FIELDS = {
    "has_content_evidence", "response_propositions", "verification_scope",
    "evidence_family_id", "context_status", "language", "status"
}
REQUIRED_DIMENSIONS = {
    "relevance", "answerability", "citation_entailment", "source_diversity",
    "hallucination", "researcher_depth_differential"
}
REQUIRED_REGULAR = {
    "answer-first", "proposition-level numbered inline citations",
    "matching numbered source list", "insufficiency when threshold is not met"
}
REQUIRED_RESEARCHER = {
    "answer-first extended synthesis", "witness-level provenance",
    "context completeness", "answered vs unanswered aspects",
    "material depth beyond regular mode"
}

def arr(v):
    if v is None: return []
    return v if isinstance(v, list) else [v]

def main() -> int:
    idx = json.loads(INDEX.read_text(encoding="utf-8"))
    suite = json.loads(SUITE.read_text(encoding="utf-8"))
    entries = idx.get("entries", [])
    failures, warnings = [], []

    if not entries:
        failures.append("public search index is empty")

    content_entries = [e for e in entries if e.get("has_content_evidence")]
    for e in content_entries:
        key = e.get("key") or e.get("aid") or e.get("title") or "<unknown>"
        missing = sorted(f for f in REQUIRED_ENTRY_FIELDS if f not in e)
        if missing:
            failures.append(f"{key}: content-evidence entry missing fields: {', '.join(missing)}")
        if not arr(e.get("response_propositions")):
            failures.append(f"{key}: has_content_evidence=true but response_propositions is empty")
        if e.get("status") == "Verified" and not (e.get("witness_type") or e.get("source_witness") or e.get("witness_provenance")):
            failures.append(f"{key}: Verified content evidence lacks witness provenance")

    dims = set(suite.get("dimensions", {}))
    if REQUIRED_DIMENSIONS - dims:
        failures.append("regression suite missing dimensions: " + ", ".join(sorted(REQUIRED_DIMENSIONS-dims)))
    if set(suite.get("modes", [])) != {"regular", "researcher"}:
        failures.append("regression suite must test both regular and researcher modes")
    if len(suite.get("cases", [])) < 18:
        failures.append("regression suite unexpectedly shrank below 18 cases")

    regular = set(suite.get("regular_mode_requirements", []))
    researcher = set(suite.get("researcher_mode_requirements", []))
    for req in sorted(REQUIRED_REGULAR-regular): failures.append("regular mode contract missing: " + req)
    for req in sorted(REQUIRED_RESEARCHER-researcher): failures.append("researcher mode contract missing: " + req)

    ids = [c.get("id") for c in suite.get("cases", [])]
    if len(ids) != len(set(ids)):
        failures.append("duplicate regression case ids")
    critical = {"unsupported-001","citation-proposition-001","circumstance-boundary-001","translation-independence-001","researcher-depth-001"}
    absent = critical-set(ids)
    if absent: failures.append("critical adversarial cases missing: " + ", ".join(sorted(absent)))

    # Readiness metrics are descriptive, not a substitute for semantic evaluation.
    families = {e.get("evidence_family_id") for e in content_entries if e.get("evidence_family_id")}
    verified_content = [e for e in content_entries if e.get("status") == "Verified"]
    partial = [e for e in content_entries if e.get("context_status") == "partial"]
    if len(content_entries) < 2:
        warnings.append("fewer than two content-evidence entries: pattern synthesis will usually be unavailable")

    report = {
        "gate":"answer-quality-structural-v1",
        "index_generated":idx.get("generated"),
        "entries_total":len(entries),
        "content_evidence_entries":len(content_entries),
        "verified_content_evidence_entries":len(verified_content),
        "content_evidence_families":len(families),
        "partial_context_content_entries":len(partial),
        "regression_cases":len(suite.get("cases", [])),
        "failures":failures,
        "warnings":warnings,
        "passed":not failures,
        "note":"Structural gate only. Semantic relevance and citation entailment still require per-question evaluation; lexical overlap is not accepted as semantic proof."
    }
    REPORT.parent.mkdir(parents=True, exist_ok=True)
    REPORT.write_text(json.dumps(report, ensure_ascii=False, indent=2)+"\n", encoding="utf-8")
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 1 if failures else 0

if __name__ == "__main__":
    sys.exit(main())
