import {useMemo} from 'react'
import type {ReactHTMLElement} from 'react'
import {getMDXComponent} from 'mdx-bundler/client'
import {Link} from '@remix-run/react'
import type {Language} from 'prism-react-renderer'

import {Code} from './code'
import {GPO} from './gpo'

import {ButtonLink} from './button'

const Paragraph: React.FC<
  ReactHTMLElement<HTMLParagraphElement>['props']
> = props => {
  if (
    typeof props.children === 'object' &&
    (props.children as {type: string}).type === 'img'
  ) {
    // eslint-disable-next-line
    return <>{props.children}</>
  }

  return <p {...props} />
}

const Anchor: React.FC<
  Partial<ReactHTMLElement<HTMLAnchorElement>['props']>
> = props => {
  const {href, children} = props

  if (!href) {
    // eslint-disable-next-line
    return <a {...props} />
  }

  if (href.substr(0, 4) === 'http' || href.substr(0, 4) === 'mail') {
    return <a href={href}>{children}</a>
  }

  return <Link to={href}>{children}</Link>
}

const preToCodeBlock = (
  preProps: Partial<ReactHTMLElement<HTMLPreElement>['props']> & {
    children?: {props: {}; type: string}
  }
) => {
  if (
    // code props
    preProps.children?.props &&
    // if children is actually a <code>
    preProps.children.type === 'code'
  ) {
    // we have a <pre><code> situation
    const {
      children: codeString,
      className = '',
      ...props
    } = preProps.children.props as {
      children: string
      className: string
      line: string
      filename: string
    }

    const matches = className.match(/language-(?<lang>.*)/)

    return {
      codeString: codeString.trim(),
      className,
      language: (matches?.groups?.lang ? matches.groups.lang : '') as Language,
      ...props
    }
  }
}

const components: {} = {
  a: Anchor,
  p: Paragraph,
  pre: (preProps: Partial<ReactHTMLElement<HTMLPreElement>['props']>) => {
    // eslint-disable-next-line
    const props = preToCodeBlock(preProps as any)

    if (props) {
      return <Code {...props} />
    }

    return <pre {...preProps} />
  },
  ButtonLink,
  GPO
}

export const MDXContent: React.FC<{source: string}> = ({source}) => {
  const Component = useMemo(() => getMDXComponent(source), [source])

  return <Component components={components} />
}
