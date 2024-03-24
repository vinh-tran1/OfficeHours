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
@app.route('/auth', methods=['GET'])
def test_auth():
    return jsonify({ 'response':'auth test' })

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

# Create class
@app.route('/api/class', methods=['POST'])
def post_class():
    abbr = request.form.get('abbr')
    name = request.form.get('name')
    time = request.form.get('time')
    hours = request.form.get('hours')
    if abbr is None or name is None or time is None or hours is None:
        return jsonify({'status': 'error', 'response': 'Missing input value'}), 400
    
    try:
        if db.class_exists(abbr):
            return jsonify({'status': 'error', 'response': 'Class already exists'}), 400
        else:    
            db.add_class(abbr, name, time, hours)
            return jsonify({'status': 'success', 'response': f'Class {abbr} added'})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

# Update Class
@app.route('/api/class/<classID>', methods=['PUT'])
def update_class(classID):
    if not db.class_exists(classID):
        # class does not exist
        return jsonify({'status': 'error', 'response': f'Class {classID} does not exist'}), 400
    
    name = request.form.get('name')
    time = request.form.get('time')
    hours = request.form.get('hours')
    if name is None and time is None and hours is None:
        return jsonify({'status': 'error', 'response': 'All update values are empty'}), 400

    try:
        db.update_class(classID, name, time, hours)
        return jsonify({'status': 'success', 'response': f'Class {classID} updated'})
    except Exception as e:
        return jsonify({'status': 'error', 'response': f'Failed with: {e}'}), 500

# Delete Class
@app.route('/api/class/<classID>', methods=['DELETE'])
def remove_class(classID):
    if not db.class_exists(classID):
        # class does not exist
        return jsonify({'status': 'error', 'response': f'Class {classID} does not exist'}), 400
    
    try:
        db.delete_class(classID)
        return jsonify({'status': 'success', 'response': f'Class {classID} deleted'})
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
