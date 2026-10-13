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

print("Workflow write safety: 7 checks passed")
