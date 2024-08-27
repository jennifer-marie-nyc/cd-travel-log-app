from flask_app.config.mysqlconnection import connectToMySQL
from pprint import pprint

class Destination:
    db = 'travel_journal_schema'
    def __init__(self, data):
        self.id = data['id']
        self.name = data['name']

    @classmethod
    def get_all(cls):
        query = """
            SELECT * FROM destinations
            ORDER BY name
        """
        results = connectToMySQL(cls.db).query_db(query)
        # pprint(results)

        all_destinations = []

        for row in results:
            destination = cls(row)
            all_destinations.append(destination)

        return all_destinations
    
    @staticmethod
    def create_destinations_from_REST_Countries_api(all_country_names):
    # Insert country names into destinations table of DB
        for country_name in all_country_names:
            insert_query = """
                INSERT INTO destinations
                (name)
                VALUES (%(name)s)
            """
            data = {
                'name': country_name
            }
            connectToMySQL('travel_journal_schema').query_db(insert_query, data)
        print('Country names successfully added to database')