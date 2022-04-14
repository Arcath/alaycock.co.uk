import type {LoaderFunction, MetaFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {lastModifiedHeaderDate} from '@arcath/utils'
import {isAfter} from 'date-fns'

import {prepareMDX} from '~/lib/mdx.server'
import {MDXContent} from '~/lib/components/content'
import {pageTitle, openGraph, getSiteData} from '~/lib/utils'

import {getArticle} from '~/lib/api/articles.server'

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
    bundlePath: `/${[params.year, params.month, params.slug].join('/')}`,
    files: article.components.reduce<{[fileName: string]: string}>(
      (files, {fileName, source}) => {
        files[fileName] = source

        return files
      },
      {}
    )
  })

  const {buildTime} = getSiteData()

  return json(
    {
      article,
      code,
      articlePath: `/${[params.year, params.month, params.slug].join('/')}`
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

export const meta: MetaFunction = ({
  data
}: {
  data: {article: {title: string; lead: string}; articlePath: string}
}) => {
  const siteData = getSiteData()

  const openGraphTags = openGraph({
    title: data.article.title,
    description: data.article.lead,
    image: `${siteData.productionUrl}${data.articlePath}/social.jpg`
  })

  return {
    title: pageTitle(data.article.title),
    ...openGraphTags
  }
}

const ArticlePage = () => {
  const {article, code} = useLoaderData<{
    article: Awaited<ReturnType<typeof getArticle>>
    code: string
  }>()

  return (
    <div className="grid grid-cols-content prose dark:prose-dark mdx-content pt-4">
      <h1>{article!.title}</h1>

      <MDXContent source={code} />
    </div>
  )
}

export default ArticlePage
