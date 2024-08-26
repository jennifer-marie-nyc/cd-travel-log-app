from flask import Flask
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from os import environ

app = Flask(__name__)
CORS(app, origins="*")

app.secret_key = environ.get('SECRET_KEY_URLSAFE')

bcrypt = Bcrypt(app)