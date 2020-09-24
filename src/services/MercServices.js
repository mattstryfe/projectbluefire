import firebase from "../firebaseConfig";
const db = firebase.firestore();

export async function writeAppointmentToDb (appointment) {
  console.log('appointment ', appointment)
  const { user_id } = appointment
  const { timestamp } = appointment

  const apptRef = db
    .collection('appointments')
    .doc()
    // .doc(user_id)
    // .collection('appointments')
    // .doc(timestamp)

  try {
    await apptRef.set({
      appointment: appointment
    }, { merge: true })
  }
  catch (e) {
    console.log('e', e)
  }
}

export function getAppointmentsFromDb () {
  let res
  try {
    res = docsArr('appointments')
    // res = await apptRef.get()
    //   .then(snapshot => snapshot.docs.map(x => x.data()))
  }
  catch (e) {
    console.log('e', e)
  }

  return res
}


const docsArr = (collection) => {
  return db
    .collection(collection)
    .get()
    .then(snapshot => snapshot.docs.map(x => x.data()))
}
