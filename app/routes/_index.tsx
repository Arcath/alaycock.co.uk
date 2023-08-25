import type {V2_MetaFunction} from '@remix-run/node'
import {increment} from '@arcath/utils'

import {Profile} from '~/components/blocks/profile'
import {BlockButton} from '~/components/ui/blocks'
import {pageTitle} from '~/lib/utils'

export const meta: V2_MetaFunction = () => {
  return [
    {title: pageTitle()},
    {name: 'description', content: 'EdTech Network Manager'}
  ]
}

export default function Index() {
  const delay = increment({initial: 0, increment: 0.3})

  return (
    <div className="p-16 grid grid-cols-4 gap-16">
      <Profile className="row-span-2" />
      <BlockButton
        delay={delay()}
        label="Blog"
        target="/articles"
        image="/img/buttons/blog.svg"
      />
      <BlockButton
        delay={delay()}
        label="Twitter"
        target="https://twitter.com/AdamMLaycock"
        image="/img/buttons/x.svg"
      />
      <BlockButton
        delay={delay()}
        label="Github"
        target="https://www.github.com/arcath"
        image="/img/buttons/github.svg"
      />
      <BlockButton
        delay={delay()}
        label="Mastodon"
        target="https://mastodon.content.town/@arcath"
        image="/img/buttons/mastodon.svg"
      />
      <BlockButton
        delay={delay()}
        label="Polywork"
        target="https://cv.alaycock.co.uk"
        image="/img/buttons/polywork.svg"
      />
    </div>
  )
}
