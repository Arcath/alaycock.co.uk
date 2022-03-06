import {useState, useEffect} from 'react'
import {useLoaderData, useFetcher} from 'remix'
import type {MetaFunction, LoaderFunction} from 'remix'

import {pageTitle, getSiteData} from '../../lib/utils'

import {getArticles} from '~/lib/api/articles.server'
import {getTags} from '~/lib/api/tags.server'

import {ArticleBlock} from '~/lib/components/article-block'
import {Button, ButtonLink} from '~/lib/components/button'

export const loader: LoaderFunction = async ({request}) => {
  const url = new URL(request.url)
  const param = url.searchParams.get('skip')

  const skip = param === null ? 0 : parseInt(param)

  const articles = await getArticles({count: 9, skip})
  const tags = await getTags()
  const {title, subTitle} = getSiteData()

  return {articles, title, subTitle, tags}
}

export let meta: MetaFunction = () => {
  return {
    title: pageTitle('Articles')
  }
}

const ArticlesPage = () => {
  const {articles: loaderArticles, tags} = useLoaderData<{
    articles: Awaited<ReturnType<typeof getArticles>>
    tags: Awaited<ReturnType<typeof getTags>>
    title: string
    subTitle: string
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
        <h1 className="text-3xl">Articles</h1>
      </div>
      <div className="col-start-2">
        <div className="grid grid-cols-6 gap-2 my-4">
          {tags.map(tag => {
            return (
              <ButtonLink key={tag.slug} to={`/articles/${tag.slug}`}>
                {tag.name} ({tag.articles.length})
              </ButtonLink>
            )
          })}
        </div>
        <div className="grid grid-cols-3 col-start-2 col-span-3 gap-4">
          {articles.map(article => {
            return <ArticleBlock article={article} key={article.slug} />
          })}
          <div className="col-span-3">
            <Button
              onClick={() => {
                fetcher.load(`/articles?skip=${articles.length}`)
              }}
              className="w-full"
            >
              More...
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArticlesPage
