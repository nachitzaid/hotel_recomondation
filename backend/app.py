import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from bson import ObjectId
from bson.errors import InvalidId
from functools import wraps
from datetime import datetime 
# Ajouter ce code au début du fichier, après les imports
import logging
logging.basicConfig(level=logging.DEBUG)

# Chargement des variables d'environnement
load_dotenv()

# Initialisation de l'application Flask
app = Flask(__name__)
# Remplacez votre configuration CORS actuelle par celle-ci
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Configuration MongoDB
def get_mongo_client(uri):
    try:
        return MongoClient(uri)
    except Exception as e:
        app.logger.error(f"Erreur de connexion à MongoDB: {str(e)}")
        raise

# Connexion aux bases de données
try:
    client_users = get_mongo_client(os.getenv("MONGODB_URI_USERS"))
    db_users = client_users.get_database()
    users_collection = db_users["users"]

    client_hotels = get_mongo_client(os.getenv("MONGODB_URI_HOTELS"))
    db_hotels = client_hotels.get_database()
    hotels_collection = db_hotels["hotels"]
    reservations_collection = db_hotels["reservations"]
    payments_collection = db_hotels["payments"]
except Exception as e:
    app.logger.error(f"Erreur d'initialisation MongoDB: {str(e)}")

# Décorateurs utilitaires
def handle_errors(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except InvalidId:
            return jsonify({"error": "ID invalide"}), 400
        except Exception as e:
            app.logger.error(f"Erreur dans {f.__name__}: {str(e)}")
            return jsonify({"error": "Erreur interne du serveur"}), 500
    return wrapper

def validate_json(*required_fields):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            data = request.get_json()
            if not data:
                return jsonify({"error": "Données JSON requises"}), 400
            for field in required_fields:
                if field not in data:
                    return jsonify({"error": f"Champ requis manquant: {field}"}), 400
            return f(*args, **kwargs)
        return wrapper
    return decorator

@app.route("/test", methods=["GET"])
def test():
    return jsonify({"status": "ok", "message": "Le serveur fonctionne correctement"}), 200
@app.route("/signup", methods=["POST"])
def signup():
    try:
        # Validation des données reçues
        if not request.is_json:
            return jsonify({
                "success": False, 
                "error": "Données JSON requises"
            }), 400

        # Récupération des données
        user_data = request.get_json()
        
        # Extraction et nettoyage des données
        first_name = user_data.get("firstName", "").strip()
        phone = user_data.get("phone", "").strip()
        email = user_data.get("email", "").lower().strip()
        password = user_data.get("password", "").strip()

        # Validation des champs
        if not all([first_name, phone, email, password]):
            missing_fields = [
                field for field, value in {
                    "firstName": first_name, 
                    "phone": phone, 
                    "email": email, 
                    "password": password
                }.items() if not value
            ]
            return jsonify({
                "success": False, 
                "error": f"Champs requis manquants: {', '.join(missing_fields)}"
            }), 400

        # Vérification si l'email existe déjà
        existing_user = users_collection.find_one({"email": email})
        if existing_user:
            return jsonify({
                "success": False, 
                "error": "Un compte avec cet email existe déjà"
            }), 409

        # Hachage du mot de passe
        try:
            hashed_password = generate_password_hash(password, method="pbkdf2:sha256")
        except Exception as hash_error:
            print(f"Erreur de hachage du mot de passe : {hash_error}")
            return jsonify({
                "success": False, 
                "error": "Erreur lors du traitement du mot de passe"
            }), 500

        # Préparation des données utilisateur
        new_user = {
            "firstName": first_name,
            "phone": phone,
            "email": email,
            "password": hashed_password,
            "role": "user",
            "status": "active",
            "createdAt": datetime.utcnow()
        }

        # Insertion dans la base de données
        try:
            result = users_collection.insert_one(new_user)
            return jsonify({
                "success": True, 
                "message": "Inscription réussie",
                "userId": str(result.inserted_id)
            }), 201
        except Exception as insert_error:
            print(f"Erreur d'insertion : {insert_error}")
            return jsonify({
                "success": False, 
                "error": "Erreur lors de l'enregistrement"
            }), 500

    except Exception as e:
        print(f"Erreur critique lors de l'inscription : {e}")
        traceback.print_exc()
        return jsonify({
            "success": False, 
            "error": "Erreur serveur lors de l'inscription"
        }), 500

@app.route("/login", methods=["POST"])
def login():
    try:
        # Validation des données reçues
        if not request.is_json:
            return jsonify({
                "success": False, 
                "error": "Données JSON requises"
            }), 400

        # Récupération des données
        user_data = request.get_json()
        
        # Extraction et nettoyage des données
        email = user_data.get("email", "").lower().strip()
        password = user_data.get("password", "").strip()

        # Validation des champs
        if not email or not password:
            return jsonify({
                "success": False, 
                "error": "Email et mot de passe requis"
            }), 400

        # Recherche de l'utilisateur
        user = users_collection.find_one({"email": email})
        
        # Vérification de l'utilisateur et du mot de passe
        if not user or not check_password_hash(user["password"], password):
            return jsonify({
                "success": False, 
                "error": "Email ou mot de passe incorrect"
            }), 401

        # Préparer les données utilisateur à retourner
        user_response = {
            "success": True,
            "message": "Connexion réussie",
            "user": {
                "email": user["email"],
                "firstName": user["firstName"],
                "role": user.get("role", "user")
            }
        }

        return jsonify(user_response), 200

    except Exception as e:
        print(f"Erreur critique lors de la connexion : {e}")
        traceback.print_exc()
        return jsonify({
            "success": False, 
            "error": "Erreur serveur lors de la connexion"
        }), 500
# Routes pour les hôtels (public)
@app.route("/hotels", methods=["GET"])
@handle_errors
def get_hotels():
    hotels = list(hotels_collection.find({}, {"_id": 0}))
    return jsonify(hotels) if hotels else jsonify([])

# Routes d'administration
@app.route("/admin/users", methods=["GET"])
@handle_errors
def get_users():
    users = list(users_collection.find({}, {"password": 0}))
    for user in users:
        user["_id"] = str(user["_id"])
    return jsonify(users)

@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f"Erreur non gérée: {str(e)}")
    import traceback
    traceback.print_exc()
    return jsonify({
        "success": False,
        "error": str(e)
    }), 500

# Assurez-vous que toutes les réponses ont le header Content-Type: application/json
@app.after_request
def add_header(response):
    response.headers['Content-Type'] = 'application/json'
    return response

# Ajoutez ce code de débogage dans app.py
@app.route("/test_db", methods=["GET"])
def test_db():
    try:
        # Tester la connexion à la base de données
        users_count = users_collection.count_documents({})
        return jsonify({"success": True, "message": f"Connexion réussie, {users_count} utilisateurs trouvés"}), 200
    except Exception as e:
        return jsonify({"success": False, "error": f"Erreur de connexion à MongoDB: {str(e)}"}), 500

@app.route("/admin/users/<id>", methods=["GET"])
@handle_errors
def get_user(id):
    user = users_collection.find_one({"_id": ObjectId(id)}, {"password": 0})
    if not user:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    user["_id"] = str(user["_id"])
    return jsonify(user)

@app.route("/admin/users/<id>", methods=["PUT"])
@validate_json("status")
@handle_errors
def update_user(id):
    data = request.get_json()
    
    if "password" in data:
        data["password"] = generate_password_hash(data["password"], method="pbkdf2:sha256")
    
    result = users_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )
    
    if result.matched_count == 0:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    
    return jsonify({"message": "Utilisateur mis à jour"})

@app.route("/admin/users/<id>", methods=["DELETE"])
@handle_errors
def delete_user(id):
    result = users_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Utilisateur non trouvé"}), 404
    return jsonify({"message": "Utilisateur supprimé"})

# Routes pour la gestion des hôtels (admin)
@app.route("/admin/hotels", methods=["GET"])
@handle_errors
def admin_get_hotels():
    # Récupérer les paramètres de pagination
    limit = request.args.get('limit', type=int, default=10)  # Limite par défaut à 10
    skip = request.args.get('skip', type=int, default=0)
    
    # Construire la requête avec pagination
    query = hotels_collection.find({}).skip(skip).limit(limit)
    
    # Compter le nombre total de documents (sans pagination)
    total_count = hotels_collection.count_documents({})
    
    # Convertir les ObjectId en str pour la sérialisation JSON
    hotels = []
    for hotel in query:
        hotel["_id"] = str(hotel["_id"])
        hotels.append(hotel)
    
    # Retourner les résultats avec métadonnées de pagination
    return jsonify({
        "hotels": hotels,
        "total": total_count,
        "page": skip // limit + 1 if limit > 0 else 1,
        "limit": limit,
        "pages": (total_count + limit - 1) // limit if limit > 0 else 1
    })

@app.route("/admin/hotels/<id>", methods=["GET"])
@handle_errors
def admin_get_hotel(id):
    hotel = hotels_collection.find_one({"_id": ObjectId(id)})
    if not hotel:
        return jsonify({"error": "Hôtel non trouvé"}), 404
    hotel["_id"] = str(hotel["_id"])
    return jsonify(hotel)

@app.route("/admin/hotels", methods=["POST"])
@validate_json("name", "location", "description")
@handle_errors
def create_hotel():
    data = request.get_json()
    result = hotels_collection.insert_one(data)
    return jsonify({
        "message": "Hôtel créé",
        "id": str(result.inserted_id)
    }), 201

@app.route("/admin/hotels/<id>", methods=["PUT"])
@handle_errors
def update_hotel(id):
    data = request.get_json()
    
    # Trouver l'hôtel avant la mise à jour
    hotel = hotels_collection.find_one({"_id": ObjectId(id)})
    
    if not hotel:
        return jsonify({"error": "Hôtel non trouvé"}), 404
    
    # Mettre à jour l'hôtel
    result = hotels_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )
    
    # Récupérer l'hôtel mis à jour
    updated_hotel = hotels_collection.find_one({"_id": ObjectId(id)})
    
    # Convertir ObjectId en string
    updated_hotel["_id"] = str(updated_hotel["_id"])
    
    return jsonify(updated_hotel)

@app.route("/admin/hotels/<id>", methods=["DELETE"])
@handle_errors
def delete_hotel(id):
    result = hotels_collection.delete_one({"_id": ObjectId(id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Hôtel non trouvé"}), 404
    return jsonify({"message": "Hôtel supprimé"})

# Gestion des réservations
@app.route("/admin/reservations", methods=["GET"])
@handle_errors
def get_reservations():
    reservations = list(reservations_collection.find({}))
    for res in reservations:
        res["_id"] = str(res["_id"])
        res["user_id"] = str(res.get("user_id", ""))
        res["hotel_id"] = str(res.get("hotel_id", ""))
    return jsonify(reservations)

@app.route("/admin/reservations/<id>/status", methods=["PUT"])
@validate_json("status")
@handle_errors
def update_reservation_status(id):
    status = request.json["status"]
    result = reservations_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        return jsonify({"error": "Réservation non trouvée"}), 404
    return jsonify({"message": "Statut mis à jour"})

# Statistiques du dashboard
@app.route("/admin/dashboard/stats", methods=["GET"])
@handle_errors
def get_stats():
    stats = {
        "hotels_count": hotels_collection.count_documents({}),
        "users_count": users_collection.count_documents({}),
        "reservations_count": reservations_collection.count_documents({}),
        "total_revenue": sum(
            payment.get("amount", 0) 
            for payment in payments_collection.find({"status": "completed"})
        )
    }
    return jsonify(stats)

# Gestion des erreurs 404
@app.errorhandler(404)
def not_found(error):
    return jsonify({"error": "Endpoint non trouvé"}), 404

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=os.getenv("FLASK_DEBUG", "false").lower() == "true")