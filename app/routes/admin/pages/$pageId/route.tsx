import {
  type LoaderArgs,
  json,
  type V2_MetaFunction,
  type ActionArgs
} from '@remix-run/node'
import {useActionData, useLoaderData} from '@remix-run/react'
import {invariant} from '@arcath/utils'

import {requireLogin} from '~/lib/session.server'
import {forms} from '~/components/ui/form'
import {getPrisma} from '~/lib/prisma.server'
import {pageTitle} from '~/lib/utils'
import {compileMDX} from '~/lib/mdx.server'
import {StatusMessage} from '~/components/blocks/status-message'

export const loader = async ({request, params}: LoaderArgs) => {
  await requireLogin(request)

  const prisma = getPrisma()

  const page = await prisma.page.findFirstOrThrow({where: {id: params.pageId}})

  return json({page})
}

export const meta: V2_MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: pageTitle(data?.page.title ? data?.page.title : '', 'Edit Page')}
  ]
}

export const action = async ({request, params}: ActionArgs) => {
  await requireLogin(request)

  const prisma = getPrisma()

  const formData = await request.formData()

  const title = formData.get('title') as string | undefined
  const slug = formData.get('slug') as string | undefined
  const source = formData.get('source') as string | undefined

  invariant(title)
  invariant(slug)
  invariant(source)

  const compiled = await compileMDX(source)

  await prisma.page.update({
    where: {id: params.pageId},
    data: {
      title,
      slug,
      source,
      compiled
    }
  })

  return json({result: true, message: 'Page Updated'})
}

const AdminPageEdit = () => {
  const {page} = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  return (
    <div className="bg-white shadow-xl rounded-xl my-4 p-2 w-1/2 m-auto">
      <h1 className="text-2xl">Edit Page</h1>
      {actionData ? (
        <StatusMessage
          messageType={actionData.result ? 'success' : 'error'}
          message={actionData.message}
        />
      ) : (
        ''
      )}
      <forms.form method="post">
        <div className="grid grid-cols-2 gap-2">
          <forms.label>
            <forms.details>Title</forms.details>
            <forms.input type="text" name="title" defaultValue={page.title} />
          </forms.label>
          <forms.label>
            <forms.details>Slug</forms.details>
            <forms.input type="text" name="slug" defaultValue={page.slug} />
          </forms.label>
          <forms.label className="col-span-2">
            <forms.details>Body</forms.details>
            <forms.textarea
              name="source"
              rows={20}
              defaultValue={page.source}
            />
          </forms.label>
          <forms.label className="col-span-2">
            <forms.button>Update Page</forms.button>
          </forms.label>
        </div>
      </forms.form>
    </div>
  )
}

export default AdminPageEdit
