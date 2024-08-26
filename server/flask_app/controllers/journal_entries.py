from flask import jsonify, request
from flask_jwt_extended import jwt_required
from flask_app import app
from flask_app.models.journal_entry import Journal_entry

@app.route('/api/entries/all/<int:trip_id>', methods=['GET'])
@jwt_required()
def display_all_entries(trip_id):
    all_entry_objects = Journal_entry.get_all_by_trip(trip_id)
    all_entry_dicts = []
    # Serialize python objects (convert into dictionaries) to be passed into jsonify
    for entry in all_entry_objects:
        entry_dict = {
            'id': entry.id,
            'content': entry.content,
            'trip_id': entry.trip_id,
            'user_id': entry.user_id,
            'created_at': entry.formatted_creation_date()
        }
        all_entry_dicts.append(entry_dict)

    return jsonify(all_entry_dicts)

@app.route('/api/entries/<int:entry_id>', methods=['GET'])
@jwt_required()
def display_entry(entry_id):
    one_entry = Journal_entry.get_one_by_id(entry_id)
    # Serialize python objects (convert into dictionaries) to be passed into jsonify
    entry_dict = {
            'id': one_entry.id,
            'content': one_entry.content,
            'trip_id': one_entry.trip_id,
            'user_id': one_entry.user_id,
            'created_at': one_entry.formatted_creation_date()
        }
    return jsonify(entry_dict)


@app.route('/api/entries/new', methods=['POST'])
@jwt_required()
def create_entry():
    form_data = request.get_json()
    errors = Journal_entry.validate_entry(form_data)
    
    if errors:
        return jsonify({'errors': errors}), 400
    
    entry_id = Journal_entry.create(form_data)
    return jsonify({'message': 'Entry created successfully', 'entry_id': entry_id}), 201

@app.route('/api/entries/<int:entry_id>/edit', methods=['POST'])
@jwt_required()
def edit_entry(entry_id):
    form_data = request.get_json()
    errors = Journal_entry.validate_entry(form_data)
    
    if errors:
        return jsonify({'errors': errors}), 400
    
    Journal_entry.update_entry(entry_id, form_data)
    return jsonify({'message': 'Entry updated successfully.'}), 200

@app.route('/api/entries/delete/<int:entry_id>', methods=['DELETE'])
@jwt_required()
def delete_entry(entry_id):
    Journal_entry.delete_entry(entry_id)
    return jsonify({'message': 'Entry deleted successfully.'}), 200