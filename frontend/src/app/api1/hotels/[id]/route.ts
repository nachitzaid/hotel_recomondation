import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { ObjectId } from 'mongodb'

// Fonction pour nettoyer les clés (supprimer les espaces)
function cleanKeys(obj: Record<string, any>): Record<string, any> {
  const cleanedObj: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    const cleanedKey = key.trim()  // Supprimer les espaces autour de la clé
    cleanedObj[cleanedKey] = value
  }
  return cleanedObj
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const hotelId = params.id

    if (!ObjectId.isValid(hotelId)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 })
    }

    const client = await MongoClient.connect('mongodb://localhost:27017')
    const db = client.db('hotels')
    const hotel = await db.collection('hotels').findOne({ _id: new ObjectId(hotelId) })

    if (!hotel) {
      return NextResponse.json({ error: 'Hotel not found' }, { status: 404 })
    }

    // Nettoyer les clés avant d'envoyer la réponse
    const cleanedHotel = cleanKeys(hotel)

    return NextResponse.json(cleanedHotel)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}