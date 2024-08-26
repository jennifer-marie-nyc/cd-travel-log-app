# from flask_app.config.mysqlconnection import connectToMySQL
# import requests
# import json

# def populate_destinations():
#     # Clear existing destinations
#     delete_query = """
#         DELETE FROM destinations
#     """
#     connectToMySQL('travel_journal_schema').query_db(delete_query)
#     print("Destinations table cleared")

#     # Fetch country data from the REST Countries API
#     req = requests.get('https://restcountries.com/v3.1/all?fields=name')
#     data = json.loads(req.content)
#     all_country_names = []
#     for country in data:
#         country_name = country['name']['common']
#         all_country_names.append(country_name)

#     # Insert country names into destinations table of DB
#     for country_name in all_country_names:
#         insert_query = """
#             INSERT INTO destinations
#             (name)
#             VALUES (%(name)s)
#         """
#         data = {
#             'name': country_name
#         }
#         connectToMySQL('travel_journal_schema').query_db(insert_query, data)
#     print('Country names successfully added to database')

# # Run function to populate destinations in DB from REST Countries API
# populate_destinations()