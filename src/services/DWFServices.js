import { collection, getDocs, limit, query } from 'firebase/firestore/lite';
import db from '../firebaseConfig'

export async function getAllRecentLocations(count) {
  const recentLocationsRef = collection(db, 'geo')
  const q = await query(recentLocationsRef, limit(count))
  const recentLocationsSnapshot = await getDocs(q)
  const locArray = []

  recentLocationsSnapshot.forEach((loc) => {
    const data = loc.data()
    data.zipcode = loc.id
    locArray.push(data)
  })

  return locArray
}
