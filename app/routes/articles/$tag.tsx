import {useState, useEffect} from 'react'
import {useLoaderData, useFetcher, json} from 'remix'
import type {MetaFunction, LoaderFunction} from 'remix'

import {pageTitle, getSiteData} from '../../lib/utils'

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

  const skip = param === null ? 0 : parseInt(param)

  const tagSlug = params.tag!

  const articles = await getTaggedArticles({count: 9, skip, tag: tagSlug})
  const tag = await getTag(tagSlug)
  const {title, subTitle} = getSiteData()

  const total = await getTaggedArticlesCount(tagSlug)

  return json({articles, title, subTitle, tag, tagSlug, total})
}

export let meta: MetaFunction = ({data}) => {
  return {
    title: pageTitle('Articles', data.tag.name)
  }
}

const ArticlesPage = () => {
  const {
    articles: loaderArticles,
    tag,
    tagSlug,
    total
  } = useLoaderData<{
    articles: Awaited<ReturnType<typeof getTaggedArticles>>
    tag: Awaited<ReturnType<typeof getTag>>
    title: string
    subTitle: string
    tagSlug: string
    total: number
  }>()

  const fetcher = useFetcher()

  const [articles, setArticles] = useState(loaderArticles)

  useEffect(() => {
    if (fetcher.data) {
      setArticles([...articles, ...fetcher.data.articles])
    }
  }, [fetcher.data])

  return (
    <div className="grid grid-cols-layout">
      <div className="col-start-2">
        <h1 className="text-3xl">Articles / {tag.name}</h1>
      </div>
      <div className="col-start-2">
        <div className="grid grid-cols-3 col-start-2 col-span-3 gap-4">
          {articles.map(article => {
            return <ArticleBlock article={article} key={article.slug} />
          })}
          {articles.length < total ? (
            <div className="col-span-3">
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
