"""
program: app.py
description: flask app
"""

from flask import Flask, jsonify

####################################################
# instantiate flask app
####################################################
app = Flask(__name__, template_folder='/')

####################################################
# home routes
####################################################
@app.route('/', methods=['GET'])
def home():
    return jsonify({ 'reponse':'home test' })

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
def test_student():
    return jsonify({ 'response':'student test' })

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
