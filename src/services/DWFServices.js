import firebase from "../firebaseConfig";
import {zipToGeo} from '@/services/SWFServices'
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


export async function checkDbFor(zip) {
  const docRef = db.collection('geo').doc(zip)

  const geoData = await docRef.get()
  console.log('geoData', geoData)
  //
  // return docRef.get()
  //   .then(async (doc) => {
  //     if (doc.exists)
  //       return doc.data()
  //     else {
  //       let geoData = await zipToGeo(zip)
  //       // TODO: fix geoData and add state logic
  //       docRef.set(geoData)
  //       return geoData
  //     }
  //   })

}
