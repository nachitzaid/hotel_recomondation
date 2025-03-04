import pandas as pd
from config import get_database

# Connexion à la base de données MongoDB
db = get_database()
hotels_collection = db["hotels"]  # Nom de la collection où stocker les hôtels

# Charger le dataset CSV
df = pd.read_csv("dataset/TBO_Hotels.csv")

# Convertir les données en format JSON pour MongoDB
hotels_data = df.to_dict(orient="records")

# Insérer les données dans MongoDB
hotels_collection.insert_many(hotels_data)

# Afficher les premières lignes
print(df.head())

# Afficher les noms des colonnes
print("Colonnes du fichier :", df.columns)

