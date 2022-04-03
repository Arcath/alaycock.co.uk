import {useMemo} from 'react'
import type {ReactHTMLElement} from 'react'
import {getMDXComponent} from 'mdx-bundler/client'
import {omit} from '@arcath/utils'
import {Link} from 'remix'

import {Code} from './code'
import {GPO} from './gpo'

import {ButtonLink} from './button'

const Paragraph: React.FC<any> = props => {
  if (typeof props.children !== 'string' && props.children.type === 'img') {
    return <>{props.children}</>
  }

  return <p {...props} />
}

const Anchor: React.FC<
  Partial<ReactHTMLElement<HTMLAnchorElement>['props']>
> = props => {
  const {href, children} = props

  if (!href) {
    return <a {...props} />
  }

  if (href!.substr(0, 4) === 'http' || href!.substr(0, 4) === 'mail') {
    return <a href={href!}>{children}</a>
  }

  return <Link to={href!}>{children}</Link>
}

const components = {
  a: Anchor,
  p: Paragraph,
  pre: (preProps: Partial<ReactHTMLElement<HTMLPreElement>['props']>) => {
    const props = preToCodeBlock(preProps)

    if (props) {
      return <Code {...props} />
    }

    return <pre {...preProps} />
  },
  ButtonLink,
  GPO
} as any

export const MDXContent: React.FC<{source: string}> = ({source}) => {
  const Component = useMemo(() => getMDXComponent(source), [source])

  return <Component components={components} />
}

const preToCodeBlock = (preProps: any) => {
  if (
    // children is code element
    preProps.children &&
    // code props
    preProps.children.props &&
    // if children is actually a <code>
    preProps.children.type === 'code'
  ) {
    // we have a <pre><code> situation
    const {
      children: codeString,
      className = '',
      ...props
    } = preProps.children.props

    const matches = className.match(/language-(?<lang>.*)/)

    return {
      codeString: codeString.trim(),
      className,
      line: props.line,
      fileName: props.filename,
      language:
        matches && matches.groups && matches.groups.lang
          ? matches.groups.lang
          : '',
      ...omit(props, ['children'])
    }
  }
}
