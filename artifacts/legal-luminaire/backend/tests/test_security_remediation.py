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

    def test_ingestion_redacts_text_before_embedding(self, tmp_path, monkeypatch):
        from unittest.mock import Mock
        from rag import document_store

        identifiers = {
            "AADHAAR": "1234 5678 9012",
            "PAN": "ABCDE1234F",
            "PHONE": "+91 9876543210",
            "EMAIL": "test@example.com",
            "PASSPORT": "A1234567",
            "VOTERID": "ABC1234567",
        }
        source = tmp_path / "synthetic-exhibit.txt"
        source.write_text(
            "Synthetic exhibit.\n" + "\n".join(identifiers.values()),
            encoding="utf-8",
        )
        store = Mock()
        monkeypatch.setattr(document_store, "get_or_create_vectorstore", lambda _: store)

        summary = document_store.ingest_files("demo-case", [source])

        store.add_documents.assert_called_once()
        chunks = store.add_documents.call_args.args[0]
        indexed_text = "\n".join(chunk.page_content for chunk in chunks)
        assert "Synthetic exhibit." in indexed_text
        for label, identifier in identifiers.items():
            assert identifier not in indexed_text
            assert f"[{label}-REDACTED]" in indexed_text
        assert chunks[0].metadata["source_file"] == source.name
        assert summary["indexed"] == [{"file": source.name, "chunks": len(chunks)}]

    @pytest.mark.asyncio
    async def test_lab_report_redacts_before_provider_and_removes_raw_copy(self, monkeypatch):
        import sys
        from io import BytesIO
        from pathlib import Path
        from types import ModuleType
        from unittest.mock import MagicMock, Mock

        from fastapi import UploadFile
        from langchain_community import document_loaders
        from langchain_core.documents import Document
        from langchain_core.prompts import ChatPromptTemplate
        from api.routes_lab import extract_lab_report

        original = b"synthetic PDF"
        raw_paths = []

        def load_report(filename):
            path = Path(filename)
            assert path.name == "report.pdf"
            assert path.read_bytes() == original
            raw_paths.append(path)
            return Mock(load=Mock(return_value=[
                Document(page_content="Synthetic lab report for test@example.com"),
            ]))

        chain = Mock()
        prompt = MagicMock()
        prompt.__or__.return_value = chain
        monkeypatch.setattr(ChatPromptTemplate, "from_messages", Mock(return_value=prompt))
        monkeypatch.setattr(document_loaders, "PyPDFLoader", load_report)
        provider = ModuleType("langchain_google_genai")
        provider.ChatGoogleGenerativeAI = Mock()
        monkeypatch.setitem(sys.modules, provider.__name__, provider)
        monkeypatch.setenv("GOOGLE_API_KEY", "synthetic-key")

        await extract_lab_report(UploadFile(file=BytesIO(original), filename="../synthetic.pdf"))

        chain.invoke.assert_called_once_with({"text": "Synthetic lab report for [EMAIL-REDACTED]"})
        assert raw_paths and not raw_paths[0].parent.exists()
