import firebase from "../firebaseConfig";
const db = firebase.firestore();

export async function writeAppointmentToDb(appointment) {
  const apptRef = db
    .collection('appointments')
    .doc()

  try {
    await apptRef.set({
      appointment
    })
  }
  catch (e) {
    console.log('e', e)
  }
}

export async function getAppointmentsFromDb() {
  let res
  try {
    res = await docsArr('appointments')
  }
  catch (e) {
    console.log('e', e)
  }
  return res
}

export async function updateAppointment(appointment) {
  const apptToUpdate = db
    .collection('appointments')
    .doc(appointment.id)

  try {
    await apptToUpdate.update({
      'appointment.status': appointment.status,
      claimedBy: appointment.claimedBy
    })
  }
  catch (e) {
    console.log('e', e)
  }
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
