import type {LoaderFunction} from 'remix'
import fetch from 'node-fetch'

import {getArticleAsset} from '~/lib/api/articles.server'

export const loader: LoaderFunction = async ({params}) => {
  if (
    typeof params.year !== 'string' ||
    typeof params.month !== 'string' ||
    typeof params.slug !== 'string' ||
    typeof params.file !== 'string'
  ) {
    throw new Response('Not Found', {status: 404})
  }

  const file = await getArticleAsset(params.slug, params.file)

  const imageReponse = await fetch(file.url)

  return new Response(await imageReponse.buffer(), {
    headers: {
      'Cache-Control': 's-maxage=43200',
      'content-type': imageReponse.headers.get('content-type')!
    }
  })
}
