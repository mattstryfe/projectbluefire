import db from '../firebaseConfig'
import { doc, collection, query, where, getDocs, setDoc, updateDoc } from 'firebase/firestore/lite'

const docRef = collection(db, 'appointments')

export async function writeAppointmentToDb(appointment) {
  const newApptRef = doc(collection(db, 'appointments'))

  // add id to properties for later targeting
  appointment.properties.id = newApptRef.id
  await setDoc(newApptRef, appointment)
}

export async function getAppointmentsFromDb() {
  // build query
  const q = query(docRef,
    where('properties.status', '!=', 'claimed'))

  // run query
  const snapshotOfAppts = await getDocs(q)

  if (snapshotOfAppts.empty)
    return []

  // Return a usable array
  return snapshotOfAppts.docs.map(appointment => appointment.data())
}

export async function updateAppointment(appointment) {
  const apptRef = doc(db, 'appointments', appointment.properties.id)

  await updateDoc(apptRef, appointment)
}

export async function getClaimedAppointments(user_id) {
  // build query
  const q = query(docRef,
    where('properties.status', '==', 'claimed'),
    where('properties.claimedBy.id', '==', user_id))

  // run query
  const snapshotOfClaimedAppts = await getDocs(q)

  if (snapshotOfClaimedAppts.empty)
    return []

  // Return a usable array
  return snapshotOfClaimedAppts.docs.map(appointment => appointment.data())
}
