import axios from 'axios'
const githURL = process.env.VUE_APP_GITH_BASE_ENDPOINT

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

