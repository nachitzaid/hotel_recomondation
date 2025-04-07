import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI_HOTELS

if (!uri) {
  throw new Error('MongoDB URI is not defined in the environment variables')
}

const client = new MongoClient(uri)

function cleanHotelData(hotel: any) {
  // Créer un nouvel objet en nettoyant les clés (enlevant les espaces superflus)
  const cleanedHotel: any = {}

  // Itérer sur les clés et enlever les espaces autour des clés
  for (const key in hotel) {
    if (hotel.hasOwnProperty(key)) {
      const cleanedKey = key.trim() // Enlever les espaces avant et après la clé
      cleanedHotel[cleanedKey] = hotel[key]
    }
  }

  return cleanedHotel
}

export async function GET() {
  try {
    await client.connect()
    const db = client.db('hotels')
    const hotels = await db.collection('hotels').find().limit(20).toArray()

    // Nettoyer chaque hôtel dans la réponse
    const cleanedHotels = hotels.map(cleanHotelData)

    return NextResponse.json(cleanedHotels)
  } catch (error) {
    console.error('Error while fetching hotels:', error)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  } finally {
    await client.close()
  }
}