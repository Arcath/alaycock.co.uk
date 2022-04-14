import {gql} from 'graphql-request'

import {getGraph} from './client.server'

export type Page = {
  title: string
  body: string
}

const GET_PAGE_QUERY = gql`
  query getPage($slug: String!) {
    page(where: {slug: $slug}) {
      title
      body
    }
  }
`

export const getPage = async (slug: string) => {
  const graph = getGraph()

  const page = await graph.request<{page: Pick<Page, 'title' | 'body'> | null}>(
    GET_PAGE_QUERY,
    {slug}
  )

  if (page.page === null) {
    return undefined
  }

  return page.page
}
