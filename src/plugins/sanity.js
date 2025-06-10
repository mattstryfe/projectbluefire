import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '5n3oo2uk',
  dataset: 'production',
  apiVersion: '2023-06-08',
  useCdn: true
})

export function useSanityClient() {
  return client
}
