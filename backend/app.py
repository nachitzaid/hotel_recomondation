import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
from bson import ObjectId
from bson.errors import InvalidId
from functools import wraps

# Chargement des variables d'environnement
load_dotenv()

# Initialisation de l'application Flask
app = Flask(__name__)
CORS(app, supports_credentials=True)

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

# Routes d'authentification
@app.route("/signup", methods=["POST"])
@validate_json("email", "password", "firstName", "phone")
def signup():
    data = request.get_json()
    email = data["email"].lower()
    
    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email déjà utilisé"}), 409

    hashed_password = generate_password_hash(data["password"], method="pbkdf2:sha256")
    
    user_data = {
        "firstName": data["firstName"],
        "phone": data["phone"],
        "email": email,
        "password": hashed_password,
        "role": "user",
        "status": "active",
        "registeredAt": datetime.now().isoformat()
    }
    
    result = users_collection.insert_one(user_data)
    return jsonify({
        "message": "Utilisateur créé avec succès",
        "userId": str(result.inserted_id)
    }), 201

# Modify the login route to ensure consistent response format
@app.route("/login", methods=["POST"])
@validate_json("email", "password")
def login():
    data = request.get_json()
    user = users_collection.find_one({"email": data["email"].lower()})
    
    if not user or not check_password_hash(user["password"], data["password"]):
        return jsonify({"error": "Email ou mot de passe incorrect"}), 401
    
    # Convert ObjectId to string for JSON serialization
    user_data = {
        "_id": str(user["_id"]),
        "firstName": user.get("firstName", ""),
        "email": user.get("email", ""),
        "phone": user.get("phone", ""),
        "role": user.get("role", "user"),
        "status": user.get("status", "active")
    }
    
    return jsonify({
        "message": "Connexion réussie",
        "user": user_data
    })



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