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

  const appointments = snapshotOfAppts.docs.map(appointment => {
    let tmp = appointment.data()
    // quick fix for keeping id at the top level
    // tmp.properties.id = tmp.id
    return tmp
  })

  return appointments
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

  const claimedAppointments = snapshotOfClaimedAppts.docs.map(appointment => {
    let tmp = appointment.data()
    // quick fix for keeping id at top level
    tmp.properties.id = appointment.id
    return tmp
  })

  return claimedAppointments
}
