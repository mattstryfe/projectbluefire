// https://statsapi.web.nhl.com/api/v1/teams/5/roster
// headshots
// http://nhl.bamcontent.com/images/headshots/current/168x168/8471675.jpg
// team logos
// https://www-league.nhlstatic.com/builds/site-core/01c1bfe15805d69e3ac31daa090865845c189b1d_1458063644/images/team/logo/current/10_dark.svg
//      return `https://www-league.nhlstatic.com/builds/site-core/01c1bfe15805d69e3ac31daa090865845c189b1d_1458063644/images/team/logo/current/${team_id}_dark.svg`
//       return `http://nhl.bamcontent.com/images/headshots/current/168x168/${player_id}.jpg`
import axios from 'axios'
import db from '@/firebaseConfig'
import {collection, doc, setDoc, getDocs, query, where, updateDoc, deleteField } from 'firebase/firestore/lite'
const fntyURL = process.env.VUE_APP_FNTY_BASE_ENDPOINT
const yahooURL = 'http://localhost:5001/project-bluefire/us-central1/'
const yahooURL2 = 'https://us-central1-project-bluefire.cloudfunctions.net/'

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
const axi_yahoo = new BasicService(yahooURL)

export async function yahooAuthentication() {
  let yahooRes
  try {
    yahooRes = axi_yahoo.get({
      endpoint: 'base/test'
    })
  }
  catch (err) {
    console.log('err', err)
  }
  return yahooRes
}

// FANTASY PLAYER CONTROL
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


// FANTASY GETTERS
export async function getAllLogos() {
  const snapshotOfAllLogos = await getDocs(collection(db, 'logos'))
  return snapshotOfAllLogos.docs.map(logo => logo.data())
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
