"""
program: database.py
description: database interactions with POSTGRES db
"""
# mute broad exception warning pylint
# pylint: disable=broad-except
import os
from sys import stderr, exit as sys_exit
import logging
from contextlib import contextmanager
from dotenv import load_dotenv
from psycopg2 import OperationalError, connect
import psycopg2.extras

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

###### HANDLE DB CONNECTION && ERRORS ######
@contextmanager
def get_db_connection():
    """
    Context manager to get a database connection.
    """
    try:
        conn = connect(**conn_info)
        yield conn
    except OperationalError as e:
        logging.error(f"Database connection error: {e}")
        raise
    finally:
        conn.close()


####################################################
# class crud
####################################################

def add_class(abbr: str, name: str, time: str, hours: int) -> None:
    """
    Add class to db. App should verify that abbr is unique and values != None
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = "INSERT INTO class (abbr, name, time, hours) VALUES (%s, %s, %s, %s)"
            curs.execute(insert_stmt, (abbr, name, time, hours))
            conn.commit()

def add_class_room(abbr: str, room: str) -> None:
    """
    Add link between class and room.
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = "INSERT INTO class_rooms (class_id, room_id) VALUES (%s, %s)"
            curs.execute(insert_stmt, (abbr, room))
            conn.commit()

def read_class(class_id: str) -> tuple:
    """
    read a class given class_id
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = """
                SELECT c.abbr, c.name, c.hours, c.time, r.name AS room, r.street, r.zipcode
                FROM class c
                LEFT JOIN class_rooms cr ON c.abbr = cr.class_id
                LEFT JOIN rooms r ON r.name = cr.room_id
                WHERE c.abbr = %s
            """
            curs.execute(select_stmt, (class_id, ))
            row = curs.fetchone()
            columns = [desc[0] for desc in curs.description]

            return dict(zip(columns, row)) if row else {}

def update_class(class_id: str, name: str, time: str, hours: int) -> None:
    """
    Update class with new values. App should check that at least one of the values is not none
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            update_stmt, used_values = _create_update_stmt(
                "class", class_id, "abbr", name=name, time=time, hours=hours)
            curs.execute(update_stmt, used_values)
            conn.commit()

def delete_class(class_id: str) -> None:
    """
    Delete class where class = class_id
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            delete_stmt = "DELETE FROM class WHERE abbr = %s"
            curs.execute(delete_stmt, (class_id, ))
            conn.commit()

def class_exists(abbr: str) -> bool:
    """
    Check if class exists
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = "SELECT EXISTS(SELECT 1 FROM class WHERE abbr = %s);"
            curs.execute(select_stmt, (abbr, ))
            exists = curs.fetchone()[0]
            return exists

####################################################
# room crud
####################################################

def add_room(name: str, street: str, zipcode: int) -> None:
    """
    Add room to db. App should verify that name is unique and values != None
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = "INSERT INTO rooms (name, street, zipcode) VALUES (%s, %s, %s)"
            curs.execute(insert_stmt, (name, street, zipcode))
            conn.commit()
    

def read_room(room_id: str) -> tuple:
    """
    read a room given room_id
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = "SELECT * FROM rooms WHERE name = %s"
            curs.execute(select_stmt, (room_id, ))
            row = curs.fetchone()
            return row
    

def all_rooms() -> list:
    """
    pull all room names
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = "SELECT name FROM rooms ORDER BY name LIMIT 1000"
            curs.execute(select_stmt, )
            rows = curs.fetchall()
            return rows
    

def room_exists(name: str) -> bool:
    """
    Check if room exists
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = "SELECT EXISTS(SELECT 1 FROM rooms WHERE name = %s);"
            curs.execute(select_stmt, (name, ))
            exists = curs.fetchone()[0]
            return exists


####################################################
# zipcode crud
####################################################
def add_zipcode(zipcode: int, city: str, state: str) -> None:
    """
    Add zipcode to db.
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = "INSERT INTO zipcode (zipcode, city, state) VALUES (%s, %s, %s)"
            curs.execute(insert_stmt, (zipcode, city, state))
            conn.commit()
    


def zipcode_exists(zipcode: str) -> bool:
    """
    Check if zipcode exists
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = "SELECT EXISTS(SELECT 1 FROM zipcode WHERE zipcode = %s);"
            curs.execute(select_stmt, (zipcode, ))
            exists = curs.fetchone()[0]
            return exists
    
####################################################
# events crud
####################################################
def add_event(name: str, location: str, time: str, start: str, end: str) -> None:
    """
    Add event to db.
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = "INSERT INTO events (name, location, time, start, \"end\") VALUES (%s, %s, %s, %s, %s)"
            curs.execute(insert_stmt, (name, location, time, start, end))
            conn.commit()

# TODO - make it to where you take in admin ID
def all_events() -> None: 
    """
    Return all events
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor) as curs:
            select_stmt = "SELECT e.id, e.name, e.location, e.time, e.start, e.end FROM events e ORDER BY e.name LIMIT 1000"
            curs.execute(select_stmt, )
            sql_rows = curs.fetchall()
            rows = []
            for row in sql_rows:
                rows.append(dict(row))
            return rows

####################################################
# private functions
####################################################

def _create_update_stmt(table: str, where_id: str, where_name: str, **kwargs) -> tuple[str, tuple]:
    update_stmt = f"UPDATE {table} SET "
    update_parts = []
    used_values = []

    for key, value in kwargs.items():
        if value is not None:
            update_parts.append(key + " = %s")
            used_values.append(value)

    update_stmt += ", ".join(update_parts)
    update_stmt += " WHERE " + where_name + " = %s"
    used_values.append(where_id)
    return update_stmt, tuple(used_values)


