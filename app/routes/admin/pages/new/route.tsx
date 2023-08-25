import {
  type LoaderArgs,
  json,
  type V2_MetaArgs,
  type ActionArgs,
  redirect
} from '@remix-run/node'
import {invariant} from '@arcath/utils'

import {requireLogin} from '~/lib/session.server'
import {pageTitle} from '~/lib/utils'
import {getPrisma} from '~/lib/prisma.server'
import {compileMDX} from '~/lib/mdx.server'

import {forms} from '~/components/ui/form'

export const loader = async ({request}: LoaderArgs) => {
  await requireLogin(request)

  return json({})
}

export const action = async ({request}: ActionArgs) => {
  await requireLogin(request)

  const prisma = getPrisma()

  const formData = await request.formData()

  const title = formData.get('title') as string | undefined
  const slug = formData.get('slug') as string | undefined

  invariant(title)
  invariant(slug)

  const source = ''
  const compiled = await compileMDX(source)

  const page = await prisma.page.create({
    data: {
      title,
      slug,
      source,
      compiled
    }
  })

  return redirect(`/admin/pages/${page.id}`)
}

export const meta = ({}: V2_MetaArgs<typeof loader>) => {
  return [{title: pageTitle('New Page', 'Admin')}]
}

const AdminNewPage = () => {
  return (
    <div className="bg-white shadow-xl rounded-xl p-2 mt-4 m-auto w-1/2">
      <h1 className="text-2xl">New Page</h1>
      <forms.form method="post">
        <div className="grid grid-cols-2 gap-2">
          <forms.label>
            <forms.details>Title</forms.details>
            <forms.input type="text" name="title" />
          </forms.label>
          <forms.label>
            <forms.details>Slug</forms.details>
            <forms.input type="text" name="slug" />
          </forms.label>
          <forms.label>
            <forms.button>Create Page</forms.button>
          </forms.label>
        </div>
      </forms.form>
    </div>
  )
}

export default AdminNewPage
