import {gql} from 'graphql-request'

import {getGraph} from './client.server'

import type {Tag} from './tags.server'

export type Article<TagFields extends keyof Tag = keyof Tag<'slug'>> = {
  title: string
  body: string
  slug: string
  date: string
  lead: string
  assets: {
    fileName: string
    url: string
  }[]
  tags: Pick<Tag, TagFields>[]
  components: {fileName: string; source: string}[]
  featured: boolean
}

const GET_ARTICLE_QUERY = gql`
  query getArticle($slug: String!) {
    article(where: {slug: $slug}) {
      title
      body
      date
      components {
        fileName
        source
      }
    }
  }
`

export const getArticle = async (
  slug: string,
  {year, month}: {year?: string; month?: string} = {}
) => {
  const graph = getGraph()

  const article = await graph.request<{
    article: Pick<Article, 'title' | 'body' | 'date' | 'components'> | null
  }>(GET_ARTICLE_QUERY, {slug})

  if (article.article === null) {
    return undefined
  }

  const [dYear, dMonth, dDay] = article.article.date.split('-')

  if (dYear !== year && dMonth !== month) {
    return undefined
  }

  return article.article
}

const GET_ARTICLE_ASSETS_QUERY = gql`
  query getArticle($slug: String!, $fileName: String!) {
    article(where: {slug: $slug}) {
      assets(where: {fileName: $fileName}) {
        fileName
        url
      }
    }
  }
`

export const getArticleAsset = async (slug: string, fileName: string) => {
  const graph = getGraph()

  const article = await graph.request<{
    article: Pick<Article, 'assets'>
  }>(GET_ARTICLE_ASSETS_QUERY, {slug, fileName})

  return article.article.assets[0]
}

const GET_ARTICLES_QUERY = gql`
  query getArticles($first: Int!, $skip: Int!, $featured: Boolean) {
    articles(
      orderBy: date_DESC
      first: $first
      skip: $skip
      where: {featured: $featured}
    ) {
      title
      slug
      date
      lead
      tags {
        name
        slug
      }
    }
  }
`

export const getArticles = async ({
  count,
  skip,
  featured
}: {
  count: number
  skip: number
  featured?: boolean
}) => {
  const graph = getGraph()

  const articles = await graph.request<{
    articles: Pick<
      Article<'name' | 'slug'>,
      'title' | 'slug' | 'date' | 'tags' | 'lead'
    >[]
  }>(GET_ARTICLES_QUERY, {first: count, skip, featured})

  return articles.articles
}
