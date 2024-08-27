from flask_app.config.mysqlconnection import connectToMySQL
import re
from flask_app import bcrypt

class User:
    db = 'travel_journal_schema'
    def __init__(self, data):
        self.id = data['id']
        self.first_name = data['first_name']
        self.last_name = data['last_name']
        self.email = data['email']
        self.username = data['username']
        self.password = data['password']

    @staticmethod
    def create(form_data):
        query = """
            INSERT INTO users
            (first_name, last_name, email, username, password)
            VALUES (%(first_name)s, %(last_name)s, %(email)s, %(username)s, %(password)s);
        """

        secure_user_data = {
            'first_name': form_data['firstName'],
            'last_name': form_data['lastName'],
            'email': form_data['email'],
            'username': form_data['username'],
            'password': bcrypt.generate_password_hash(form_data['password'])
        }

        user_id = connectToMySQL('travel_journal_schema').query_db(query, secure_user_data)

        return user_id
    
    @classmethod
    def validate_user(cls, form_data):
        errors = {}
        print("Validating form data...")

        # Validate first name
        if len(form_data['firstName'].strip()) == 0:
            errors['firstName'] = ('First name is required')
        elif len(form_data['firstName'].strip()) < 2:
            errors['firstName'] = ('First name must be at least 2 characters.')

        # Validate last name
        if len(form_data['lastName'].strip()) == 0:
            errors['lastName'] = ('Last name is required')
        elif len(form_data['lastName'].strip()) < 2:
            errors['lastName'] = ('Last name must be at least 2 characters')

        # Validate that email was entered
        if len(form_data['email'].strip()) == 0:
            errors.setdefault('email', []).append('Email is required')
        # If email entered, continue with other email validation checks
        else: 
            # Validate that email does not yet exist in DB
            query = """
                SELECT * FROM users
                WHERE email = %(email)s;
            """

            secure_user_data = {
            'email': form_data['email']
        }
            
            results = connectToMySQL(cls.db).query_db(query, secure_user_data)

            if len(results) > 0:
                errors.setdefault('email', []).append('User with this email already exists')

            # Validate email format
            EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')
            if not EMAIL_REGEX.match(form_data['email']):
                errors.setdefault('email', []).append('Invalid email format')

        # Validate that username was entered
        if len(form_data['username'].strip()) == 0:
            errors.setdefault('username', []).append('Username is required')

            # If username entered, continue with other email validation checks
        else: 
            # Validate that username does not yet exist in DB
            query = """
                SELECT * FROM users
                WHERE username = %(username)s;
            """
            results = connectToMySQL(cls.db).query_db(query, form_data)

            if len(results) > 0:
                errors.setdefault('username', []).append('User with this username already exists')

            # Validate username format
            USERNAME_REGEX = re.compile(r'^[0-9A-Za-z]{6,16}$')
            if not USERNAME_REGEX.match(form_data['username']):
                errors.setdefault('username', []).append('Username must be between 6 and 16 characters and can only contain numbers and lettters.')

        # Validate that password was entered:
        if len(form_data['password'].strip()) == 0:
            errors.setdefault('password', []).append('Password is required')
        # If password was entered, continue with other password validation checks:
        else: 
            # Validate password confirmation
            if form_data['password'] != form_data['confirmPassword']:
                errors.setdefault('password', []).append('Passwords must match')
            # Password must contain at least 8 characters, at least one uppercase letter, one lowercase letter, one number, and one special character
            PASSWORD_REGEX = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};:'\"\\|,.<>/?~`])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};:'\"\\|,.<>/?~`]{8,}$")

            if not PASSWORD_REGEX.match(form_data['password']):
                errors.setdefault('password', []).append('Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character')

        return errors
    
    @classmethod
    def validate_login(cls, form_data):
        is_valid = True

        if not form_data['email']:
            is_valid = False

        if not form_data['password']:
            is_valid = False
        print('past first validation')
        return is_valid
    
    @classmethod
    def login(cls, form_data):
        if not cls.validate_login(form_data):
            return False

        # Determine whether the email exists in the DB
        query = """
                SELECT * FROM users
                WHERE email = %(email)s;
            """
        results = connectToMySQL(cls.db).query_db(query, form_data)

        if len(results) < 1:
            print('Email does not exist in db')
            return False
        
        # Determine whether the password provided matches the password in the DB
        if not bcrypt.check_password_hash(results[0]['password'], form_data['password']):
            print('Password incorrect')
            return False
        
        # If login form passes validation checks, return a User object
        return cls(results[0])