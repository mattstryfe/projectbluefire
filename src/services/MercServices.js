import db from '../firebaseConfig'
import { collection, query, where, getDocs } from 'firebase/firestore/lite'

const docRef = collection(db, 'appointments')


export async function writeAppointmentToDb(appointment) {
  try { await docRef.doc().set( appointment ) }
  catch (e) { console.log('writeAppointmentToDb error...', e) }
}

export async function getAppointmentsFromDb() {

  const q = query(docRef, where('properties.status', '!=', 'claimed'))
  const snapshotOfAppts = await getDocs(q)

  if (snapshotOfAppts.empty)
    return

  const appointments = snapshotOfAppts.docs.map(appointment => {
    let tmp = appointment.data()
    // quick fix for keeping id at the top level
    tmp.properties.id = tmp.id
    return tmp
  })

  return appointments
}

export async function updateAppointment(appointment) {
  console.log('updateAppointment value:', appointment.properties.claimedBy)
  try {
    await docRef
      .doc(appointment.properties.id)
      .update({
        'properties.status': appointment.properties.status,
        'properties.claimedBy': appointment.properties.claimedBy
    })
  }
  catch (e) { console.log('updateAppointment error...', e) }
}

export async function getClaimedAppointments(user_id) {
  const claimed = await docRef
    .where('properties.status', '==', 'claimed')
    .where('properties.claimedBy.id', '==', user_id)
    .get()
    .then(snapshot => snapshot.docs.map(x => {
      let appointment = x.data()

      // append id for things
      appointment.properties.id = x.id

      return appointment
    }))

  if (claimed.empty)
    return

  // return fixed appointment data
  return claimed
}
