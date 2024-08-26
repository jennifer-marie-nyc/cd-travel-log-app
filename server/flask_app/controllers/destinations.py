from flask import jsonify
from flask_app import app
from flask_app.models.destination import Destination
from pprint import pprint

@app.route('/api/destinations/all', methods=['GET'])
def get_all_destinations():
    all_dest_objects = Destination.get_all()
    all_dest_dicts = []
    # Serialize python objects (convert into dictionaries) to be passed through jsonify
    for dest in all_dest_objects:
        dest_dict = {
            'id': dest.id,
            'name': dest.name
        }
        all_dest_dicts.append(dest_dict)
    pprint(all_dest_dicts)
    return jsonify(all_dest_dicts)