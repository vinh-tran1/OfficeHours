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
import bcrypt

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
# auth signup + login for students & admins
####################################################

def add_student(email: str, name: str, password: str) -> None:
    """
    Add a new student to the database.
    """
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = """
                INSERT INTO users (email, name, password, created_at)
                VALUES (%s, %s, %s, NOW())
            """
            curs.execute(insert_stmt, (email, name, hashed_password))
            conn.commit()

def user_exists(email: str) -> bool:
    """
    Check if a user exists based on the email.
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = "SELECT EXISTS(SELECT 1 FROM users WHERE email = %s);"
            curs.execute(select_stmt, (email,))
            exists = curs.fetchone()[0]
            return exists
        
def add_admin(email: str, name: str, password: str, role: str) -> None:
    """
    Add a new admin to the database.
    """
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = """
                INSERT INTO admins (email, name, password, role)
                VALUES (%s, %s, %s, %s)
            """
            curs.execute(insert_stmt, (email, name, hashed_password, role))
            conn.commit()

def admin_exists(email: str) -> bool:
    """
    Check if an admin exists based on the email.
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = "SELECT EXISTS(SELECT 1 FROM admins WHERE email = %s);"
            curs.execute(select_stmt, (email,))
            exists = curs.fetchone()[0]
            return exists
        
def check_password(hashed_password: str, user_password: str) -> bool:
    """
    Verify the provided password against the hashed password.
    :param hashed_password: The hashed password stored in the database (hexadecimal string).
    :param user_password: The plaintext password provided by the user.
    :return: True if the password is correct, False otherwise.
    """
    # Remove the '\x' prefix and decode from hex if it's in hex format
    if hashed_password.startswith(r'\x'):
        hashed_password_bytes = bytes.fromhex(hashed_password[2:])
    else:
        hashed_password_bytes = hashed_password.encode('utf-8')
    
    # Encode the user-provided password to bytes
    user_password_bytes = user_password.encode('utf-8')
    
    return bcrypt.checkpw(user_password_bytes, hashed_password_bytes)

def get_student_by_email(email: str) -> dict:
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = "SELECT id, email, name, password FROM users WHERE email = %s;"
            curs.execute(select_stmt, (email,))
            user = curs.fetchone()
            if user:
                columns = ['id', 'email', 'name', 'password']
                return dict(zip(columns, user))
            return None
        
def get_admin_by_email(email: str) -> dict:
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = "SELECT id, email, name, password, role FROM admins WHERE email = %s;"
            curs.execute(select_stmt, (email,))
            user = curs.fetchone()
            if user:
                columns = ['id', 'email', 'name', 'password', 'role']
                return dict(zip(columns, user))
            return None

def get_tas() -> list:
    """
    Get all TAs from the admin table
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as curs:
            select_stmt = """
                SELECT email, name
                FROM admins
                WHERE role = 'TA'
                ORDER BY name;
            """
            curs.execute(select_stmt)
            tas = curs.fetchall()
            return [dict(ta) for ta in tas] if tas else []


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

def add_class_admin(abbr: str, admin_id: int) -> None:
    """
    Add link between class and admin.
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = "INSERT INTO class_admins (class_id, admin_id) VALUES (%s, %s)"
            curs.execute(insert_stmt, (abbr, admin_id))
            conn.commit()

def remove_class_admin(abbr: str, admin_id: int) -> None:
    """
    remove ta from class
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:

            delete_events = """DELETE FROM events e
                               USING event_admins ea, class_events ce
                               WHERE
                                    e.id = ea.event_id
                                    AND ea.event_id = ce.event_id
                                    AND ea.admin_id = %s 
                                    AND ce.class_id = %s; """
            curs.execute(delete_events, (admin_id, abbr))

            delete_class_admins = """DELETE FROM class_admins ca
                                     WHERE ca.admin_id = %s AND ca.class_id = %s"""
            curs.execute(delete_class_admins, (admin_id, abbr))

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
                LIMIT 1
            """
            curs.execute(select_stmt, (class_id, ))
            row = curs.fetchone()
            columns = [desc[0] for desc in curs.description]

            return dict(zip(columns, row)) if row else {}

def read_all_classes(admin_id: str) -> list:
    """
    read all classes given admin_id
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = """
                SELECT c.abbr, c.name, c.hours, c.time, r.name AS room, r.street, r.zipcode
                FROM class c
                LEFT JOIN class_rooms cr ON c.abbr = cr.class_id
                LEFT JOIN rooms r ON r.name = cr.room_id
                LEFT JOIN class_admins ca ON c.abbr = ca.class_id
                LEFT JOIN admins a ON a.id = ca.admin_id
                WHERE a.id = %s
                GROUP BY c.abbr, r.name
                LIMIT 1000
            """
            curs.execute(select_stmt, (admin_id, ))
            rows = curs.fetchall()
            return rows
        
def get_all_classes() -> list:
    """
    get ALL classes in database
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = """
                SELECT c.abbr, c.name
                FROM class c
            """
            curs.execute(select_stmt, )
            rows = curs.fetchall()
            columns = [desc[0] for desc in curs.description]
            classes = [dict(zip(columns, row)) for row in rows] if rows else []
            return classes

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

def increment_hours(class_id: str) -> None:
    """
    increase the number of hours in a class
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            update_stmt = "UPDATE class SET hours = hours + 1 WHERE abbr = %s"
            curs.execute(update_stmt, (class_id, ))
            conn.commit()

def decrement_hours(event_id: int) -> None:
    """
    decrease the number of hours in a class
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            update_stmt = """UPDATE class c
                             SET hours = hours - 1
                             FROM class_events ce
                             WHERE c.abbr = ce.class_id
                             AND ce.event_id = %s;"""
            curs.execute(update_stmt, (event_id, ))
            conn.commit()

def delete_class(class_id: str) -> None:
    """
    Delete class where class = class_id
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            delete_class_rooms = "DELETE FROM class_rooms WHERE class_id = %s"
            curs.execute(delete_class_rooms, (class_id, ))

            delete_class_events = "DELETE FROM class_events WHERE class_id = %s"
            curs.execute(delete_class_events, (class_id, ))

            delete_class_admins = "DELETE FROM class_admins WHERE class_id = %s"
            curs.execute(delete_class_admins, (class_id, ))

            delete_stmt = "DELETE FROM class WHERE abbr = %s"
            curs.execute(delete_stmt, (class_id, ))
            conn.commit()

def class_exists(class_id: str) -> bool:
    """
    Check if class exists
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = "SELECT EXISTS(SELECT 1 FROM class WHERE abbr = %s);"
            curs.execute(select_stmt, (class_id, ))
            exists = curs.fetchone()[0]
            return exists

def class_verify_ownership(class_id: str, admin_id: str) -> bool:
    """
    Check if admin owns class
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = "SELECT EXISTS(SELECT 1 FROM class_admins WHERE class_id = %s AND admin_id = %s);"
            curs.execute(select_stmt, (class_id, admin_id))
            exists = curs.fetchone()[0]
            return exists
        
def get_tas_for_class(class_id: str) -> list:
    """
    Get all TAs (Teaching Assistants) for a specific class.
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as curs:
            # SQL query that joins class_admins and admins tables
            # to find admins with the role of 'TA' for the specified class.
            select_stmt = """
                SELECT a.id, a.email, a.name, a.role
                FROM admins a
                INNER JOIN class_admins ca ON a.id = ca.admin_id
                WHERE ca.class_id = %s AND a.role = 'TA'
                ORDER BY a.name;
            """
            curs.execute(select_stmt, (class_id,))
            tas = curs.fetchall()
            return [dict(ta) for ta in tas] if tas else []

def get_total_events(class_id: str):
    """
    return the total events for a class
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = """SELECT COUNT(event_id) AS event_count
                            FROM class_events
                            WHERE class_id = %s;"""
            curs.execute(select_stmt, (class_id,))
            events = curs.fetchone()[0]
            return events

####################################################
# user classes crud
####################################################  
def add_user_class(user_id: int, class_id: str) -> None:
    """
    Add class to db (user and user_class). App should verify that abbr is unique and values != None
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = "INSERT INTO user_classes (uid, class_id) VALUES (%s, %s);"
            curs.execute(insert_stmt, (user_id, class_id))
            conn.commit()

def read_user_classes(user_id: int) -> list:
    """
    Read all of a user's classs given given user_id
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = """
                SELECT c.abbr, c.name, c.hours, c.time, r.name AS room, r.street, r.zipcode
                FROM class c
                LEFT JOIN user_classes uc ON c.abbr = uc.class_id
                LEFT JOIN class_rooms cr on c.abbr = cr.class_id
                LEFT JOIN rooms r ON r.name = cr.room_id
                WHERE uc.uid = %s
                ORDER BY c.abbr, r.name
                LIMIT 1000;
            """
            curs.execute(select_stmt, (user_id,))
            rows = curs.fetchall()
            columns = [desc[0] for desc in curs.description]
            classes = [dict(zip(columns, row)) for row in rows] if rows else []

            return classes
        
def delete_user_class(user_id: int, class_id: str) -> None:
    """
    Delete user's class from user_classes db given user_id and class_id
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            delete_stmt = """
                DELETE FROM user_classes
                WHERE uid = %s AND class_id = %s;
            """
            curs.execute(delete_stmt, (user_id, class_id))
            conn.commit()

def user_class_exists(user_id: int, class_id: str) -> bool:
    """
    Check if user is already taking a class
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = "SELECT EXISTS(SELECT 1 FROM user_classes WHERE uid = %s AND class_id = %s);"
            curs.execute(select_stmt, (user_id, class_id))
            already_enrolled = curs.fetchone()[0]
            return already_enrolled

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
def add_event(name: str, location: str, time: str, start: str, end: str) -> int:
    """
    Add event to db.
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = """INSERT INTO events (name, location, time, start, \"end\")
                             VALUES (%s, %s, %s, %s, %s)
                             RETURNING id"""
            curs.execute(insert_stmt, (name, location, time, start, end))
            event_id = curs.fetchone()[0] 
            conn.commit()
            return event_id

def add_class_event(event_id: int, class_id: str) -> None:
    """
    Add link between event and class.
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = "INSERT INTO class_events (event_id, class_id) VALUES (%s, %s)"
            curs.execute(insert_stmt, (event_id, class_id))
            conn.commit()

def add_event_room(event_id: int, room: str) -> None:
    """
    Add link between event and room.
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = "INSERT INTO event_rooms (event_id, room_id) VALUES (%s, %s)"
            curs.execute(insert_stmt, (event_id, room))
            conn.commit()

def add_event_admin(event_id: int, admin_id: int) -> None:
    """
    Add link between event and admin.
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = "INSERT INTO event_admins (event_id, admin_id) VALUES (%s, %s)"
            curs.execute(insert_stmt, (event_id, admin_id))
            conn.commit()

def all_events_class(admin_id: str, class_id: str) -> None: 
    """
    Return all events
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor) as curs:
            select_stmt = """SELECT e.id, e.name, e.location, e.time, e.start, e.end 
                             FROM events e
                             LEFT JOIN event_admins ea ON ea.event_id = e.id
                             LEFT JOIN admins a ON ea.admin_id = a.id
                             LEFT JOIN class_events ce ON ce.event_id = e.id
                             LEFT JOIN class c ON ce.class_id = c.abbr
                             WHERE a.id = %s AND c.abbr = %s
                             GROUP BY e.id
                             ORDER BY e.name
                             LIMIT 1000
                            """
            curs.execute(select_stmt, (admin_id, class_id))
            sql_rows = curs.fetchall()
            rows = []
            for row in sql_rows:
                rows.append(dict(row))
            return rows

def all_events(admin_id: str) -> None: 
    """
    Return all events
    """
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor) as curs:
            select_stmt = """SELECT e.id, e.name, e.location, e.time, e.start, e.end, ce.class_id, er.room_id, r.street, r.zipcode, a.name AS admin
                             FROM events e
                             LEFT JOIN event_admins ea ON ea.event_id = e.id
                             LEFT JOIN admins a ON ea.admin_id = a.id
                             LEFT JOIN class_events ce ON ce.event_id = e.id
                             LEFT JOIN event_rooms er ON er.event_id = e.id
                             LEFT JOIN rooms r ON r.name = er.room_id
                             WHERE a.id = %s
                             GROUP BY e.id, a.name, ce.class_id, er.room_id, r.street, r.zipcode
                             ORDER BY e.name
                             LIMIT 1000
                            """
            curs.execute(select_stmt, (admin_id, ))
            sql_rows = curs.fetchall()
            rows = []
            for row in sql_rows:
                rows.append(dict(row))

            return rows
        
def get_class_events(class_id: str) -> list:
    """
    Return all events associated with a class
    """
    with get_db_connection() as conn:
            with conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor) as curs:
                select_stmt = """
                    SELECT e.id, e.name, e.location, e.time, e.start, e.end, a.name AS admin
                    FROM events e
                    LEFT JOIN class_events ce ON ce.event_id = e.id
                    LEFT JOIN class c ON ce.class_id = c.abbr
                    LEFT JOIN event_admins ea ON ea.event_id = e.id
                    LEFT JOIN admins a ON ea.admin_id = a.id
                    WHERE c.abbr = %s
                    GROUP BY e.id, a.name
                    ORDER BY e.name
                    LIMIT 1000
                """
                curs.execute(select_stmt, (class_id, ))
                sql_rows = curs.fetchall()
                rows = []
                for row in sql_rows:
                    rows.append(dict(row))

                return rows
            
def get_all_user_events(user_id: str) -> list:
    """
    Return all of a student's events
    """
    with get_db_connection() as conn:
            with conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor) as curs:
                select_stmt = """
                    SELECT e.id, e.name, e.location, e.time, e.start, e.end, ce.class_id, er.room_id, r.street, r.zipcode
                    FROM events e
                    LEFT JOIN class_events ce ON ce.event_id = e.id
                    LEFT JOIN class c ON ce.class_id = c.abbr
                    LEFT JOIN user_classes uc ON uc.class_id = c.abbr
                    LEFT JOIN users u ON u.id = uc.uid
                    LEFT JOIN event_rooms er ON er.event_id = e.id
                    LEFT JOIN rooms r ON r.name = er.room_id
                    WHERE u.id = %s
                    GROUP BY e.id, ce.class_id, er.room_id, r.street, r.zipcode
                    ORDER BY e.name
                    LIMIT 1000
                """
                curs.execute(select_stmt, (user_id, ))
                sql_rows = curs.fetchall()
                rows = []
                for row in sql_rows:
                    rows.append(dict(row))

                return rows


def delete_event(event_id: int) -> None:
    """
    Delete event where event = event_id
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            delete_event_rooms = "DELETE FROM event_rooms WHERE event_id = %s"
            curs.execute(delete_event_rooms, (event_id, ))

            delete_class_events = "DELETE FROM class_events WHERE event_id = %s"
            curs.execute(delete_class_events, (event_id, ))

            delete_event_admins = "DELETE FROM event_admins WHERE event_id = %s"
            curs.execute(delete_event_admins, (event_id, ))
            
            delete_stmt = "DELETE FROM events WHERE id = %s"
            curs.execute(delete_stmt, (event_id, ))
            conn.commit()

def event_exists(event_id: int) -> bool:
    """
    Check if event exists
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = "SELECT EXISTS(SELECT 1 FROM events WHERE id = %s);"
            curs.execute(select_stmt, (event_id, ))
            exists = curs.fetchone()[0]
            return exists

def event_verify_ownership(event_id: str, admin_id: str) -> bool:
    """
    Check if admin owns event
    """
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            select_stmt = "SELECT EXISTS(SELECT 1 FROM event_admins WHERE event_id = %s AND admin_id = %s);"
            curs.execute(select_stmt, (event_id, admin_id))
            exists = curs.fetchone()[0]
            return exists

def get_hidden_events(admin_id: str) -> list:
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor) as curs:
            select_stmt = """
                SELECT e.id
                    FROM events e
                    LEFT JOIN hidden_events_admins he ON he.event_id = e.id
                    LEFT JOIN admins a ON a.id = he.admin_id
                    WHERE a.id = %s
                    GROUP BY e.id, a.id
                    ORDER BY e.name
                    LIMIT 1000
            """
            curs.execute(select_stmt, (admin_id, ))
            sql_rows = curs.fetchall()
            rows = []
            for row in sql_rows:
                rows.append(dict(row))

            return rows

def get_hidden_user_events(user_id: str) -> list:
    with get_db_connection() as conn:
        with conn.cursor(cursor_factory = psycopg2.extras.RealDictCursor) as curs:
            select_stmt = """
                SELECT e.id
                    FROM events e
                    LEFT JOIN hidden_events he ON he.event_id = e.id
                    LEFT JOIN users u ON u.id = he.user_id
                    WHERE u.id = %s
                    GROUP BY e.id, u.id
                    ORDER BY e.name
                    LIMIT 1000
            """
            curs.execute(select_stmt, (user_id, ))
            sql_rows = curs.fetchall()
            rows = []
            for row in sql_rows:
                rows.append(dict(row))

            return rows

def hide_events(event_id: str, admin_id: str) -> None:
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = "INSERT INTO hidden_events_admins (event_id, admin_id) VALUES (%s, %s) ON CONFLICT DO NOTHING"
            curs.execute(insert_stmt, (event_id, admin_id))
            conn.commit()

def hide_user_events(event_id: str, user_id: str) -> None:
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            insert_stmt = "INSERT INTO hidden_events (event_id, user_id) VALUES (%s, %s) ON CONFLICT DO NOTHING"
            curs.execute(insert_stmt, (event_id, user_id))
            conn.commit()

def unhide_events(event_id: str, admin_id: str) -> None:
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            print('here')
            delete_stmt = "DELETE FROM hidden_events_admins he WHERE he.event_id = %s AND he.admin_id = %s"
            curs.execute(delete_stmt, (event_id, admin_id))
            conn.commit()

def unhide_user_events(event_id: str, user_id: str) -> None:
    with get_db_connection() as conn:
        with conn.cursor() as curs:
            delete_stmt = "DELETE FROM hidden_events he WHERE he.event_id = %s AND he.user_id = %s"
            curs.execute(delete_stmt, (event_id, user_id))
            conn.commit()

####################################################
# private functions
####################################################

def _create_update_stmt(table: str, where_id: str, where_name: str, **kwargs) -> tuple[str, tuple]: # type: ignore
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


