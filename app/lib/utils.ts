import {defaults} from '@arcath/utils'

import data from '../../site-data.json'

export const getSiteData = () => data

export const pageTitle = (...title: string[]) => {
  return [data.title, ...title].join(' / ')
}

interface OpenGraphTags {
  title: string
  description: string
  image: string
}

export const openGraph = (tags: Partial<OpenGraphTags>) => {
  const openGraph = defaults<OpenGraphTags>(tags, {
    title: data.title,
    description: data.subTitle,
    image: `${data.productionUrl}/img/social.jpg`
  })

  return {
    'og:title': openGraph.title,
    'og:description': openGraph.description,
    'og:site_name': data.title,
    'og:image': openGraph.image,
    description: openGraph.description,
    'twitter:card': 'summary_large_image',
    'twitter:creator': data.social.twitter.label
  }
}
