import json
from flask import Flask, request, jsonify
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
                                unset_jwt_cookies, jwt_required, JWTManager
from flask_app import app
from flask_app.models.user import User

# CREDIT FOR JWT AUTH CODE GOES TO FARUQ ABDULSALAM
# THE BASIS FOR JWT AUTH CODE IS FROM HIS TUTUORIAL,
# WHICH CAN BE FOUND AT: https://dev.to/nagatodev/how-to-add-login-authentication-to-a-flask-and-react-application-23i7

# Configure JWT
app.config["JWT_SECRET_KEY"] = "8c364f84be8cbb652f385566cf12bb75e508b898365fb5d43eb1f5e9ee7e4752"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
jwt = JWTManager(app)

@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original response.
        return response

@app.route('/token', methods=['POST'])
def create_token():
    # email = request.json.get("email", None)
    # password = request.json.get("password", None)
    # if email != "test" or password != "test":
    #     return {"msg": "Wrong email or password"}, 401
    form_data = request.json
    valid_user = User.login(form_data)
    
    # Return error message if login fails validations
    if not valid_user:
        return(jsonify({"msg": "Login details incorrect"})), 401

    # Return JWT token if login is successful
    access_token = create_access_token(identity=valid_user.id)
    response = {
        "access_token":access_token,
        "user_id": valid_user.id,
        "email": valid_user.email,
        "first_name": valid_user.first_name

        }
    return jsonify(response)

@app.route('/regtoken/<int:new_user_id>', methods=['POST'])
def login_after_new_reg(new_user_id):
    access_token = create_access_token(identity=new_user_id)
    response = {
        "access_token": access_token,
    }
    return jsonify(response)

@app.route('/logout', methods=['POST'])
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response