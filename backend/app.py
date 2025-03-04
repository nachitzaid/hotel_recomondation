from flask import Flask, jsonify
from config import get_database  # Assure-toi d'importer la fonction correctement

app = Flask(__name__)

# Connexion à MongoDB via config.py
db = get_database()
hotels_collection = db["hotels"]  # Assure-toi que la collection s'appelle bien "hotels"

@app.route("/hotels", methods=["GET"])
def get_hotels():
    hotels = list(hotels_collection.find({}, {"_id": 0}))  # Ne pas afficher l'ID MongoDB
    if not hotels:
        return jsonify({"message": "Aucun hôtel trouvé"}), 404
    return jsonify(hotels)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
