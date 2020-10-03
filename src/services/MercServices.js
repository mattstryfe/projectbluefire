import firebase from "../firebaseConfig";
const db = firebase;
const docRef = db
  .collection('appointments')


export async function writeAppointmentToDb(appointment) {
  try { await docRef.doc().set({ appointment }) }
  catch (e) { console.log('writeAppointmentToDb error...', e) }
}

export async function getAppointmentsFromDb() {
  // let res
  // try { res = await docsArr('appointments') }
  // catch (e) { console.log('e', e) }
  // return res

  const appts = await docRef
    .where('appointment.status', '!=', 'claimed')
    .get()
    .then(snapshot => snapshot.docs.map(x => {
      let entry = {}
      entry.id = x.id
      const {appointment} = x.data()
      entry.appointment = appointment

      return entry
    }))

  if (appts.empty)
    return

  return appts
}

export async function updateAppointment(appointment) {
  try {
    await docRef
      .doc(appointment.id)
      .update({
        'appointment.status': appointment.status,
        claimedBy: appointment.claimedBy
    })
  }
  catch (e) { console.log('updateAppointment error...', e) }
}

export async function getClaimedAppointments(user_id) {
  console.log('user_id', user_id)
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
const docsArr = (collection) => {
  return db
    .collection(collection)
    .get()
    .then(snapshot => snapshot.docs.map(x => {

      // TODO: clean this up
      let entry = {}
      entry.id = x.id
      const { appointment } = x.data()
      entry.appointment = appointment

      return entry
    }))
}
