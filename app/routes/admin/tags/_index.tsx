import {type LoaderArgs, json} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'

import {requireLogin} from '~/lib/session.server'
import {getTags} from '~/lib/tags'

export const loader = async ({request}: LoaderArgs) => {
  await requireLogin(request)

  const tags = await getTags()

  return json({tags})
}

const AdminTags = () => {
  const {tags} = useLoaderData<typeof loader>()

  return (
    <div className="bg-white shadow-xl rounded-xl p-2 mt-4 m-auto w-1/2">
      <h1 className="text-2xl">Tags</h1>
      <ul>
        {tags.map(({tag}, i) => {
          return <li key={i}>{tag}</li>
        })}
      </ul>
    </div>
  )
}

export default AdminTags
