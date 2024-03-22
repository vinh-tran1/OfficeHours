"""
program: app.py
description: flask app
"""

from flask import Flask, jsonify
from flask_cors import CORS

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
