import firebase from "../firebaseConfig";
const db = firebase;
const docRef = db
  .collection('appointments')


export async function writeAppointmentToDb(appointment) {
  console.log('appt', appointment)
  try { await docRef.doc().set( appointment ) }
  catch (e) { console.log('writeAppointmentToDb error...', e) }
}

export async function getAppointmentsFromDb() {
  const appts = await docRef
    .where('properties.status', '!=', 'claimed')
    .get()
    .then(snapshot => snapshot.docs.map(x => {
      let appointment = x.data()

      // append id for things
      appointment.properties.id = x.id

      return appointment
    }))

  if (appts.empty)
    return

  return appts
}

export async function updateAppointment(appointment) {
  console.log('appointment', appointment)
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
    .where('appointment.status', '==', 'claimed')
    .where('claimedBy.id', '==', user_id)
    .get()
    .then(snapshot => snapshot.docs.map(x => {
      let entry = {}
      entry.id = x.id
      const { appointment, claimedBy } = x.data()
      entry.appointment = appointment
      entry.claimedBy = claimedBy

      return entry
    }))

  if (claimed.empty)
    return

  // return fixed appointment data
  return claimed
}

// Should be able to replace this inside getClaimedAppointments with some minor refectoring
// const docsArr = (collection) => {
//   return db
//     .collection(collection)
//     .get()
//     .then(snapshot => snapshot.docs.map(x => {
//
//       // TODO: clean this up
//       let entry = {}
//       entry.id = x.id
//       const { appointment } = x.data()
//       entry.appointment = appointment
//
//       return entry
//     }))
// }
