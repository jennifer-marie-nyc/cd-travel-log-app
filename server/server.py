from flask_app import app
from flask_app.controllers import users, trips, destinations, journal_entries
from flask_app.controllers import auth
# from flask_app.fetch_destinations import populate_destinations

if __name__ == '__main__':
    # Populate destinations from REST Countries API
    # populate_destinations()
    app.run(debug=True, host='localhost', port='8080')