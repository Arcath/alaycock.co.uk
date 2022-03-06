import {GraphQLClient} from 'graphql-request'

export const getGraph = () => {
  return new GraphQLClient(process.env.API_URL!, {
    headers: {Authorization: `Bearer ${process.env.API_TOKEN}`}
  })
}
