from flask import Flask, jsonify
from flask_cors import CORS
from config import get_database  # Assure-toi que cette fonction est correcte

app = Flask(__name__)
CORS(app)  # Active CORS pour toutes les requêtes

# Connexion à MongoDB
db = get_database()
hotels_collection = db["hotels"]

@app.route("/hotels", methods=["GET"])
def get_hotels():
    hotels = list(hotels_collection.find({}, {"_id": 0}))  # Ne pas renvoyer l'ID MongoDB
    if not hotels:
        return jsonify({"message": "Aucun hôtel trouvé"}), 404
    return jsonify(hotels)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
