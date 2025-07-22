from sqlalchemy import create_engine, inspect

engine = create_engine(
    "sqlite:///C:/americo/ia_dema/z-proyeto_final/emotion-elderly-app/app.db"
)
inspector = inspect(engine)
print(inspector.get_table_names())
