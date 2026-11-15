"""
Post-remediation behavioral verification — security controls.

Tests that the config validators and PII redaction actually enforce their
constraints, not just that the functions exist.  Run with:

    python -m pytest tests/test_security_remediation.py -v
"""
import pytest

from config import Settings
from api.redaction_utils import redact_indian_pii, audit_redaction_risk


# ── CORS validator ─────────────────────────────────────────────────────────────

class TestCORSValidator:
    def test_empty_cors_rejected(self):
        with pytest.raises(Exception, match="must not be empty"):
            Settings(cors_origins="")

    def test_wildcard_allowed_in_development(self):
        s = Settings(cors_origins="*", app_env="development")
        assert "*" in s.cors_origins_list

    def test_wildcard_blocked_in_production(self):
        s = Settings(cors_origins="*", app_env="production")
        with pytest.raises(ValueError, match="production"):
            s.check_production_cors()

    def test_explicit_origins_allowed_in_production(self):
        s = Settings(cors_origins="https://legal-luminaire.netlify.app",
                     app_env="production")
        s.check_production_cors()  # must not raise


# ── Hallucination threshold validator ─────────────────────────────────────────

class TestHallucinationThreshold:
    def test_default_0_25(self):
        assert Settings().hallucination_threshold == 0.25

    def test_boundary_0_0(self):
        assert Settings(hallucination_threshold=0.0).hallucination_threshold == 0.0

    def test_boundary_1_0(self):
        assert Settings(hallucination_threshold=1.0).hallucination_threshold == 1.0

    def test_above_1_rejected(self):
        with pytest.raises(Exception, match="0.0 and 1.0"):
            Settings(hallucination_threshold=1.5)

    def test_negative_rejected(self):
        with pytest.raises(Exception, match="0.0 and 1.0"):
            Settings(hallucination_threshold=-0.1)


# ── PII redaction behavioral ──────────────────────────────────────────────────

class TestPIIRedaction:
    def test_aadhaar_redacted(self):
        out = redact_indian_pii("My Aadhaar is 1234 5678 9012")
        assert "1234 5678 9012" not in out
        assert "REDACTED" in out

    def test_pan_redacted(self):
        out = redact_indian_pii("PAN is ABCDE1234F")
        assert "ABCDE1234F" not in out
        assert "REDACTED" in out

    def test_phone_redacted(self):
        out = redact_indian_pii("Call +91 9876543210")
        assert "9876543210" not in out
        assert "REDACTED" in out

    def test_email_redacted(self):
        out = redact_indian_pii("Email: rajkumar.singh@example.com")
        assert "rajkumar.singh@example.com" not in out
        assert "REDACTED" in out

    def test_passport_redacted(self):
        out = redact_indian_pii("Passport A1234567 issued")
        assert "A1234567" not in out
        assert "REDACTED" in out

    def test_voter_id_redacted(self):
        out = redact_indian_pii("EPIC ABC1234567 voter")
        assert "ABC1234567" not in out
        assert "REDACTED" in out

    def test_name_preserved_intentionally(self):
        out = redact_indian_pii("Rajkumar Singh called the advocate")
        assert "Rajkumar Singh" in out

    def test_empty_string_handled(self):
        assert redact_indian_pii("") == ""

    def test_audit_counts_returns_all_keys(self):
        counts = audit_redaction_risk("1234 5678 9012 ABCDE1234F test@x.com")
        for key in ("aadhaar", "pan", "phone", "email", "passport", "voter_id"):
            assert key in counts
