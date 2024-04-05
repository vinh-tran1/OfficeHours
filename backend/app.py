"""
program: app.py
description: flask app
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import database as db

####################################################
# instantiate flask app
####################################################
app = Flask(__name__, template_folder='/')
CORS(app)

####################################################
# user routes
####################################################

# Admin Sign Up
@app.route('/api/signup/admin', methods=['POST'])
def admin_signup():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')
    role = data.get('role')

    if not all([email, name, password, role]):
        return jsonify({'status': 'error', 'response': 'Missing required fields'}), 400
    
    if db.admin_exists(email):
        return jsonify({'status': 'error', 'response': 'Admin already exists'}), 409

    try:
        # Check if the user already exists to avoid duplicates
        db.add_admin(email, name, password, role)
        admin = db.get_admin_by_email(email)

        return jsonify({'status': 'success', 'response': 'Admin created successfully', 'user': admin})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed to create admin: {e}'}), 500

# Admin Login
@app.route('/api/login/admin', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    role = data.get('role')
    password = data.get('password')

    if not email or not password:
        return jsonify({'status': 'error', 'response': 'Missing email or password'}), 400

    admin = db.get_admin_by_email(email)

    if role and role != admin['role']:
        return jsonify({'status': 'error', 'response': 'Invalid credentials'}), 401

    if admin and db.check_password(admin['password'], password):
        return jsonify({'status': 'success', 'response': 'Login successful', 'user': admin})
    else:
        return jsonify({'status': 'error', 'response': 'Invalid credentials'}), 401

# Student Sign Up
@app.route('/api/signup/student', methods=['POST'])
def student_signup():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')

    if not all([email, name, password]):
        return jsonify({'status': 'error', 'response': 'Missing required fields'}), 400
    
    if db.user_exists(email):
        return jsonify({'status': 'error', 'response': 'Student already exists'}), 409

    try:
        # Check if the user already exists to avoid duplicates
        db.add_student(email, name, password)
        user = db.get_student_by_email(email)

        return jsonify({'status': 'success', 'response': 'User created successfully', 'user': user})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed to create user: {e}'}), 500

# Student Login
@app.route('/api/login/student', methods=['POST'])
def student_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'status': 'error', 'response': 'Missing email or password'}), 400

    user = db.get_student_by_email(email)
    if user and db.check_password(user['password'], password):
        return jsonify({'status': 'success', 'response': 'Login successful', 'user': user})
    else:
        return jsonify({'status': 'error', 'response': 'Invalid credentials'}), 401
    
####################################################
# TA routes
####################################################
    
# get TA
@app.route('/api/tas', methods=['GET'])
def get_tas():
    try:
        tas = db.get_tas()
        return jsonify({'status': 'success', 'tas': tas})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Failed to retrieve TAs: {e}'}), 500

# get TAs for a specific class
@app.route('/api/class/<class_id>/tas', methods=['GET'])
def get_class_tas(class_id):
    try:
        tas = db.get_tas_for_class(class_id)
        # if not tas:
        #     return jsonify({'status': 'error', 'response': 'No TAs found for the class or class does not exist'}), 404
        return jsonify({'status': 'success', 'tas': tas})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Failed to retrieve TAs for class {class_id}: {e}'}), 500

####################################################
# class routes
####################################################

# Create class
@app.route('/api/class', methods=['POST'])
def post_class():
    data = request.get_json()
    abbr = data.get('abbr')
    name = data.get('name')
    time = data.get('time')
    time_hours = data.get('time-hours')
    room = data.get('room')
    admin_id = data.get('admin_id')
    tas = data.get('tas')
    if abbr is None or name is None or time is None or time_hours is None or room is None or admin_id is None or tas is None:
        return jsonify({'status': 'error', 'response': 'Missing input value'}), 400
    
    time = _convert_time_to_string(time, time_hours)
    try:
        if db.class_exists(abbr):
            return jsonify({'status': 'error', 'response': 'Class already exists'}), 400
        
        db.add_class(abbr, name, time, 0)
        db.add_class_room(abbr, room)
        db.add_class_admin(abbr, admin_id)

        if len(tas) > 0:
            for ta in tas:
                ta_full = db.get_admin_by_email(ta)
                db.add_class_admin(abbr, ta_full['id'])

        return jsonify({'status': 'success', 'response': f'Class {abbr} added'})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

# Read Class
@app.route('/api/class/<class_id>', methods=['GET'])
def read_class(class_id):
    if not db.class_exists(class_id):
        # class does not exist
        return jsonify({'status': 'error', 'response': f'Class {class_id} does not exist'}), 400
    
    try:
        class_info = db.read_class(class_id)
        return jsonify({'status': 'success', 'response': class_info})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500
    
# Read ALL Classes From Database
@app.route('/api/classes/all', methods=['GET'])
def get_all_classes():
    try:
        class_info = db.get_all_classes()
        return jsonify({'status': 'success', 'allClasses': class_info})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Failed with: {e}'}), 500
    
# Read All Professor Classes
@app.route('/api/admin/class', methods=['GET'])
def read_classes():
    admin_id = request.args.get("admin_id")
    try:
        classes = db.read_all_classes(admin_id)
        return jsonify({'status': 'success', 'response': classes})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

# Update Class
@app.route('/api/class/<class_id>', methods=['PUT'])
def update_class(class_id):
    if not db.class_exists(class_id):
        # class does not exist
        return jsonify({'status': 'error', 'response': f'Class {class_id} does not exist'}), 400
    
    data = request.get_json()
    name = data.get('name')
    time = data.get('time')
    time_hours = data.get('time-hours')
    hours = data.get('hours')
    admin_id = data.get('admin_id')
    addedTAs = data.get('addedTAs')
    removedTAs = data.get('removedTAs')
    if name is None and time is None and hours is None and time_hours is None:
        return jsonify({'status': 'error', 'response': 'All update values are empty'}), 400

    if admin_id is None or not db.class_verify_ownership(class_id, admin_id):
        return jsonify({'status': 'error', 'response': 'Not Authorized'}), 401

    if time is not None and time_hours is not None:
        time = _convert_time_to_string(time, time_hours)

    if addedTAs is not None:
        for ta in addedTAs:
            ta_full = db.get_admin_by_email(ta)
            db.add_class_admin(class_id, ta_full['id'])

    if removedTAs is not None:
        pass
    
    try:
        db.update_class(class_id, name, time, hours)
        return jsonify({'status': 'success', 'response': f'Class {class_id} updated'})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

# Delete Class
@app.route('/api/class/<class_id>', methods=['DELETE'])
def remove_class(class_id):
    data = request.get_json()
    admin_id = data.get('admin_id')
    if not db.class_exists(class_id):
        # class does not exist
        return jsonify({'status': 'error', 'response': f'Class {class_id} does not exist'}), 400
    
    if admin_id is None or not db.class_verify_ownership(class_id, admin_id):
        return jsonify({'status': 'error', 'response': 'Not Authorized'}), 401

    try:
        db.delete_class(class_id)
        return jsonify({'status': 'success', 'response': f'Class {class_id} deleted'})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

####################################################
# user class routes
####################################################  
#  GET user's classes
@app.route('/api/user/<user_id>/classes', methods=['GET'])
def get_user_classes(user_id):
    try:
        classes = db.read_user_classes(user_id)
        return jsonify({'status': 'success', 'response': classes})
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Failed with: {e}'}), 500
    
# POST add class for user
@app.route('/api/user/<user_id>/add-class', methods=['POST'])
def add_user_class(user_id):
    data = request.get_json()
    class_id = data.get('abbr')

    # check for class exists, user already taking
    if not class_id:
         return jsonify({'status': 'error', 'message': 'Missing input value'}), 400
       
    try:
        if not db.class_exists(class_id):
            return jsonify({'status': 'error', 'message': f'Class {class_id} does not exist'}), 400

        # user is already taking this class
        if db.user_class_exists(user_id, class_id):
            return jsonify({'status': 'error', 'message': f'User is alreading taking class {class_id}'}), 400
            
        db.add_user_class(user_id, class_id)

        # retrieve new classes
        new_class = db.read_class(class_id)

        # return new class to render on frontend
        return jsonify({'status': 'success', 'response': f'Class {class_id} added', 'newClass': new_class})
    
    except Exception as e:
        return jsonify({'status': 'error', 'message': f'Failed with: {e}'}), 500

# DELETE class for user
@app.route('/api/user/<user_id>/delete-class', methods=['DELETE'])
def remove_user_class(user_id):
    data = request.get_json()
    class_id = data.get('abbr')

    # check for class exists, user already taking
    if not class_id:
         return jsonify({'status': 'error', 'message': 'Missing input value'}), 400

    if not db.class_exists(class_id):
        return jsonify({'status': 'error', 'message': f'Class {class_id} does not exist'}), 400

    if not db.user_class_exists(user_id, class_id):
        return jsonify({'status': 'error', 'message': f'User is not taking this class {class_id}'}), 400
    
    try:
        db.delete_user_class(user_id, class_id)

        # retrieve deleted classes
        deleted_class = db.read_class(class_id)

        # return deleted class to render on frontend
        return jsonify({'status': 'success', 'response': f'Class {class_id} deleted from user {user_id}', 'deletedClass': deleted_class})
    
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

####################################################
# room routes
####################################################
    
# Get individual room
@app.route('/api/room/<room_id>', methods=['GET'])
def get_room(room_id):
    try:
        room = db.read_room(room_id)
        return jsonify({'status': 'success', 'response': room })
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

# Get all rooms
@app.route('/api/room', methods=['GET'])
def get_rooms():
    try:
        rooms = [r[0] for r in db.all_rooms()]
        return jsonify({'status': 'success', 'response': rooms })
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

# Create room
@app.route('/api/room', methods=['POST'])
def post_room():
    data = request.get_json()
    name = data.get('classroom_name')
    street = data.get('classroom_street')
    city = data.get('classroom_city')
    state = data.get('classroom_state')
    zipcode = data.get('classroom_zipcode')
    if name is None or street is None or city is None or state is None or zipcode is None:
        return jsonify({'status': 'error', 'response': 'Missing input value'}), 400
    
    try:
        if db.room_exists(name):
            return jsonify({'status': 'error', 'response': 'Room already exists'}), 400
        
        if not db.zipcode_exists(zipcode):
            db.add_zipcode(zipcode, city, state)
        
        db.add_room(name, street, zipcode)
        return jsonify({'status': 'success', 'response': f'Room {name} added'})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

####################################################
# events routes
####################################################
# Create event
@app.route('/api/events', methods=['POST'])
def post_event():
    data = request.get_json()
    name = data.get('name')
    room = data.get('location')
    time = data.get('time')
    start = data.get('start')
    end = data.get('end')
    admin_id = data.get('admin_id')
    class_id = data.get('class_id')
    if name is None or room is None or time is None or start is None or end is None or admin_id is None or class_id is None:
        return jsonify({'status': 'error', 'response': 'Missing input value'}), 400
    
    try:
        event_id = db.add_event(name, room, time, start, end)
        db.add_class_event(event_id, class_id)
        db.add_event_room(event_id, room)
        db.add_event_admin(event_id, admin_id)
        return jsonify({'status': 'success', 'response': f'Event {name} added'})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

# Read Events
@app.route('/api/events', methods=['GET'])
def read_events():
    admin_id = request.args.get("admin_id")
    class_id = request.args.get("class_id")

    try:
        events = db.all_events_class(admin_id, class_id)
        return jsonify({'status': 'success', 'response': events})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

# Read All Events
@app.route('/api/events/all', methods=['GET'])
def read_all_events():
    admin_id = request.args.get("admin_id")

    try:
        events = db.all_events(admin_id)
        return jsonify({'status': 'success', 'response': events})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500
    
# Read All Events Of a Specific Class
@app.route('/api/class/<class_id>/events', methods=['GET'])
def read_class_events(class_id):
    # class_id = request.args.get("class_id")

    if not class_id:
        return jsonify({'status': 'error', 'message': 'Missing class id'}), 400
    
    try:
        events = db.get_class_events(class_id)
        return jsonify({'status': 'success', 'response': events})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500
    
# Read All User Events
@app.route('/api/user/<user_id>/events', methods=['GET'])
def read_user_events_all(user_id):
    # class_id = request.args.get("class_id")

    if not user_id:
        return jsonify({'status': 'error', 'message': 'Missing user id'}), 400
    
    try:
        events = db.get_all_user_events(user_id)
        return jsonify({'status': 'success', 'response': events})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

# Delete Event
@app.route('/api/events/<event_id>', methods=['DELETE'])
def delete_event(event_id):
    data = request.get_json()
    admin_id = data.get('admin_id')
    if not db.event_exists(event_id):
        # event does not exist
        return jsonify({'status': 'error', 'response': f'Event {event_id} does not exist'}), 400
   
    if admin_id is None or not db.event_verify_ownership(event_id, admin_id):
        return jsonify({'status': 'error', 'response': 'Not Authorized'}), 401

    try:
        db.delete_event(event_id)
        return jsonify({'status': 'success', 'response': f'Event {event_id} deleted'})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

####################################################
# private functions
####################################################

def _convert_time_to_string(time, time_hours):
    days_abbreviation = ''.join(['M' if day == 'monday' else
                                'T' if day == 'tuesday' else
                                'W' if day == 'wednesday' else
                                'Th' if day == 'thursday' else
                                'F' if day == 'friday' else ''
                                for day in time])
    return f"{days_abbreviation} {time_hours}"