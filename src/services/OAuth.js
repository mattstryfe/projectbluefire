import ClientOAuth2 from 'client-oauth2'

export function yahooOAuth () {
   return new ClientOAuth2({
    clientId: process.env.VUE_APP_YAHOO_CLIENT_ID,
    clientSecret: process.env.VUE_APP_YAHOO_CLIENT_SECRET,
    accessTokenUri: 'http://projectbluefire.com',
    authorizationUri: 'https://projectbluefire.com'
  })
}
