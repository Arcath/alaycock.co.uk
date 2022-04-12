import type {LoaderFunction} from 'remix'
import {isBefore} from 'date-fns'

import {getSiteData} from '../lib/utils'
import {getGraph} from '~/lib/api/client.server'

const SITEMAP_QUERY = `
query SitemapQuery {
  pages {
    updatedAt
    slug
  }
  articles(orderBy: updatedAt_DESC) {
    updatedAt
    slug
    featured
    date
  }
  tags(orderBy: updatedAt_DESC) {
    slug
    updatedAt
    articles(orderBy: updatedAt_DESC, first: 1) {
      updatedAt
    }
  }
}
`

interface SitemapData {
  pages: {
    updatedAt: string
    slug: string
  }[]
  /* Articles ordered by most recently updated first. */
  articles: {
    updatedAt: string
    slug: string
    featured: boolean | null
    date: string
  }[]
  tags: {
    slug: string
    updatedAt: string
    articles: [{updatedAt: string}]
  }[]
}

export const loader: LoaderFunction = async () => {
  const data = getSiteData()
  const graph = getGraph()

  const sitemapData = await graph.request<SitemapData>(SITEMAP_QUERY)

  let sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

  // Index Page
  const lastUpdated = sitemapData.articles.reduce(
    (date, {updatedAt, featured}) => {
      if (featured && isBefore(new Date(date), new Date(updatedAt))) {
        return updatedAt
      }

      return date
    },
    '1970-01-01'
  )

  sitemap += `<url>
    <loc>${data.productionUrl}/</loc>
    <lastmod>${lastUpdated}</lastmod>
    <priority>1.0</priority>
  </url>`

  // Static Pages
  sitemapData.pages.forEach(({slug, updatedAt}) => {
    sitemap += `<url>
      <loc>${data.productionUrl}/${slug}</loc>
      <lastmod>${updatedAt}</lastmod>
      <priority>1.0</priority>
    </url>`
  })

  //Dynamic Pages
  // Articles
  sitemap += `<url>
    <loc>${data.productionUrl}/articles</loc>
    <lastmod>${sitemapData.articles[0].updatedAt}</lastmod>
    <priority>1.0</priority>
  </url>`

  // Tags List
  sitemap += `<url>
    <loc>${data.productionUrl}/articles/tags</loc>
    <lastmod>${sitemapData.tags[0].updatedAt}</lastmod>
    <priority>1.0</priority>
  </url>`

  // Every tag page
  sitemapData.tags.forEach(({slug, articles}) => {
    sitemap += `<url>
      <loc>${data.productionUrl}/articles/${slug}</loc>
      <lastmod>${articles[0].updatedAt}</lastmod>
      <priority>1.0</priority>
    </url>`
  })

  // Every Article
  sitemapData.articles.forEach(({slug, date, updatedAt}) => {
    const [year, month] = date.split('-')

    sitemap += `<url>
      <loc>${data.productionUrl}/${year}/${month}/${slug}</loc>
      <lastmod>${updatedAt}</lastmod>
      <priority>1.0</priority>
    </url>`
  })

  sitemap += `</urlset>`

  return new Response(sitemap, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'xml-version': '1.0',
      encoding: 'UTF-8'
    }
  })
}
