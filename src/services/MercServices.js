import firebase from "../firebaseConfig";
const db = firebase.firestore();
const docRef = db
  .collection('appointments')


export async function writeAppointmentToDb(appointment) {
  try { await docRef.doc().set({ appointment }) }
  catch (e) { console.log('e', e) }
}

export async function getAppointmentsFromDb() {
  let res
  try { res = await docsArr('appointments') }
  catch (e) { console.log('e', e) }
  return res
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
  catch (e) { console.log('e', e) }
}

export async function getClaimedAppointments() {
  const claimed = await docRef
    .where('appointment.status', '==', 'claimed')
    .get()
    .then(snapshot => snapshot.docs.map(x => {
      let entry = {}
      entry.id = x.id
      const { appointment } = x.data()
      entry.appointment = appointment

      return entry
    }))

  if (claimed.empty)
    return

  return claimed
}


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
