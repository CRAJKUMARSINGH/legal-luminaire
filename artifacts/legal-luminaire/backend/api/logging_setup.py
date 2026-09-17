"""Application log format with required Day 11 fields."""
from __future__ import annotations

import logging

from api.request_context import current_trace_id


class TraceIdFilter(logging.Filter):
    def filter(self, record: logging.LogRecord) -> bool:
        record.trace_id = current_trace_id()
        return True


def configure_logging() -> None:
    root = logging.getLogger()
    if getattr(root, "_ll_configured", False):
        return
    handler = logging.StreamHandler()
    handler.setFormatter(
        logging.Formatter(
            "%(asctime)s [%(levelname)s] %(name)s trace_id=%(trace_id)s %(message)s"
        )
    )
    handler.addFilter(TraceIdFilter())
    root.handlers.clear()
    root.addHandler(handler)
    root.setLevel(logging.INFO)
    root._ll_configured = True  # type: ignore[attr-defined]
