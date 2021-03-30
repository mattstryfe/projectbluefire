import axios from 'axios'
import Butter from 'buttercms'
const githURL = process.env.VUE_APP_GITH_BASE_ENDPOINT
const yahooURL = process.env.VUE_APP_YAHO_BASE_ENDPOINT
const butter = Butter(process.env.VUE_APP_BUTTER_API_KEY)
const api = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api'
  : `${location.host}/api`

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

const axi_github = new BasicService(githURL)

export async function yahooAuthenticate() {
  const id = 'dj0yJmk9VXRlemtxcHpXQmpqJmQ9WVdrOVZXeEhkekV6TjBFbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWZm'
  const params = {
    client_id: id,
    redirect_uri: 'localhost:8080/fantasy',
    // redirect_uri: 'oob',
    // redirect_uri: 'https://projectbluefire.com/fantasy',
    response_type: 'code',
    // language: 'en-us'
  }

  let res = ''

  // BASE
  try {
    // res = axios.get(api)
    res = await axios.get(yahooURL, { params })
    console.log('res', res)
  }
  catch (err) {
    console.log('err', err)
  }


  // try {
  //   // res = axios.get(api)
  //   res = axi_yahoo.get({
  //     endpoint: api,
  //     payload: params,
  //     // config: headers
  //   })
  // }
  // catch (err) {
  //   console.log('err', err)
  // }

  return res
}

export async function fetchGithub(target, params) {
  let pulls
  const targets = {
    PRs: 'pulls?state=all',
    commits: `pulls/${params}/commits`
  }
  try {
    pulls = axi_github.get({
      endpoint: `/repos/mattstryfe/projectbluefire/${targets[target]}`
    })
  }
  catch (err) {
    console.log('err', err)
  }
  return pulls
}

export async function fetchBlogPosts() {
  const params = { page: 1, page_size: 20 }
  let posts

  try {
    posts = await butter.post.list({params})
  }
  catch(err) {
    console.log('err', err)
  }
  return posts.data.data
}

export async function getAuthenticatedUser(gAuth) {
  let userProf = await gAuth.signIn()
  try {
    const googleUser = await this.$gAuth.signIn()

    // this.isUserAuthenticated = googleUser.isSignedIn()
    // pull out user info
    // const { JJ, Ad, Wt, yT } = googleUser.getBasicProfile()
    userProf = googleUser.getBasicProfile()
    // save to state via set()
    // authenticatedUser = {
    //   avatar: JJ,
    //   name: Ad,
    //   email: Wt,
    //   id: yT
    // }

    // return userProf
  }
  catch (e) {
    if (e.error === 'popup_closed_by_user')
      this.menu = false
  }

  return userProf
}
