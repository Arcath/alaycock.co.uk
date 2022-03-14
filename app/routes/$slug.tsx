import type {LoaderFunction, MetaFunction} from 'remix'
import {useLoaderData} from 'remix'

import {getPage} from '~/lib/api/page.server'

import {prepareMDX} from '~/lib/mdx.server'
import {MDXContent} from '~/lib/components/content'
import {pageTitle} from '~/lib/utils'

export const loader: LoaderFunction = async ({params}) => {
  const {slug} = params

  const page = await getPage(slug!)

  if (!page) {
    throw new Response('Not Found', {status: 404})
  }

  const {code} = await prepareMDX({
    source: page.body,
    bundlePath: `/${slug}`
  })

  return {page, code}
}

export const meta: MetaFunction = ({data}) => {
  return {title: data ? pageTitle(data.page.title) : pageTitle('')}
}

const Page = () => {
  const {page, code} =
    useLoaderData<{page: Awaited<ReturnType<typeof getPage>>; code: string}>()

  return (
    <div className="grid grid-cols-content prose dark:prose-dark mdx-content">
      <h1>{page!.title}</h1>

      <MDXContent source={code} />
    </div>
  )
}

export default Page
