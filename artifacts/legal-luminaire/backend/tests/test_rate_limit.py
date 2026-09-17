"""Rate limiter unit tests — no FastAPI app, no agents."""
from api.rate_limit import RateLimiter, is_expensive_endpoint


def test_expensive_paths():
    assert is_expensive_endpoint("/api/v1/copilot/ask")
    assert is_expensive_endpoint("/api/v1/ai-draft")
    assert is_expensive_endpoint("/api/v1/cases/TC-01/upload")
    assert not is_expensive_endpoint("/api/v1/health")
    assert not is_expensive_endpoint("/api/v1/copilot/health")
    assert not is_expensive_endpoint("/")


def test_rate_limiter_allows_then_blocks():
    lim = RateLimiter()
    t0 = 1_000_000.0
    assert lim.check("1.1.1.1", limit=2, now=t0)[0] is True
    assert lim.check("1.1.1.1", limit=2, now=t0 + 1)[0] is True
    allowed, retry = lim.check("1.1.1.1", limit=2, now=t0 + 2)
    assert allowed is False
    assert retry >= 1


def test_rate_limiter_isolated_per_ip():
    lim = RateLimiter()
    t0 = 1_000_000.0
    assert lim.check("a", limit=1, now=t0)[0] is True
    assert lim.check("b", limit=1, now=t0)[0] is True
    assert lim.check("a", limit=1, now=t0 + 1)[0] is False
