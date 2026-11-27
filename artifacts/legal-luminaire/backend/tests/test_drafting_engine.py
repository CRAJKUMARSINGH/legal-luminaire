"""Exercise the drafting API selected in ADR-010 with a local provider double."""

import sys
from types import ModuleType, SimpleNamespace
from unittest.mock import MagicMock, Mock

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient
from langchain_core.prompts import ChatPromptTemplate

from api import routes_drafting


@pytest.fixture
def drafting_client(monkeypatch):
    monkeypatch.setattr(routes_drafting.case_manager, "get_case", Mock(return_value={
        "title": "Synthetic case",
        "brief": "Contact fixture@example.com",
    }))
    monkeypatch.setenv("GOOGLE_API_KEY", "synthetic-key")
    provider = ModuleType("langchain_google_genai")
    provider.ChatGoogleGenerativeAI = Mock()
    monkeypatch.setitem(sys.modules, provider.__name__, provider)
    chain = Mock()
    prompt = MagicMock()
    prompt.__or__.return_value = chain
    monkeypatch.setattr(ChatPromptTemplate, "from_messages", Mock(return_value=prompt))
    app = FastAPI()
    app.include_router(routes_drafting.router, prefix="/api/v1")
    return TestClient(app), chain


@pytest.mark.parametrize("url", ["/api/v1/generate-draft", "/api/v1/cases/demo/generate-draft"])
def test_supported_drafting_routes_redact_inputs(drafting_client, url):
    client, chain = drafting_client
    chain.invoke.return_value = SimpleNamespace(content="Synthetic draft for advocate review.")
    payload = {"draft_type": "BRIEF", "additional_notes": "Email notes@example.com"}
    if url.endswith("/v1/generate-draft"):
        payload["case_id"] = "demo"

    response = client.post(url, json=payload)

    assert response.status_code == 200
    assert response.json()["draft_content"] == "Synthetic draft for advocate review."
    params = chain.invoke.call_args.args[0]
    assert "Contact [EMAIL-REDACTED]" in params["context"]
    assert params["notes"] == "Email [EMAIL-REDACTED]"


def test_generated_draft_with_a_pending_citation_is_withheld(drafting_client):
    client, chain = drafting_client
    chain.invoke.return_value = SimpleNamespace(content="Authority: (2003) 4 GLR 3121.")

    response = client.post("/api/v1/generate-draft", json={"case_id": "demo", "draft_type": "BRIEF"})

    assert response.status_code == 200
    assert response.json()["success"] is False
    assert response.json()["draft_content"] == ""
    assert "Citation Gate" in response.json()["error"]


def test_provider_errors_are_not_returned_to_the_caller(drafting_client):
    client, chain = drafting_client
    chain.invoke.side_effect = RuntimeError("Provider body includes private data")

    response = client.post("/api/v1/generate-draft", json={"case_id": "demo", "draft_type": "BRIEF"})

    assert response.status_code == 200
    assert response.json() == {
        "success": False, "draft_content": "", "error": "Draft generation failed. Please retry."
    }
