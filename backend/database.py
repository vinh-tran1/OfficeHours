"""
program: database.py
description: database interactions with POSTGRES db
"""
import os
from sys import stderr, exit as sys_exit
from dotenv import load_dotenv
import psycopg2
from psycopg2 import OperationalError, connect

load_dotenv()

# List of required env variables
REQUIRED = ["PGENDPOINT", "PGDATABASE", "PGUSERNAME", "PGPASSWORD"]

# Check that env variables are set
env_vars = {}
for env_var in REQUIRED:
    env_val = os.getenv(env_var)
    if env_val is None:
        sys_exit(f"{env_var} is not set in environment")
    else:
        env_vars[env_var] = env_val

# Set connection info
conn_info = {
    "host": env_vars["PGENDPOINT"],
    "database": env_vars["PGDATABASE"],
    "user": env_vars["PGUSERNAME"],
    "password": env_vars["PGPASSWORD"]
}

####################################################
# class crud
####################################################

def add_class(abbr: str, name: str, time: str, hours: int) -> None:
    """
    Add class to db. App should verify that abbr is unique and values != None
    """
    try:
        with connect(**conn_info) as conn:
            with conn.cursor() as curs:
                insert_stmt = "INSERT INTO class (abbr, name, time, hours) VALUES (%s, %s, %s, %s)"
                curs.execute(insert_stmt, (abbr, name, time, hours))
                conn.commit()
    except OperationalError as e:
        sys_exit(f"Unable to connect to the database: {e}")
    except Exception as e:
        sys_exit(f"An unexpected error occurred: {e}")

def read_class(classID: str):
    pass

def update_class(classID: str, name: str, time: str, hours: int):
    """
    Update class with new values. App should check that at least one of the values is not none
    """
    try:
        with connect(**conn_info) as conn:
            with conn.cursor() as curs:
                update_stmt, used_values = _create_update_stmt(classID, name, time, hours)
                curs.execute(update_stmt, used_values)
                conn.commit()
    except OperationalError as e:
        sys_exit(f"Unable to connect to the database: {e}")
    except Exception as e:
        sys_exit(f"An unexpected error occurred: {e}")

def delete_class(classID: str):
    """
    Delete class where class = classID
    """
    try:
        with connect(**conn_info) as conn:
            with conn.cursor() as curs:
                delete_stmt = "DELETE FROM class WHERE abbr = %s"
                curs.execute(delete_stmt, (classID, ))
                conn.commit()
    except OperationalError as e:
        sys_exit(f"Unable to connect to the database: {e}")
    except Exception as e:
        sys_exit(f"An unexpected error occurred: {e}")

def class_exists(abbr: str) -> bool:
    """
    Check if class exists
    """
    try:
        with connect(**conn_info) as conn:
            with conn.cursor() as curs:
                select_stmt = "SELECT EXISTS(SELECT 1 FROM class WHERE abbr = %s);"
                curs.execute(select_stmt, (abbr, ))
                exists = curs.fetchone()[0]
                return exists
    except OperationalError as e:
        sys_exit(f"Unable to connect to the database: {e}")
    except Exception as e:
        sys_exit(f"An unexpected error occurred: {e}")

print("hello world")


####################################################
# private functions
####################################################

def _create_update_stmt(classID: str, name: str, time: str, hours: int):
    update_stmt = "UPDATE class SET "
    update_parts = []
    used_values = []

    if name is not None:
        update_parts.append("name = %s")
        used_values.append(name)
    if time is not None:
        update_parts.append("time = %s")
        used_values.append(time)
    if hours is not None:
        update_parts.append("hours = %s")
        used_values.append(hours)

    update_stmt += ", ".join(update_parts)
    update_stmt += " WHERE abbr = %s"
    used_values.append(classID)
    return update_stmt, tuple(used_values)