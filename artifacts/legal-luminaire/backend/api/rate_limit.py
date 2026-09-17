"""In-memory rate limiter for expensive Application Services routes.

Not a domain module. main.py is the only composition-root caller.
"""
from __future__ import annotations

import time
from collections import defaultdict

HEAVY_MARKERS = (
    "/research",
    "/ai-draft",
    "/drafting",
    "/discharge",
    "/chat",
    "/detect-contradictions",
    "/auto-research",
    "/upload-document",
    "/cases/",
    "/omni-ingest",
    "/preview-document",
    "/ingest",
    "/copilot",
    "/deadlines",
    "/chronology",
    "/derivative",
    "/variants",
)


def is_expensive_endpoint(path: str) -> bool:
    if path.rstrip("/").endswith("/health"):
        return False
    return any(m in path for m in HEAVY_MARKERS)


class RateLimiter:
    def __init__(self) -> None:
        self._request_counts: dict[str, list[float]] = defaultdict(list)

    def check(self, client_ip: str, limit: int, *, now: float | None = None, window: float = 60.0) -> tuple[bool, int]:
        """Returns (allowed, retry_after_seconds)."""
        clock = time.time() if now is None else now
        timestamps = self._request_counts[client_ip]
        self._request_counts[client_ip] = [t for t in timestamps if clock - t < window]
        if len(self._request_counts[client_ip]) >= limit:
            oldest = self._request_counts[client_ip][0]
            retry_after = int(window - (clock - oldest)) + 1
            return False, max(1, retry_after)
        self._request_counts[client_ip].append(clock)
        return True, 0


limiter = RateLimiter()
