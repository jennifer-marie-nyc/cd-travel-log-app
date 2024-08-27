from flask import jsonify
from flask_app import app
from flask_app.models.destination import Destination
from pprint import pprint
import requests
import json

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

@app.route('/api/destinations/populate_all', methods=['GET'])
def populate_destinations_from_REST_Countries_api():
#   Get country data from the REST Countries API
    req = requests.get('https://restcountries.com/v3.1/all?fields=name')
    data = json.loads(req.content)
    all_country_names = []
    for country in data:
        country_name = country['name']['common']
        all_country_names.append(country_name)
    Destination.create_destinations_from_REST_Countries_api(all_country_names)
    return jsonify({"msg": "Destinations populated successfully"})
