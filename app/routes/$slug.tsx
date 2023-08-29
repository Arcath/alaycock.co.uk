import {type LoaderArgs, json, type V2_MetaArgs} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {useMemo} from 'react'

import {getPrisma} from '~/lib/prisma.server'
import {getMDXComponent, components} from '~/lib/content'
import {pageTitle} from '~/lib/utils'

export const loader = async ({params}: LoaderArgs) => {
  const prisma = getPrisma()

  const page = await prisma.page.findFirstOrThrow({where: {slug: params.slug}})

  return json({page})
}

export const meta = ({data}: V2_MetaArgs<typeof loader>) => {
  return [{title: pageTitle(data ? data.page.title : '')}]
}

const Page = () => {
  const {page} = useLoaderData<typeof loader>()

  const Post = useMemo(() => getMDXComponent(page.compiled), [page.compiled])

  return (
    <div className="grid grid-cols-content">
      <h1 className="text-4xl col-start-3 mt-8 text-center text-white">
        {page.title}
      </h1>
      <Post components={components} />
    </div>
  )
}

export default Page
