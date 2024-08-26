from flask_app.config.mysqlconnection import connectToMySQL

class Journal_entry:
    db = 'travel_journal_schema'
    def __init__(self, data):
        self.id = data['id']
        self.content = data['content']
        self.trip_id = data['user_trip_id']
        self.user_id = data['user_id']
        self.created_at = data['created_at']
        print(type(self.created_at))

    def formatted_creation_date(self):
        return self.created_at.strftime('%b %d, %Y')

    @staticmethod
    def create(form_data):
        query = """
        INSERT INTO journal_entries
        (content, user_trip_id, user_id)
        VALUES (%(content)s, %(user_trip_id)s, %(user_id)s)
        """
        data = {
        'user_id': int(form_data['userId']),
        'user_trip_id': int(form_data['tripId']),
        'content': form_data['content']
    }

        entry_id = connectToMySQL('travel_journal_schema').query_db(query, data)

        return entry_id
    
    @classmethod
    def get_one_by_id(cls, entry_id):
        query = """
            SELECT *
            FROM journal_entries
            WHERE
            id = %(entry_id)s
        """

        data = {
            'entry_id': entry_id
        }

        results = connectToMySQL(cls.db).query_db(query, data)
        entry_data = results[0]
        entry = cls(entry_data)

        return entry
    
    @classmethod
    def get_all_by_trip(cls, trip_id):
        query = """
            SELECT * 
            FROM journal_entries
            WHERE user_trip_id = %(trip_id)s;
        """

        data = {
            'trip_id': trip_id
        }

        results = connectToMySQL(cls.db).query_db(query, data)

        all_entries = []

        for row in results:
            entry = cls(row)
            all_entries.append(entry)

        return all_entries

    @staticmethod
    def update_entry(entry_id, form_data):
        query = """
            UPDATE journal_entries
            SET
            content = %(content)s
            WHERE
            id = %(entry_id)s
        """
        data = {
            'entry_id': entry_id,
            'content': form_data['content']
        }

        connectToMySQL('travel_journal_schema').query_db(query, data)

    @staticmethod
    def delete_entry(entry_id):
        query = """
            DELETE FROM journal_entries
            WHERE id = %(id)s
        """
        data = {
            'id': entry_id
        }

        connectToMySQL('travel_journal_schema').query_db(query, data)

    @classmethod
    def validate_entry(cls, form_data):
        errors = {}
        if not form_data['content']:
            errors['content'] = ('Journal entry text is required.')
        return errors