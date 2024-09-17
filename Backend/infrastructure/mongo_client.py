from pymongo import MongoClient
from app.config import settings

class MongoDBClient:
    def __init__(self):
        self.mongoClient = MongoClient(settings.MONGO_URI)
        self.dbMongo = self.mongoClient[settings.MONGO_DB_NAME]

    def get_databaseMongo(self):
        return self.dbMongo
