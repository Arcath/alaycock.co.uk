import {type LoaderArgs, json, type V2_MetaArgs} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {format} from 'date-fns'
import {useMemo} from 'react'

import {getPrisma} from '~/lib/prisma.server'
import {components, getMDXComponent} from '~/lib/content'
import {pageTitle} from '~/lib/utils'

import {Profile} from '~/components/blocks/profile'

export const loader = async ({params}: LoaderArgs) => {
  const prisma = getPrisma()

  const post = await prisma.post.findFirstOrThrow({
    select: {title: true, date: true, tags: true, compiled: true, lead: true},
    where: {slug: params.slug}
  })

  return json({post})
}

export const meta = ({data}: V2_MetaArgs<typeof loader>) => {
  return [
    {title: pageTitle(data?.post.title!)},
    {name: 'description', content: data?.post.lead}
  ]
}

const PostPage = () => {
  const {post} = useLoaderData<typeof loader>()

  const Post = useMemo(() => getMDXComponent(post.compiled), [post.compiled])

  return (
    <div className="grid grid-cols-content">
      <h1 className="text-4xl col-start-3 mt-8 text-center text-white">
        {post.title}
      </h1>
      <div className="bg-white rounded-xl shadow-xl col-start-3 p-2">
        <span className="border-r border-grey-200 pr-2 mr-2">
          {format(new Date(post.date), 'do LLLL yyyy')}
        </span>
        {post.tags.split(',').map((tag, i) => {
          return (
            <a href={`/articles/${tag.trim()}`} key={i} className="mr-2">
              {tag.trim()}
            </a>
          )
        })}
      </div>
      <Post components={components} />
      <Profile
        className={`col-start-3 mt-4 grid grid-cols-2 gap-2`}
        imageClasses="row-span-5"
      />
    </div>
  )
}

export default PostPage
