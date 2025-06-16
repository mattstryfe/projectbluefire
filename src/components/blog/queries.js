export const mainQuery = `
    *[_type == "post"] | order(publishedAt desc){
  _id,
  _createdAt,
  author->{
    name,
    "avatar": image.asset->url
  },
  title,
  "slug": slug.current,
  "mainImageUrl": mainImage.asset->url,
  "preview": pt::text(body),
  body
  }`

export const postQuery = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  _createdAt,
  author->{
    name,
    "avatar": image.asset->url
  },
  "mainImageUrl": mainImage.asset->url,
  body
}`

export const metaQuery = `{
  "previous_post": *[_type == "post" && publishedAt < $publishedAt] | order(publishedAt desc)[0]{
    title,
    publishedAt,
    "mainImageUrl": mainImage.asset->url,
    "slug": slug.current
  },
  "next_post": *[_type == "post" && publishedAt > $publishedAt] | order(publishedAt asc)[0]{
    title,
    publishedAt,
    "mainImageUrl": mainImage.asset->url,
    "slug": slug.current
  }
}`
