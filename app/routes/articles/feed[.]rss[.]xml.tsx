import type {LoaderFunction} from '@remix-run/node'

import {getArticles} from '~/lib/api/articles.server'
import {getSiteData} from '~/lib/utils'

const cdata = (string: string) => {
  return `<![CDATA[${string}]]>`
}

export const loader: LoaderFunction = async () => {
  const articles = await getArticles({count: 100, featured: false, skip: 0})

  const {productionUrl, title: siteTitle, subTitle} = getSiteData()

  const rss = `
<rss xmlns:blogChannel="${productionUrl}" version="2.0">
  <channel>
    <title>${siteTitle}</title>
    <link>${productionUrl}/</link>
    <description>${cdata(subTitle)}</description>
    <language>en-GB</language>
    <generator>Remix</generator>
    <ttl>40</ttl>
    ${articles
      .map(({title, lead, date, slug}) => {
        const [year, month, day] = date.split('-')

        return `
    <item>
      <title>${cdata(title)}</title>
      <description>${cdata(lead)}</description>
      <pubDate>${year}-${month}-${day}</pubDate>
      <link>${productionUrl}/${year}/${month}/${slug}</link>
      <guid>${productionUrl}/${year}/${month}/${slug}</guid>
    </item>`.trim()
      })
      .join('\n')}
  </channel>
</rss>
  `.trim()

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Content-Length': String(Buffer.byteLength(rss))
    }
  })
}
