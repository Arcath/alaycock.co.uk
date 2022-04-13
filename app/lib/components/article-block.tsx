import {Link} from '@remix-run/react'
import {format} from 'date-fns'

import {ButtonLink} from './button'

export const ArticleBlock: React.FC<{
  article: {
    title: string
    lead: string
    slug: string
    tags: {slug: string; name: string}[]
    date: string
  }
}> = ({article}) => {
  const [year, month] = article.date.split('-')
  const date = new Date(article.date)

  return (
    <div key={article.slug} className="mb-6 relative">
      <div className="bg-fixed bg-gradient-to-b from-brand-dark to-brand-light h-24 z-0 relative rotate-2-5 p-2">
        <div className="bg-white dark:bg-black w-full h-full" />
      </div>
      <Link
        to={`/${year}/${month}/${article.slug}`}
        className="absolute top-0 left-0 z-10 m-4 text-lg hover:text-brand-dark"
      >
        {article.title}
      </Link>
      <div className="text-gray-400 text-sm">
        {format(date, 'do MMMM yyyy')}
      </div>
      <div>
        {article.tags.map(tag => {
          return (
            <ButtonLink
              to={`/articles/${tag.slug}`}
              key={tag.slug}
              className="mr-2 my-2 inline-block"
            >
              {tag.name}
            </ButtonLink>
          )
        })}
      </div>
      <p>{article.lead}</p>
    </div>
  )
}
