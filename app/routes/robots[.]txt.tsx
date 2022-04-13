import type {LoaderFunction} from '@remix-run/node'

import {getSiteData} from '~/lib/utils'

export const loader: LoaderFunction = () => {
  const {productionUrl} = getSiteData()

  const robots = `User-agent: *
Allow: /

Sitemap: ${productionUrl}/sitemap.xml`

  return new Response(robots, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain'
    }
  })
}
