import {useState, useEffect} from 'react'
import {useLoaderData, useFetcher, json} from 'remix'
import type {MetaFunction, LoaderFunction} from 'remix'

import {pageTitle, getSiteData} from '../../lib/utils'

import {getArticles, getArticlesCount} from '~/lib/api/articles.server'

import {ArticleBlock} from '~/lib/components/article-block'
import {Button, ButtonLink} from '~/lib/components/button'

export const loader: LoaderFunction = async ({request}) => {
  const url = new URL(request.url)
  const param = url.searchParams.get('skip')

  const skip = param === null ? 0 : parseInt(param)

  const articles = await getArticles({count: 9, skip})
  const {title, subTitle} = getSiteData()

  const total = await getArticlesCount()

  return json({articles, title, subTitle, total})
}

export let meta: MetaFunction = () => {
  return {
    title: pageTitle('Articles')
  }
}

const ArticlesPage = () => {
  const {articles: loaderArticles, total} = useLoaderData<{
    articles: Awaited<ReturnType<typeof getArticles>>
    title: string
    subTitle: string
    total: number
  }>()

  const fetcher = useFetcher()

  const [articles, setArticles] = useState(loaderArticles)

  useEffect(() => {
    if (fetcher.data && fetcher.data.articles) {
      setArticles([...articles, ...fetcher.data.articles])
    }
  }, [fetcher.data])

  return (
    <div className="grid grid-cols-layout">
      <div className="col-start-2">
        <h1 className="text-3xl">Articles</h1>
      </div>
      <div className="col-start-2">
        <div className="p-4 mb-4">
          <ButtonLink to="/articles/tags" className="w-full block text-center">
            Tags
          </ButtonLink>
        </div>
        <div className="grid grid-cols-3 col-start-2 col-span-3 gap-4">
          {articles.map(article => {
            return <ArticleBlock article={article} key={article.slug} />
          })}
          {articles.length < total ? (
            <div className="col-span-3">
              <Button
                onClick={() => {
                  fetcher.load(`/articles?index&skip=${articles.length}`)
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
