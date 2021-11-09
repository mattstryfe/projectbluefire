import firebase from "../firebaseConfig";
const db = firebase;

export async function getAllRecentLocations(count) {
  const docRef = db.collection('geo').limit(count)

  // works but no limit
  const recentLocations = await docRef.get()
  const locArray = []
  recentLocations.forEach((loc) => {
    const data = loc.data()
    data.zipcode = loc.id
    locArray.push(data)
  })

  return locArray
}
