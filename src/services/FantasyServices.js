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
// const yahooURL = 'http://localhost:5001/project-bluefire/us-central1/base'
const yahooURL2 = 'https://us-central1-project-bluefire.cloudfunctions.net/base'
const yahooURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:5001/project-bluefire/us-central1/base'
    : 'https://us-central1-project-bluefire.cloudfunctions.net/base'

// Legacy things
const yahooAuthURL = 'https://api.login.yahoo.com/oauth2/'

class BasicService {
  constructor(url) {
    this.http = axios.create({
      baseURL: url,
      timeout: 15000,
      // headers: {
      //   post: {
      //     'Authorization': 'Basic',
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //   }
      // }
    })
  }
  get ({ endpoint, payload }) {
    return this.http.get(endpoint, { params: payload })
  }
  post ({ endpoint, payload, config }) {
    console.log('payload', payload, config)
    return this.http.post(endpoint, payload, config)
  }
}

const axi_fantasy = new BasicService(fntyURL)
const axi_yahoo = new BasicService(yahooURL)
const axi_legacyYahoo = new BasicService(yahooAuthURL)

export async function legacyYahooAuth(target, code) {
  let yahooRes
  console.log('code', code)
  const config = {
    headers: {
      'Authorization': `Bearer ${code}`,
    }
  }
  try {
    yahooRes = axi_legacyYahoo.post({
      endpoint: target,
      payload: {
        'client_id': process.env.VUE_APP_YAHOO_CLIENT_KEY,
        'client_secret': process.env.VUE_APP_YAHOO_CLIENT_SECRET,
        'redirect_uri': 'https://projectbluefire.com/fantasy',
        'code': code,
        'grant_type': 'authorization_code'
      },
      config
    })
  }
  catch (err) {
    console.log('err', err)
  }
  return yahooRes
}

export async function yahooAuthentication(target) {
  let yahooRes
  try {
    yahooRes = axi_yahoo.get({
      endpoint: target
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
