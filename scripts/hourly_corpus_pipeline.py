#!/usr/bin/env python3
"""Deterministic hourly corpus maintenance runner.

This runner intentionally does NOT promote content to Verified. Verification
requires an inspected item-level witness. It drains metadata-safe staging into
Indexed, reconciles identities/metrics, and writes an auditable run log even
when there is no actionable work.
"""
from __future__ import annotations
import datetime as dt
import json
import pathlib
import subprocess
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
LOGS = DATA / "run-logs"
METRICS = DATA / "public-metrics.json"

def read_metrics():
    try:
        return json.loads(METRICS.read_text(encoding="utf-8"))
    except Exception:
        return {}

def counts(m):
    return {
        "verified": m.get("verified_unique_item_keys"),
        "canonical": m.get("canonical_unique_item_keys"),
        "indexed": (m.get("status_counts_unique_keys") or {}).get("Indexed"),
        "promotion_ready": m.get("promotion_ready_records"),
    }

def run(script, *args):
    cmd = [sys.executable, str(ROOT / "scripts" / script), *args]
    p = subprocess.run(cmd, cwd=ROOT, text=True, capture_output=True)
    return {
        "command": " ".join(cmd[1:]),
        "returncode": p.returncode,
        "stdout": p.stdout[-8000:],
        "stderr": p.stderr[-8000:],
    }

def main():
    started = dt.datetime.now(dt.timezone.utc)
    before = read_metrics()
    steps = []
    steps.append(run("bulk_promote_indexed.py"))
    steps.append(run("reconcile_metrics.py"))
    steps.append(run("reconcile_identity_aliases.py"))
    steps.append(run("reconcile_metrics.py"))
    after = read_metrics()
    failed = [s for s in steps if s["returncode"] != 0]
    b, a = counts(before), counts(after)
    delta = {
        k: (a[k] - b[k]) if isinstance(a.get(k), int) and isinstance(b.get(k), int) else None
        for k in a
    }
    productive = any((delta.get(k) or 0) > 0 for k in ("verified", "canonical", "indexed"))
    status = "failed" if failed else ("progress" if productive else "no_actionable_change")
    finished = dt.datetime.now(dt.timezone.utc)
    record = {
        "schema": "maaneh-ledorot-hourly-run-v1",
        "run_started_utc": started.isoformat(),
        "run_finished_utc": finished.isoformat(),
        "status": status,
        "before": b,
        "after": a,
        "delta": delta,
        "epistemic_guardrail": "This deterministic runner never promotes to Verified. Verified requires an inspected direct/authorized item-level witness.",
        "steps": steps,
    }
    LOGS.mkdir(parents=True, exist_ok=True)
    (LOGS / "latest.json").write_text(json.dumps(record, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    day = started.strftime("%Y-%m-%d")
    hist = LOGS / f"hourly-{day}.jsonl"
    with hist.open("a", encoding="utf-8") as f:
        f.write(json.dumps(record, ensure_ascii=False) + "\n")
    print(json.dumps({"status": status, "before": b, "after": a, "delta": delta}, ensure_ascii=False))
    return 1 if failed else 0

if __name__ == "__main__":
    raise SystemExit(main())
