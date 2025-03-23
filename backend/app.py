from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os

# Charger les variables d'environnement
load_dotenv()

# Connexion à MongoDB
mongo_uri_users = os.getenv("MONGODB_URI_USERS")
mongo_uri_hotels = os.getenv("MONGODB_URI_HOTELS")

client_users = MongoClient(mongo_uri_users)  # Connexion à la base de données des utilisateurs
db_users = client_users.get_database()  # Accéder à la base de données des utilisateurs
users_collection = db_users["users"]

client_hotels = MongoClient(mongo_uri_hotels)  # Connexion à la base de données des hôtels
db_hotels = client_hotels.get_database()  # Accéder à la base de données des hôtels
hotels_collection = db_hotels["hotels"]

app = Flask(__name__)
CORS(app)

# Route pour afficher les hôtels
@app.route("/hotels", methods=["GET"])
def get_hotels():
    hotels = list(hotels_collection.find({}, {"_id": 0}))  # Ne pas renvoyer l'ID MongoDB
    if not hotels:
        return jsonify({"message": "Aucun hôtel trouvé"}), 404
    return jsonify(hotels)

## Route pour enregistrer un nouvel utilisateur
@app.route("/signup", methods=["POST"])
def signup():
    user_data = request.json  # Récupère les données envoyées par le frontend
    email = user_data.get("email").lower()  # Convertir l'email en minuscule pour éviter les doublons
    password = user_data.get("password")

    # Vérification si l'email existe déjà dans la base de données des utilisateurs
    if users_collection.find_one({"email": email}):
        return jsonify({"message": "Email déjà utilisé"}), 400

    # Hachage du mot de passe avant de l'enregistrer
    hashed_password = generate_password_hash(password, method="pbkdf2:sha256")

    # Définition du rôle par défaut ("user")
    role = "user"

    # Enregistrement de l'utilisateur dans la base de données des utilisateurs
    users_collection.insert_one({
        "firstName": user_data.get("firstName"),
        "phone": user_data.get("phone"),
        "email": email,
        "password": hashed_password,  # Stockage du mot de passe haché
        "role": role  # Ajout du rôle par défaut
    })
    
    return jsonify({"message": "Utilisateur créé avec succès"}), 201


@app.route("/login", methods=["POST"])
def login():
    user_data = request.json
    email = user_data.get("email").lower()
    password = user_data.get("password")

    print("Requête reçue:", user_data)  # Vérifier les données reçues

    # Recherche de l'utilisateur
    user = users_collection.find_one({"email": email})

    if user:
        print("Mot de passe stocké:", user["password"])  # Vérifier le hash stocké

    # Vérification du mot de passe
    if not user or not check_password_hash(user["password"], password):
        print("Échec de connexion: Email ou mot de passe incorrect")  # Debug
        return jsonify({"message": "Email ou mot de passe incorrect"}), 400

    print("Connexion réussie !")  # Confirmer la connexion réussie

    # Retourner les informations de l'utilisateur, y compris son rôle
    return jsonify({
        "message": "Connexion réussie",
        "role": user.get("role", "user"),  # Assure que le rôle est bien renvoyé
        "email": user["email"],
        "firstName": user["firstName"]
    }), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)










































# from flask import Flask, jsonify, request
# from flask_cors import CORS
# from pymongo import MongoClient
# from werkzeug.security import generate_password_hash, check_password_hash # Utilisé pour le hachage des mots de passe

# from config import get_database 
 

# app = Flask(__name__)
# CORS(app)  # Active CORS pour permettre l'accès à partir du frontend

# # Connexion à MongoDB
# client = MongoClient("mongodb://localhost:27017/")  # Assure-toi que MongoDB est en cours d'exécution
# db = client["mydatabase"]
# users_collection = db["users"]

# # Connexion à MongoDB
# # db = get_database()
# # hotels_collection = db["hotels"]

# # @app.route("/hotels", methods=["GET"])
# # def get_hotels():
# #     hotels = list(hotels_collection.find({}, {"_id": 0}))  # Ne pas renvoyer l'ID MongoDB
# #     if not hotels:
# #         return jsonify({"message": "Aucun hôtel trouvé"}), 404
# #     return jsonify(hotels)

# # Route pour enregistrer un nouvel utilisateur
# @app.route("/signup", methods=["POST"])
# def signup():
#     user_data = request.json  # Récupère les données envoyées par le frontend
#     email = user_data.get("email")
#     password = user_data.get("password")

#     # Vérification si l'email existe déjà dans la base de données
#     if users_collection.find_one({"email": email}):
#         return jsonify({"message": "Email déjà utilisé"}), 400

#     # Hachage du mot de passe avant de l'enregistrer
#     hashed_password = generate_password_hash(password, method="sha256")

#     # Enregistrement de l'utilisateur dans la base de données
#     users_collection.insert_one({
#         "firstName": user_data.get("firstName"),
#         "phone": user_data.get("phone"),
#         "email": email,
#         "password": hashed_password  # Stockage du mot de passe haché
#     })
#     return jsonify({"message": "Utilisateur créé avec succès"}), 201

# # Route pour la connexion (authentification)
# @app.route("/login", methods=["POST"])
# def login():
#     user_data = request.json
#     email = user_data.get("email")
#     password = user_data.get("password")

#     user = users_collection.find_one({"email": email})

#     # Vérification si l'utilisateur existe et si le mot de passe est correct
#     if not user or not check_password_hash(user["password"], password):
#         return jsonify({"message": "Email ou mot de passe incorrect"}), 400

#     return jsonify({"message": "Connexion réussie"}), 200


# if __name__ == "__main__":
#     app.run(debug=True, port=5000)





