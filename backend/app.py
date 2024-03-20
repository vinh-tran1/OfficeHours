from flask import Flask, request, make_response,render_template, redirect, url_for, abort

# Instantiate Flask App
app = Flask(__name__, template_folder='./templates')