import {useLoaderData} from 'remix'
import type {MetaFunction, LoaderFunction} from 'remix'
import type {TweetV2} from 'twitter-api-v2'
import {nl2br} from '@arcath/utils/lib/functions/nl2br'
import {formatDistance} from 'date-fns'
import {motion} from 'framer-motion'

import {pageTitle, getSiteData} from '../lib/utils'

import {getArticles} from '~/lib/api/articles.server'
import {getTwitterClient} from '~/lib/api/twitter.server'
import {getSection} from '~/lib/api/sections.server'

import {prepareMDX} from '~/lib/mdx.server'

import {ButtonLink} from '~/lib/components/button'
import {ArticleBlock} from '~/lib/components/article-block'
import {MDXContent} from '~/lib/components/content'

export const loader: LoaderFunction = async () => {
  const articles = await getArticles({count: 3, skip: 0, featured: true})
  const {title, subTitle} = getSiteData()

  const intro = await getSection('intro')

  const twitter = getTwitterClient()

  const twitterUser = await twitter.v2.userByUsername('ArcathWhitefall')
  const tweets = await twitter.v2.userTimeline(twitterUser.data.id, {
    'tweet.fields': ['created_at'],
    max_results: 6
  })

  const introCode = await prepareMDX({source: intro.body, bundlePath: '/'})

  return {
    articles,
    title,
    subTitle,
    tweets: tweets.data.data,
    intro,
    introCode: introCode.code
  }
}

export let meta: MetaFunction = () => {
  const {subTitle} = getSiteData()

  return {
    title: pageTitle(subTitle)
  }
}

export default function Index() {
  const {articles, title, tweets, subTitle, intro, introCode} = useLoaderData<{
    articles: Awaited<ReturnType<typeof getArticles>>
    intro: Awaited<ReturnType<typeof getSection>>
    introCode: string
    title: string
    subTitle: string
    tweets: TweetV2[]
  }>()

  return (
    <div>
      <div className="grid grid-cols-2 mt-8">
        <div>
          <div className="section">
            <MDXContent source={introCode} />
          </div>
        </div>
        <div>
          <motion.img
            className="rotate-5 shadow-xl"
            src="/img/profile.jpg"
            animate={{rotate: 5}}
            transition={{duration: 1}}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-8">
        {articles.map(article => {
          return <ArticleBlock article={article} key={article.slug} />
        })}
      </div>
    </div>
  )
}
