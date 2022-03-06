import type {LoaderFunction, MetaFunction} from 'remix'
import {useLoaderData} from 'remix'

import {prepareMDX} from '~/lib/mdx.server'
import {MDXContent} from '~/lib/components/content'
import {pageTitle} from '~/lib/utils'

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
    bundlePath: '/' + [params.year, params.month, params.slug].join('/'),
    files: article.components.reduce((files, {fileName, source}) => {
      files[fileName] = source

      return files
    }, {} as {[fileName: string]: string})
  })

  return {article, code}
}

export const meta: MetaFunction = ({data}) => {
  return {title: data ? pageTitle(data.article.title) : pageTitle('')}
}

export default function () {
  const {article, code} = useLoaderData()

  return (
    <div className="grid grid-cols-content prose mdx-content">
      <h1>{article.title}</h1>

      <MDXContent source={code} />
    </div>
  )
}
