import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors

# Charger les données (remplace cela par ton propre fichier ou source de données)
hotels = pd.read_csv(r'C:\Users\hp\Desktop\hotels_data.csv')  # Remplace par le chemin de ton fichier de données

# Vectorisation
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(hotels['combined'])

# Entraîner le modèle NearestNeighbors
nn = NearestNeighbors(algorithm='brute', metric='cosine', n_neighbors=6)
nn.fit(tfidf_matrix)

def recommend_hotels(hotel_name, num_recommendations=5):
    indices = pd.Series(hotels.index, index=hotels['HotelName'].str.lower())
    if hotel_name.lower() not in indices:
        return "Hôtel non trouvé."
    
    idx = indices[hotel_name.lower()]
    distances, indices = nn.kneighbors(tfidf_matrix[idx], n_neighbors=num_recommendations+1)
    hotel_indices = indices[0][1:]  # Exclusion de l'hôtel lui-même
    
    recommendations = hotels.iloc[hotel_indices][['countyName', 'cityName', 'HotelName', 'HotelRating', 'Address']]
    return recommendations.to_dict(orient='records')