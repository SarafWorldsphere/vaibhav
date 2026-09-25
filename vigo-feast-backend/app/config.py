from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "VIGO FEAST Backend"
    app_env: str = "development"
    app_version: str = "1.0.0"

    database_url: str

    db_schema: str = "public"
    db_table_prefix: str = "vgf_"

    default_page_size: int = 20
    max_page_size: int = 100

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


settings = Settings()