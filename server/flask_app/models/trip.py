from flask_app.config.mysqlconnection import connectToMySQL
from flask_app.models.destination import Destination
from pprint import pprint
from datetime import datetime

class Trip:
    db = 'travel_journal_schema'
    def __init__(self, data):
        self.id = data['id']
        self.user_id = data['user_id']
        self.destination_id = data['destination_id']
        self.destination = None
        self.start_date = data['start_date']
        self.end_date = data['end_date']
        

    def formatted_start_date(self):
        return self.start_date.strftime('%d %b, %Y')
    
    def formatted_end_date(self):
        return self.end_date.strftime('%d %b, %Y')

    @staticmethod
    def create(form_data):
        query = """
        INSERT INTO user_trips
        (user_id, destination_id, start_date, end_date)
        VALUES (%(user_id)s, %(destination_id)s, %(start_date)s, %(end_date)s)
        """
        data = {
        'user_id': int(form_data['userId']),
        'destination_id': int(form_data['destinationId']),
        'start_date': form_data['startDate'],
        'end_date': form_data['endDate']
    }

        trip_id = connectToMySQL('travel_journal_schema').query_db(query, data)

        return trip_id

    @classmethod
    def get_all_by_user_with_destinations(cls, user_id):
        query = """
            SELECT user_trips.id, user_id, destination_id, start_date, end_date, destinations.name AS destination
            FROM user_trips
            LEFT JOIN destinations
            ON user_trips.destination_id = destinations.id
            WHERE user_id = %(user_id)s
            ORDER BY start_date;
        """

        data = {
            'user_id': user_id
        }

        results = connectToMySQL(cls.db).query_db(query, data)
        pprint(results)

        all_trips = []

        for row in results:
            trip = cls(row)
            destination_data = {
                'id': row['destination_id'],
                'name': row['destination']
            }
            destination_obj = Destination(destination_data)
            trip.destination = destination_obj
            all_trips.append(trip)

        return all_trips
    
    @classmethod
    def get_one_with_destination(cls, trip_id):
        query = """
            SELECT user_trips.id, user_id, destination_id, start_date, end_date, destinations.name AS destination
            FROM user_trips
            LEFT JOIN destinations
            ON user_trips.destination_id = destinations.id
            WHERE user_trips.id = %(trip_id)s;
        """

        data = {
            'trip_id': trip_id
        }

        results = connectToMySQL(cls.db).query_db(query, data)
        pprint(results)
        trip_data = results[0]
        trip = cls(trip_data)
        destination_data = {
            'id': trip_data['destination_id'],
            'name': trip_data['destination']
        }
        destination_obj = Destination(destination_data)
        trip.destination = destination_obj

        return trip
    
    @staticmethod
    def update_trip(trip_id, form_data):
        query = """
            UPDATE user_trips
            SET
            destination_id = %(destination_id)s,
            start_date = %(start_date)s,
            end_date = %(end_date)s
            WHERE
            id = %(trip_id)s
        """
        data = {
        'trip_id': trip_id,
        'destination_id': int(form_data['destinationId']),
        'start_date': form_data['startDate'],
        'end_date': form_data['endDate']
        }

        connectToMySQL('travel_journal_schema').query_db(query, data)

    @staticmethod
    def delete_trip(trip_id):
        query = """
            DELETE FROM user_trips
            WHERE id = %(id)s
        """
        data = {
            'id': trip_id
        }

        connectToMySQL('travel_journal_schema').query_db(query, data)

    @classmethod
    def validate_trip(cls, form_data):
        errors = {}
        # if not form_data['userId']:
        #     print("user_id is missing")
        if not form_data['destinationId']:
            errors['destinationId'] = ('Destination is required.')
        if not form_data['startDate']:
            errors['startDate'] = ('Start date is required.')
        if not form_data['endDate']:
            errors['endDate'] = ('End date is required.')
        return errors
