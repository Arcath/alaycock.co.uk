import type {LoaderFunction, MetaFunction} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import type {TweetV2} from 'twitter-api-v2'
import {nl2br} from '@arcath/utils'
import {formatDistance} from 'date-fns'
import {motion} from 'framer-motion'

import {pageTitle, getSiteData, openGraph} from '../lib/utils'

import {getFeaturedArticles} from '~/lib/api/articles.server'
import {getTwitterClient} from '~/lib/api/twitter.server'
import {getSection} from '~/lib/api/sections.server'

import {prepareMDX} from '~/lib/mdx.server'

import {ButtonA} from '~/lib/components/button'
import {ArticleBlock} from '~/lib/components/article-block'
import {MDXContent} from '~/lib/components/content'

export const loader: LoaderFunction = async () => {
  const articles = await getFeaturedArticles({
    count: 3,
    skip: 0
  })
  const {title, subTitle} = getSiteData()

  const intro = await getSection('intro')

  const twitter = getTwitterClient()

  const twitterUser = await twitter.v2.userByUsername('AdamMLaycock')
  const tweets = await twitter.v2.userTimeline(twitterUser.data.id, {
    'tweet.fields': ['created_at'],
    max_results: 5
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

export const meta: MetaFunction = () => {
  const {subTitle} = getSiteData()
  const openGraphTags = openGraph({})

  return {
    title: pageTitle(subTitle),
    ...openGraphTags
  }
}

export default function Index() {
  const {articles, tweets, introCode} = useLoaderData<{
    articles: Awaited<ReturnType<typeof getFeaturedArticles>>
    intro: Awaited<ReturnType<typeof getSection>>
    introCode: string
    title: string
    subTitle: string
    tweets: TweetV2[]
  }>()

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 mt-8 gap-8 lg:gap-0">
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
            alt="A picture of me."
          />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
        {articles.map(article => {
          return <ArticleBlock article={article} key={article.slug} />
        })}
      </div>
      <h2 className="text-2xl text-brand-dark">@ArcathWhitefall</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
        {tweets.map(tweet => {
          return (
            <div key={tweet.id}>
              <div
                className="pb-2 border-b border-brand-light"
                dangerouslySetInnerHTML={{__html: nl2br(tweet.text)}}
              />
              <div>
                {formatDistance(new Date(), new Date(tweet.created_at!))} ago
              </div>
            </div>
          )
        })}
        <div>
          <ButtonA href="https://twitter.com/adammlaycock" target="_BLANK">
            Follow me on Twitter
          </ButtonA>
        </div>
      </div>
    </div>
  )
}
