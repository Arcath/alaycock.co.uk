import type {LoaderFunction} from 'remix'
import {useLoaderData} from 'remix'

export const loader: LoaderFunction = ({params}) => {
  console.dir(params.year)

  return {foo: 'bar'}
}

export default function () {
  const post = useLoaderData()

  return <div>{JSON.stringify(post)}</div>
}
