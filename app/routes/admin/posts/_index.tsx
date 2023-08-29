import {type LoaderArgs, json} from '@remix-run/node'
import {useLoaderData, useMatch, Outlet} from '@remix-run/react'

import {requireLogin} from '~/lib/session.server'
import {getPrisma} from '~/lib/prisma.server'

export const loader = async ({request}: LoaderArgs) => {
  await requireLogin(request)

  const prisma = getPrisma()

  const posts = await prisma.post.findMany({
    select: {date: true, title: true, tags: true, id: true},
    orderBy: {date: 'desc'}
  })

  return json({posts})
}

const AdminPosts = () => {
  const {posts} = useLoaderData<typeof loader>()
  const match = useMatch('/admin/posts')

  if (match === null) {
    return <Outlet />
  }

  return (
    <div className="bg-white shadow-xl rounded-xl p-2 mt-4 m-auto w-1/2">
      <h1 className="text-2xl">Posts</h1>
      <a
        href="/admin/posts/new"
        className="inline-block bg-green-300 rounded shadow p-1 text-white"
      >
        New Post
      </a>
      <table className="w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Date</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {posts.map(({id, date, title, tags}, i) => {
            return (
              <tr key={id}>
                <td>
                  <a href={`/admin/posts/${id}`}>{title}</a>
                </td>
                <td>{date}</td>
                <td>{tags}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default AdminPosts
