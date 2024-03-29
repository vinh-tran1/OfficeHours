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
# home routes
####################################################
@app.route('/', methods=['GET'])
def home():
    return jsonify({ 'response':'home test' })

####################################################
# auth routes
####################################################

# Admin Sign Up
@app.route('/signup/admin', methods=['POST'])
def admin_signup():
    data = request.get_json()
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')
    role = data.get('role')

    if not all([email, name, password, role]):
        return jsonify({'status': 'error', 'response': 'Missing required fields'}), 400
    
    if db.professor_exists(email):
        return jsonify({'status': 'error', 'response': 'Professor already exists'}), 409

    try:
        # Check if the user already exists to avoid duplicates
        db.add_professor(email, name, password, role)
        return jsonify({'status': 'success', 'response': 'Admin created successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed to create admin: {e}'}), 500

# Admin Login
@app.route('/login/admin', methods=['POST'])
def admin_login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'status': 'error', 'response': 'Missing email or password'}), 400

    professor = db.get_professor_by_email(email)
    if professor and db.check_password(professor['password'], password):
        return jsonify({'status': 'success', 'response': 'Login successful', 'professor': professor})
    else:
        return jsonify({'status': 'error', 'response': 'Invalid credentials'}), 401

# Student Sign Up
@app.route('/signup/student', methods=['POST'])
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
        return jsonify({'status': 'success', 'response': 'User created successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed to create user: {e}'}), 500

# Student Login
@app.route('/login/student', methods=['POST'])
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
# student routes
####################################################
@app.route('/student', methods=['GET'])
def get_classes():
    # dummy data
    classes = [
        { 'title': 'CPSC 419', 'name': 'Full Stack', 'hours': '7' },
        { 'title': 'CPSC 323', 'name': 'Intro to Systems', 'hours': '20' },
        { 'title': 'CPSC 365', 'name': 'Algorithms', 'hours': '12' },
        { 'title': 'CPSC 223', 'name': 'Data Structures', 'hours': '4' },
        { 'title': 'CPSC 429', 'name': 'Software Engineering', 'hours': '2' }
    ]
    
    return jsonify(classes)

####################################################
# professor routes
####################################################
@app.route('/professor', methods=['GET'])
def test_professor():
    return jsonify({ 'response':'professor test' })


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
    if abbr is None or name is None or time is None or time_hours is None or room is None or admin_id is None:
        return jsonify({'status': 'error', 'response': 'Missing input value'}), 400
    
    time = _convert_time_to_string(time, time_hours)
    try:
        if db.class_exists(abbr):
            return jsonify({'status': 'error', 'response': 'Class already exists'}), 400
        
        db.add_class(abbr, name, time, 0)
        db.add_class_room(abbr, room)
        db.add_class_admin(abbr, admin_id)
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


# Read All Professor Classes
@app.route('/api/professor/class', methods=['GET'])
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
    if name is None and time is None and hours is None and time_hours is None:
        return jsonify({'status': 'error', 'response': 'All update values are empty'}), 400

    if admin_id is None or not db.class_verify_ownership(class_id, admin_id):
        return jsonify({'status': 'error', 'response': 'Not Authorized'}), 401

    if time is not None and time_hours is not None:
        time = _convert_time_to_string(time, time_hours)
    
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
    if name is None or room is None or time is None or start is None or end is None or admin_id is None:
        return jsonify({'status': 'error', 'response': 'Missing input value'}), 400
    
    try:
        event_id = db.add_event(name, room, time, start, end)
        db.add_event_room(event_id, room)
        db.add_event_admin(event_id, admin_id)
        return jsonify({'status': 'success', 'response': f'Event {name} added'})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

# Read Events
@app.route('/api/events', methods=['GET'])
def read_events():
    admin_id = request.args.get("admin_id")

    try:
        events = db.all_events(admin_id)
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
# calendar routes
####################################################
@app.route('/<user>/calendar', methods=['GET'])
def test_calendar(user):
    if user == 'student':
        return jsonify({'response': 'Student calendar accessed'})
    elif user == 'professor':
        return jsonify({'response': 'Professor calendar accessed'})
    else:
        return jsonify({'error': 'Invalid user'}), 404

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