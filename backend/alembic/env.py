#C:\americo\ia_dema\z-proyeto_final\emotion-elderly-app\backend\alembic\env.py
#env.py

# backend/alembic/env.py

import sys
import os

# Añade 'backend' al PYTHONPATH para que 'app' sea resoluble
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

from app.core.config import settings
from app.db.base import Base

# Importa tus modelos para que Base.metadata los conozca
import app.models.user
import app.models.role
import app.models.audio
import app.models.emotion
import app.models.alert

# metadata que Alembic usará para autogenerar
target_metadata = Base.metadata

# Carga configuración de alembic.ini
config = context.config
fileConfig(config.config_file_name)
config.set_main_option("sqlalchemy.url", str(settings.DATABASE_URL))


def run_migrations_offline():
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
    