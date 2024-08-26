from flask import render_template, redirect, request, session, url_for, jsonify
from flask_app import app
from flask_app.config.mysqlconnection import connectToMySQL
from flask_app.models.user import User
from pprint import pprint

@app.route('/')
def display_reg():
    return render_template('register.html')

@app.route('/api/newuser', methods=['POST'])
def create_user():
    form_data =  request.get_json()
    errors = User.validate_user(form_data)

    if errors:
        return jsonify({'errors': errors}), 400


    user_id = User.create(form_data)
    return jsonify({'message': 'User created successfully', 'user_id': user_id}), 201