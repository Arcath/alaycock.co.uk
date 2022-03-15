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
  query getArticles($first: Int!, $skip: Int!) {
    articles(orderBy: date_DESC, first: $first, skip: $skip) {
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
  featured,
  tag
}: {
  count: number
  skip: number
  featured?: boolean
  tag?: string
}) => {
  const graph = getGraph()

  const articles = await graph.request<{
    articles: Pick<
      Article<'name' | 'slug'>,
      'title' | 'slug' | 'date' | 'tags' | 'lead'
    >[]
  }>(GET_ARTICLES_QUERY, {first: count, skip, featured, tag})

  return articles.articles
}

const GET_TAGGED_ARTICLES_QUERY = gql`
  query getArticles(
    $first: Int!
    $skip: Int!
    $featured: Boolean
    $tag: String
  ) {
    articles(
      orderBy: date_DESC
      first: $first
      skip: $skip
      where: {featured: $featured, tags_some: {slug: $tag}}
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

export const getTaggedArticles = async ({
  count,
  skip,
  featured,
  tag
}: {
  count: number
  skip: number
  featured?: boolean
  tag?: string
}) => {
  const graph = getGraph()

  const articles = await graph.request<{
    articles: Pick<
      Article<'name' | 'slug'>,
      'title' | 'slug' | 'date' | 'tags' | 'lead'
    >[]
  }>(GET_TAGGED_ARTICLES_QUERY, {first: count, skip, featured, tag})

  return articles.articles
}

const GET_ARTICLES_COUNT = gql`
  query getArticlesCount {
    articlesConnection {
      aggregate {
        count
      }
    }
  }
`

export const getArticlesCount = async () => {
  const graph = getGraph()

  const aggregate = await graph.request<{
    articlesConnection: {aggregate: {count: number}}
  }>(GET_ARTICLES_COUNT)

  return aggregate.articlesConnection.aggregate.count
}

const GET_FEATURED_ARTICLES_QUERY = gql`
  query getArticles($first: Int!, $skip: Int!) {
    articles(
      orderBy: date_DESC
      first: $first
      skip: $skip
      where: {featured: true}
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

export const getFeaturedArticles = async ({
  count,
  skip,
  tag
}: {
  count: number
  skip: number
  featured?: boolean
  tag?: string
}) => {
  const graph = getGraph()

  const articles = await graph.request<{
    articles: Pick<
      Article<'name' | 'slug'>,
      'title' | 'slug' | 'date' | 'tags' | 'lead'
    >[]
  }>(GET_FEATURED_ARTICLES_QUERY, {first: count, skip, tag})

  return articles.articles
}
