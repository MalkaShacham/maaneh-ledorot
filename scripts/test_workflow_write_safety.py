#!/usr/bin/env python3
"""Regression checks for workflows that commit generated corpus state."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORKFLOWS = [
    ROOT / ".github/workflows/hourly-corpus-pipeline.yml",
    ROOT / ".github/workflows/reconcile-metrics.yml",
]

for path in WORKFLOWS:
    text = path.read_text(encoding="utf-8")
    assert "group: corpus-writes-${{ github.ref }}" in text, f"{path.name}: shared write lock missing"
    sync = text.index("git pull --ff-only origin main")
    mutation = text.index("python scripts/")
    assert sync < mutation, f"{path.name}: main must be synchronized before mutation"

hourly = WORKFLOWS[0].read_text(encoding="utf-8")
assert "if: always()" not in hourly, "hourly commit must not run after a failed pipeline"
assert "run-log-only changes are not committed" in hourly, "log-only commit guard missing"
assert "git pull --rebase origin main" not in hourly, "post-mutation rebase can conflict on generated files"

policy = "match any stable AID, source URL, staging stable key, or ID"
for script in ["reconcile_metrics.py", "reconcile_identity_aliases.py"]:
    text = (ROOT / "scripts" / script).read_text(encoding="utf-8")
    assert policy in text, f"{script}: promotion-ready identity policy schema drift"

for path in WORKFLOWS + [ROOT / ".github/workflows/answer-quality-gate.yml"]:
    text = path.read_text(encoding="utf-8")
    assert "python scripts/test_reconcile_status.py" in text, f"{path.name}: status-normalization regression missing"

metrics = (ROOT / "scripts/reconcile_metrics.py").read_text(encoding="utf-8")
assert "from status_normalization import status_of" in metrics, "metrics reconciliation must use conservative status normalization"
assert 'items=sorted(' in metrics, "canonical item traversal must be deterministic"
assert 'batches=sorted(' in metrics, "staging batch traversal must be deterministic"

print("Workflow write safety and status-normalization wiring checks passed")
