import {type LoaderArgs, json, type V2_MetaArgs} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'

import {getPrisma} from '~/lib/prisma.server'
import {getTags} from '~/lib/tags'
import {pageTitle} from '~/lib/utils'

export const loader = async ({params}: LoaderArgs) => {
  const prisma = getPrisma()

  const tag = params['*']

  const posts = await prisma.post.findMany({
    select: {
      title: true,
      slug: true,
      year: true,
      month: true,
      id: true,
      lead: true,
      tags: true,
      image: true
    },
    where: {
      AND: [
        {draft: false},
        tag !== '' ? {OR: [{tags: {contains: tag}}, {tags: {equals: tag}}]} : {}
      ]
    },
    orderBy: {date: 'desc'}
  })

  const tags = await getTags()

  return json({posts, tag, tags})
}

export const meta = ({data}: V2_MetaArgs<typeof loader>) => {
  if (!data) {
    return []
  }

  if (data.tag) {
    return [{title: pageTitle(data.tag, 'Articles')}]
  }

  return [{title: pageTitle('Articles')}]
}

const Articles = () => {
  const {posts, tags, tag: currentTag} = useLoaderData<typeof loader>()

  return (
    <div className="w-3/4 m-auto my-4">
      <div className="bg-white rounded-xl shadow-xl p-2 mb-4">
        <h1 className="text-2xl">Articles</h1>
        {currentTag
          ? `Showing ${posts.length} articles tagged ${currentTag}.`
          : `Showing all ${posts.length} articles.`}
      </div>
      <div className="mb-4 flex justify-between gap-2 flex-wrap">
        {currentTag ? (
          <a
            href={`/articles`}
            className={`border-white rounded-xl shadow-xl p-2 border bg-white`}
          >
            all
          </a>
        ) : (
          ''
        )}
        {tags.map(({tag}, i) => {
          return (
            <a
              href={`/articles/${tag}`}
              className={`${
                tag === currentTag ? 'border-green-300' : 'border-white'
              } rounded-xl shadow-xl p-2 border bg-white`}
              key={i}
            >
              {tag}
            </a>
          )
        })}
      </div>
      {posts.map(({id, title, lead, year, month, slug, tags, image}, i) => {
        const gridType =
          i % 2 === 0 ? 'grid-cols-articlel' : 'grid-cols-articler'

        const imageUrl = image === '' ? '/img/profile.jpg' : image

        return (
          <div key={id} className={`grid ${gridType} gap-4 mb-4`}>
            {i % 2 !== 0 ? (
              <div
                className="square rounded-xl shadow-xl w-64 h-64 bg-cover"
                style={{backgroundImage: `url(${imageUrl})`}}
              />
            ) : (
              ''
            )}
            <div className="bg-white shadow-xl rounded-xl p-2">
              <h2 className="text-xl mb-4">
                <a href={`/${year}/${month}/${slug}`}>{title}</a>
              </h2>
              <p>{lead}</p>
              <div className="flex gap-2 justify-start mt-4">
                {tags.split(',').map((tag, i) => {
                  return (
                    <a href={`/articles/${tag.trim()}`} key={i}>
                      {tag.trim()}
                    </a>
                  )
                })}
              </div>
            </div>
            {i % 2 === 0 ? (
              <div
                className="square rounded-xl shadow-xl w-64 h-64 bg-cover"
                style={{backgroundImage: `url(${imageUrl})`}}
              />
            ) : (
              ''
            )}
          </div>
        )
      })}
    </div>
  )
}

export default Articles
