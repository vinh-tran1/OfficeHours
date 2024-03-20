"""
program: app.py
description: flask app
"""

from flask import Flask, jsonify, request, make_response, render_template, redirect, url_for, abort

# instantiate flask app
#-----------------------------------------------------------------------
app = Flask(__name__, template_folder='./templates')
#-----------------------------------------------------------------------

# routes
#-----------------------------------------------------------------------
@app.route('/')
def home():
    return jsonify({ 'test':'test' })
