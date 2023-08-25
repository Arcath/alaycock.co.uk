import {type LoaderArgs, json, type ActionArgs, redirect} from '@remix-run/node'
import {invariant} from '@arcath/utils'

import {requireLogin} from '~/lib/session.server'
import {forms} from '~/components/ui/form'
import {getPrisma} from '~/lib/prisma.server'
import {compileMDX} from '~/lib/mdx.server'

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
  const dateString = formData.get('date') as string | undefined
  const tags = formData.get('tags') as string | undefined

  invariant(title)
  invariant(slug)
  invariant(dateString)
  invariant(tags)

  const source = ''
  const compiled = await compileMDX(source)

  const date = new Date(dateString)

  const year = date.getFullYear().toString()
  const month = (date.getMonth() + 1).toString()

  const post = await prisma.post.create({
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
      featured: false
    }
  })

  return redirect(`/admin/posts/${post.id}`)
}

const AdminPostsNew = () => {
  return (
    <div className="bg-white shadow-xl rounded-xl p-2 mt-4 m-auto w-1/2">
      <h1 className="text-2xl">New Post</h1>
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
            <forms.details>Date</forms.details>
            <forms.input type="date" name="date" />
          </forms.label>
          <forms.label>
            <forms.details>Tags</forms.details>
            <forms.input type="text" name="tags" />
          </forms.label>
          <forms.label>
            <forms.button>Create Post</forms.button>
          </forms.label>
        </div>
      </forms.form>
    </div>
  )
}

export default AdminPostsNew
