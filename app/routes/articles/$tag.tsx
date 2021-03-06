import {useState, useEffect} from 'react'
import type {LoaderFunction, MetaFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useFetcher, useLoaderData} from '@remix-run/react'

import {pageTitle, getSiteData, openGraph} from '../../lib/utils'

import {
  getTaggedArticles,
  getTaggedArticlesCount
} from '~/lib/api/articles.server'
import {getTag} from '~/lib/api/tags.server'

import {ArticleBlock} from '~/lib/components/article-block'
import {Button} from '~/lib/components/button'

export const loader: LoaderFunction = async ({request, params}) => {
  const url = new URL(request.url)
  const param = url.searchParams.get('skip')

  const skip = param === null ? 0 : parseInt(param, 10)

  const tagSlug = params.tag!

  const articles = await getTaggedArticles({count: 9, skip, tag: tagSlug})
  const tag = await getTag(tagSlug)
  const {title, subTitle} = getSiteData()

  const total = await getTaggedArticlesCount(tagSlug)

  return json({articles, title, subTitle, tag, tagSlug, total})
}

export const meta: MetaFunction = ({data}) => {
  const openGraphTags = openGraph({
    title: (data as {tag: {name: string}}).tag.name
  })

  return {
    title: pageTitle('Articles', (data as {tag: {name: string}}).tag.name),
    ...openGraphTags
  }
}

type LoaderData = {
  articles: Awaited<ReturnType<typeof getTaggedArticles>>
  tag: Awaited<ReturnType<typeof getTag>>
  title: string
  subTitle: string
  tagSlug: string
  total: number
}

const ArticlesPage = () => {
  const {
    articles: loaderArticles,
    tag,
    tagSlug,
    total
  } = useLoaderData<LoaderData>()

  const fetcher = useFetcher<LoaderData>()

  const [articles, setArticles] = useState(loaderArticles)

  useEffect(() => {
    if (fetcher.data) {
      setArticles(currentArticles => [
        ...currentArticles,
        ...fetcher.data!.articles
      ])
    }
  }, [fetcher.data])

  return (
    <div className="grid grid-cols-layout">
      <div className="col-start-2">
        <h1 className="text-3xl">Articles / {tag.name}</h1>
      </div>
      <div className="col-start-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 col-start-2 col-span-3 gap-4">
          {articles.map(article => {
            return <ArticleBlock article={article} key={article.slug} />
          })}
          {articles.length < total ? (
            <div className="lg:col-span-3">
              <Button
                onClick={() => {
                  fetcher.load(`/articles/${tagSlug}?skip=${articles.length}`)
                }}
                className="w-full"
              >
                More...
              </Button>
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

export default ArticlesPage
