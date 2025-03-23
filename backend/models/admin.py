from flask import Flask
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb+srv://<username>:<password>@cluster.mongodb.net/myDatabase"
mongo = PyMongo(app)

class AdminModel:
    @staticmethod
    def create_admin(email, password):
        hashed_password = generate_password_hash(password)
        mongo.db.admins.insert_one({"email": email, "password": hashed_password})

    @staticmethod
    def find_admin(email):
        return mongo.db.admins.find_one({"email": email})

    @staticmethod
    def check_password(stored_password, provided_password):
        return check_password_hash(stored_password, provided_password)
