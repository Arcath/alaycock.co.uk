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
import {pageTitle, htmlDate} from '~/lib/utils'
import {compileMDX} from '~/lib/mdx.server'
import {StatusMessage} from '~/components/blocks/status-message'

export const loader = async ({request, params}: LoaderArgs) => {
  await requireLogin(request)

  const prisma = getPrisma()

  const post = await prisma.post.findFirstOrThrow({where: {id: params.postId}})

  return json({post})
}

export const meta: V2_MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: pageTitle(data?.post.title ? data?.post.title : '', 'Edit Post')}
  ]
}

export const action = async ({request, params}: ActionArgs) => {
  await requireLogin(request)

  const prisma = getPrisma()

  const formData = await request.formData()

  const title = formData.get('title') as string | undefined
  const slug = formData.get('slug') as string | undefined
  const dateString = formData.get('date') as string | undefined
  const tags = formData.get('tags') as string | undefined
  const source = formData.get('source') as string | undefined
  const lead = formData.get('lead') as string | undefined
  const image = formData.get('image') as string | undefined

  invariant(title)
  invariant(slug)
  invariant(dateString)
  invariant(tags)
  invariant(source)
  invariant(lead)
  invariant(image)

  const compiled = await compileMDX(source)

  const date = new Date(dateString)

  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString()

  await prisma.post.update({
    where: {id: params.postId},
    data: {
      title,
      slug,
      date,
      year,
      month,
      tags,
      source,
      compiled,
      nextSource: source,
      draft: false,
      featured: false,
      lead,
      image
    }
  })

  return json({result: true, message: 'Post Updated'})
}

const AdminPostEdit = () => {
  const {post} = useLoaderData<typeof loader>()
  const actionData = useActionData<typeof action>()

  return (
    <div className="bg-white shadow-xl rounded-xl my-4 p-2 w-1/2 m-auto">
      <h1 className="text-2xl">Edit Post</h1>
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
            <forms.input type="text" name="title" defaultValue={post.title} />
          </forms.label>
          <forms.label>
            <forms.details>Slug</forms.details>
            <forms.input type="text" name="slug" defaultValue={post.slug} />
          </forms.label>
          <forms.label>
            <forms.details>Date</forms.details>
            <forms.input
              type="date"
              name="date"
              defaultValue={htmlDate(new Date(post.date))}
            />
          </forms.label>
          <forms.label>
            <forms.details>Tags</forms.details>
            <forms.input type="text" name="tags" defaultValue={post.tags} />
          </forms.label>
          <forms.label>
            <forms.details>Draft</forms.details>
            <forms.input type="checkbox" name="draft" />
          </forms.label>
          <forms.label>
            <forms.details>Featured</forms.details>
            <forms.input type="checkbox" name="featured" />
          </forms.label>
          <forms.label>
            <forms.details>Image URL</forms.details>
            <forms.input type="text" name="image" />
          </forms.label>
          <forms.label className="col-span-2">
            <forms.details>Lead</forms.details>
            <forms.textarea name="lead" defaultValue={post.lead} />
          </forms.label>
          <forms.label className="col-span-2">
            <forms.details>Body</forms.details>
            <forms.textarea
              name="source"
              rows={20}
              defaultValue={post.source}
            />
          </forms.label>
          <forms.label className="col-span-2">
            <forms.button>Update Post</forms.button>
          </forms.label>
        </div>
      </forms.form>
    </div>
  )
}

export default AdminPostEdit
