// https://statsapi.web.nhl.com/api/v1/teams/5/roster
// headshots
// http://nhl.bamcontent.com/images/headshots/current/168x168/8471675.jpg
// team logos
// https://www-league.nhlstatic.com/builds/site-core/01c1bfe15805d69e3ac31daa090865845c189b1d_1458063644/images/team/logo/current/10_dark.svg
//      return `https://www-league.nhlstatic.com/builds/site-core/01c1bfe15805d69e3ac31daa090865845c189b1d_1458063644/images/team/logo/current/${team_id}_dark.svg`
//       return `http://nhl.bamcontent.com/images/headshots/current/168x168/${player_id}.jpg`
import axios from 'axios'
import db from '@/firebaseConfig'
import {collection, doc, setDoc, getDoc, getDocs, query, where, updateDoc, deleteField } from 'firebase/firestore/lite'
const fntyURL = process.env.VUE_APP_FNTY_BASE_ENDPOINT

class BasicService {
  constructor(url) {
    this.http = axios.create({
      baseURL: url,
      timeout: 15000,
    })
  }
  get ({ endpoint, payload }) {
    return this.http.get(endpoint, { params: payload })
  }
  post ({ endpoint, payload, config }) {
    return this.http.post(endpoint, payload, config)
  }
}

const axi_fantasy = new BasicService(fntyURL)

export async function getAllLogos() {
  const snapshotOfAllLogos = await getDocs(collection(db, 'logos'))
  return snapshotOfAllLogos.docs.map(logo => logo.data())
}

export async function addPlayerToTeam(player, user) {
  const usersTeamRef = doc(db, 'fantasyTeams', user.id.toString())
  const playerToAdd = {
    [player.person.id]: player
  }

  // adds player object to fantasy team
  await setDoc(usersTeamRef, playerToAdd, { merge : true })
}

export async function removePlayerFromTeam(player, user) {
  const usersTeamRef = doc(db, 'fantasyTeams', user.id.toString())

  // removes player from team
  await updateDoc(usersTeamRef, { [player.person.id]: deleteField() })
}

export async function getLogos(team_id) {
  console.log('team_id', team_id)
  const docRef = collection(db, 'logos')

  // build query
  const q = query(docRef,
    where('team_id', '==', team_id))


  // const q = query(docRef,
  //   where('team_id','==', team_id))

  // run query
  const snapshotOfLogos = await getDocs(q)
  console.log('snapshot', snapshotOfLogos)
  // if (snapshotOfLogos.exists()) {
  //   console.log("Document data:", snapshotOfLogos.data());
  // } else {
  //   // doc.data() will be undefined in this case
  //   console.log("No such document!");
  // }
  // return []

  return snapshotOfLogos.docs.map(logo => logo.data())
}

export async function getPlayers(team_id) {
  let players
  try {
    players = axi_fantasy.get({
      endpoint: `teams/${team_id}/roster`
    })
  }
  catch (err) {
    console.log('err', err)
  }
  return players
}

export async function getTeams() {
  let players
  try {
    players = axi_fantasy.get({
      endpoint: `teams`
    })
  }
  catch (err) {
    console.log('err', err)
  }
  return players
}
