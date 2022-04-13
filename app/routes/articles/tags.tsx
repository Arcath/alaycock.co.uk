import type {LoaderFunction, MetaFunction} from '@remix-run/node'
import {json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'

import {pageTitle, openGraph} from '../../lib/utils'

import {getTags} from '~/lib/api/tags.server'

import {ButtonLink} from '~/lib/components/button'

export const loader: LoaderFunction = async ({request, params}) => {
  const tags = await getTags()

  return json({tags})
}

export let meta: MetaFunction = ({data}) => {
  const openGraphTags = openGraph({title: 'Tags'})

  return {
    title: pageTitle('Article Tags'),
    ...openGraphTags
  }
}

const TagsPage = () => {
  const {tags} = useLoaderData<{tags: Awaited<ReturnType<typeof getTags>>}>()

  return (
    <div className="grid grid-cols-layout">
      <div className="col-start-2">
        <h1 className="text-3xl">Tags</h1>
      </div>
      <div className="col-start-2">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 my-4">
          {tags.map(tag => {
            return (
              <ButtonLink key={tag.slug} to={`/articles/${tag.slug}`}>
                {tag.name} ({tag.articles.length})
              </ButtonLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default TagsPage
