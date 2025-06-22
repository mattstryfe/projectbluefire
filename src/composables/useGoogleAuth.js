import { SocialLogin } from '@capgo/capacitor-social-login'
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential
} from 'firebase/auth'

export async function useLoginWithGoogle() {
  try {
    await SocialLogin.initialize({
      google:
        '342995548873-tdl2fqr9pqvegvflrhd6mb677n5i4fco.apps.googleusercontent.com'
    })
    const result = await SocialLogin.login({
      provider: 'google',
      options: {
        scopes: ['email', 'profile']
      }
    })

    const idToken = result?.idToken
    if (!idToken) throw new Error('Missing ID token')

    const credential = GoogleAuthProvider.credential(idToken)
    const auth = getAuth()
    const userCredential = await signInWithCredential(auth, credential)

    return userCredential
  } catch (err) {
    if (
      err.message?.includes('canceled') ||
      err.message?.includes('User') ||
      err.message?.includes('popup closed')
    ) {
      console.log('[SocialLogin] User cancelled login.')
      return null
    }

    console.error('[SocialLogin] Error:', err)
    throw err
  }
}
