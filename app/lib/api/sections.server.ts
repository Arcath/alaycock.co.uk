import {gql} from 'graphql-request'

import {getGraph} from './client.server'

export type Section = {
  slug: string
  body: string
}

const GET_SECTION_QUERY = gql`
  query getSection($slug: String!) {
    section(where: {slug: $slug}) {
      slug
      body
    }
  }
`

export const getSection = async (slug: string) => {
  const graph = getGraph()

  const section = await graph.request<{
    section: Pick<Section, 'body' | 'slug'>
  }>(GET_SECTION_QUERY, {slug})

  return section.section
}
