import {gql} from 'graphql-request'

import {getGraph} from './client.server'

import type {Article} from './articles.server'

export type Tag<ArticleFields extends keyof Article = keyof Article> = {
  name: string
  slug: string
  articles: Pick<Article, ArticleFields>[]
}

const GET_TAGS_QUERY = gql`
  query GetTags {
    tags(orderBy: name_ASC) {
      name
      slug
      articles {
        slug
      }
    }
  }
`

export const getTags = async () => {
  const graph = getGraph()

  const tags = await graph.request<{
    tags: Pick<Tag<'slug'>, 'name' | 'slug' | 'articles'>[]
  }>(GET_TAGS_QUERY)

  return tags.tags
}

const GET_TAG_QUERY = gql`
  query GetTag($slug: String!) {
    tag(where: {slug: $slug}) {
      name
    }
  }
`

export const getTag = async (slug: string) => {
  const graph = getGraph()

  const tag = await graph.request<{tag: Pick<Tag, 'name'>}>(GET_TAG_QUERY, {
    slug
  })

  return tag.tag
}
