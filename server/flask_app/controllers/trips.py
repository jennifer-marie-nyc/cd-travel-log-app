from flask import jsonify, request
from flask_jwt_extended import jwt_required
from flask_app import app
from flask_app.models.trip import Trip

@app.route('/api/dashboard/<int:user_id>', methods=['GET'])
@jwt_required()
def display_dashboard(user_id):
    all_trip_objects = Trip.get_all_by_user_with_destinations(user_id)
    all_trip_dicts = []
    # Serialize python objects (convert into dictionaries) to be passed into jsonify
    for trip in all_trip_objects:
        trip_dict = {
            'id': trip.id,
            'user_id': trip.user_id,
            'destination_id': trip.destination_id,
            'destination': trip.destination.name,
            'start_date': trip.formatted_start_date(),
            'end_date': trip.formatted_end_date()
        }
        all_trip_dicts.append(trip_dict)
    
    return jsonify(all_trip_dicts)

@app.route('/api/trips/<int:trip_id>', methods=['GET'])
@jwt_required()
def display_trip(trip_id):
    one_trip = Trip.get_one_with_destination(trip_id)
    # Serialize python object (convert into dictionaries) to be passed into jsonify
    trip_dict = {
        'id': one_trip.id,
            'user_id': one_trip.user_id,
            'destination_id': one_trip.destination_id,
            'destination': one_trip.destination.name,
            'start_date': one_trip.formatted_start_date(),
            'end_date': one_trip.formatted_end_date()
    }
    return jsonify(trip_dict)

@app.route('/api/trips/new', methods=['POST'])
@jwt_required()
def create_trip():
    form_data = request.get_json()
    errors = Trip.validate_trip(form_data)
    
    if errors:
        return jsonify({'errors': errors}), 400
    
    trip_id = Trip.create(form_data)
    return jsonify({'message': 'Trip created successfully', 'trip_id': trip_id}), 201

@app.route('/api/trips/edit/<int:trip_id>', methods=['GET'])
@jwt_required()
def get_trip_for_edit(trip_id):
    one_trip = Trip.get_one_with_destination(trip_id)
    # Serialize python object (convert into dictionaries) to be passed into jsonify
    # Dates are converted into format needed for form
    trip_dict = {
        'id': one_trip.id,
            'user_id': one_trip.user_id,
            'destination_id': one_trip.destination_id,
            'destination': one_trip.destination.name,
            'start_date': one_trip.start_date.strftime('%Y-%m-%d'),
            'end_date': one_trip.end_date.strftime('%Y-%m-%d')
    }
    return jsonify(trip_dict)

@app.route('/api/trips/submit_edit/<int:trip_id>', methods=['POST'])
@jwt_required()
def edit_trip(trip_id):
    form_data = request.get_json()
    errors = Trip.validate_trip(form_data)

    if errors:
        return jsonify({'errors': errors}), 400
    
    Trip.update_trip(trip_id, form_data)
    return jsonify({'message': 'Trip updated successfully.'}), 200

@app.route('/api/trips/delete/<int:trip_id>', methods=['DELETE'])
@jwt_required()
def delete_trip(trip_id):
    Trip.delete_trip(trip_id)
    return jsonify({'message': 'Trip deleted successfully.'}), 200