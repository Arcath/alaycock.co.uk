import type {LoaderFunction, MetaFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {lastModifiedHeaderDate} from '@arcath/utils'

import {prepareMDX} from '~/lib/mdx.server'
import {MDXContent} from '~/lib/components/content'
import {pageTitle, openGraph, getSiteData} from '~/lib/utils'

import {getArticle} from '~/lib/api/articles.server'
import {isAfter} from 'date-fns'

export const loader: LoaderFunction = async ({params}) => {
  if (
    typeof params.year !== 'string' ||
    typeof params.month !== 'string' ||
    typeof params.slug !== 'string'
  ) {
    throw new Response('Not Found', {status: 404})
  }

  const article = await getArticle(params.slug, {
    year: params.year,
    month: params.slug
  })

  if (article === undefined) {
    throw new Response('Not Found', {status: 404})
  }

  const {code} = await prepareMDX({
    source: article.body,
    bundlePath: '/' + [params.year, params.month, params.slug].join('/'),
    files: article.components.reduce((files, {fileName, source}) => {
      files[fileName] = source

      return files
    }, {} as {[fileName: string]: string})
  })

  const {buildTime} = getSiteData()

  return json(
    {
      article,
      code,
      articlePath: '/' + [params.year, params.month, params.slug].join('/')
    },
    {
      headers: {
        'Cache-Control': `public, max-age=${60 * 5}, s-maxage=${60 * 60 * 24}`,
        'Last-Modified': lastModifiedHeaderDate(
          isAfter(new Date(buildTime), new Date(article.updatedAt))
            ? buildTime
            : article.updatedAt
        )
      }
    }
  )
}

export const meta: MetaFunction = ({data}) => {
  const siteData = getSiteData()

  const openGraphTags = openGraph({
    title: data.article.title,
    description: data.article.lead,
    image: `${siteData.productionUrl}${data.articlePath}/social.jpg`
  })

  return {
    title: data ? pageTitle(data.article.title) : pageTitle(''),
    ...openGraphTags
  }
}

export default function () {
  const {article, code} = useLoaderData()

  return (
    <div className="grid grid-cols-content prose dark:prose-dark mdx-content pt-4">
      <h1>{article.title}</h1>

      <MDXContent source={code} />
    </div>
  )
}
