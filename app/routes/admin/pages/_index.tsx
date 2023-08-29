import {type LoaderArgs, json} from '@remix-run/node'
import {useLoaderData, useMatch, Outlet} from '@remix-run/react'

import {requireLogin} from '~/lib/session.server'
import {getPrisma} from '~/lib/prisma.server'
import {pageTitle} from '~/lib/utils'

export const loader = async ({request}: LoaderArgs) => {
  await requireLogin(request)

  const prisma = getPrisma()

  const pages = await prisma.page.findMany({
    select: {id: true, title: true, slug: true}
  })

  return json({pages})
}

export const meta = () => {
  return [{title: pageTitle('Pages', 'Admin')}]
}

const AdminPages = () => {
  const {pages} = useLoaderData<typeof loader>()
  const match = useMatch('/admin/pages')

  if (match === null) {
    return <Outlet />
  }

  return (
    <div className="bg-white shadow-xl rounded-xl p-2 mt-4 m-auto w-1/2">
      <h1 className="text-2xl">Pages</h1>
      <a
        href="/admin/pages/new"
        className="inline-block bg-green-300 rounded shadow p-1 text-white"
      >
        New Page
      </a>
      <table className="w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Slug</th>
          </tr>
        </thead>
        <tbody>
          {pages.map(({id, title, slug}, i) => {
            return (
              <tr key={id}>
                <td>
                  <a href={`/admin/pages/${id}`}>{title}</a>
                </td>
                <td>{slug}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default AdminPages
