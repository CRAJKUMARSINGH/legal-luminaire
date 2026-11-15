"""Central configuration — reads from .env"""
import logging
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    openai_api_key: str = ""
    tavily_api_key: str = ""
    serper_api_key: str = ""

    # Harvey.ai configuration
    harvey_api_key: str = ""
    harvey_region: str = "us"
    harvey_enabled: bool = False

    chroma_persist_dir: str = "./chroma_db"
    case_docs_dir: str = "./uploaded_cases"

    # Redis configuration
    redis_url: str = "redis://localhost:6379/0"
    cache_ttl_default: int = 3600       # 1 hour
    cache_ttl_embeddings: int = 86400   # 24 hours
    cache_ttl_search: int = 1800        # 30 minutes

    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: str = "http://localhost:5173,http://localhost:3000"

    # Deployment environment — controls CORS strictness
    # Set APP_ENV=production in deployment to reject wildcard origins.
    app_env: str = "development"

    # Harvey model settings
    harvey_model: str = "gpt-4o"   # gpt-5 does not exist; safe default
    harvey_include_citations: bool = True

    llm_model: str = "gpt-4o"
    llm_temperature_research: float = 0.0
    llm_temperature_draft: float = 0.2
    embedding_model: str = "text-embedding-3-small"

    max_requests_per_minute: int = 10
    max_tokens_per_request: int = 8000

    # Hallucination circuit breaker threshold (0.0–1.0)
    # Block output when the ungrounded ratio exceeds this value.
    hallucination_threshold: float = 0.25

    # ── Validators ────────────────────────────────────────────────────────────

    @field_validator("cors_origins")
    @classmethod
    def validate_cors_origins(cls, v: str) -> str:
        """
        Reject wildcard '*' origins in production and empty origin strings.

        In development the wildcard is allowed so local tooling is not blocked.
        In production (APP_ENV=production) a wildcard exposes the API to any
        origin and must be refused.

        Note: APP_ENV is not yet available here because field validators run
        field-by-field.  We re-check at startup in main.py using settings.app_env.
        This validator catches the common misconfiguration of an empty string.
        """
        if not v.strip():
            raise ValueError(
                "CORS_ORIGINS must not be empty. "
                "Set at least one explicit allowed origin (e.g. http://localhost:5173)."
            )
        return v

    @field_validator("hallucination_threshold")
    @classmethod
    def validate_hallucination_threshold(cls, v: float) -> float:
        if not (0.0 <= v <= 1.0):
            raise ValueError(
                f"HALLUCINATION_THRESHOLD must be between 0.0 and 1.0, got {v}"
            )
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

    # ── Properties ────────────────────────────────────────────────────────────

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def chroma_path(self) -> Path:
        return Path(self.chroma_persist_dir)

    @property
    def case_docs_path(self) -> Path:
        return Path(self.case_docs_dir)

    def check_production_cors(self) -> None:
        """
        Call this at application startup (after settings is instantiated).
        Raises ValueError if wildcard CORS is configured in production.
        """
        if self.app_env == "production" and "*" in self.cors_origins_list:
            raise ValueError(
                "CORS_ORIGINS contains '*' but APP_ENV=production. "
                "Set explicit allowed origins for production deployments."
            )
        if self.app_env == "production":
            logger.info("CORS origins (production): %s", self.cors_origins_list)
        else:
            logger.info(
                "CORS origins (%s): %s", self.app_env, self.cors_origins_list
            )


settings = Settings()
