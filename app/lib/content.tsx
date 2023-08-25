import {getMDXComponent as gmc} from 'mdx-bundler/client'
import {type Language} from 'prism-react-renderer'

import {Code} from '~/components/blocks/code'

export const getMDXComponent = (source: string) => {
  return gmc(source)
}

const preToCodeBlock = (
  preProps: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLPreElement>,
    HTMLPreElement
  > & {
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

export const components = {
  h1: (
    props: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >
  ) => {
    return <h1 {...props} />
  },
  h2: (
    props: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >
  ) => {
    return (
      <h2
        {...props}
        className="col-start-2 col-span-3 border-2 border-white rounded p-1 text-xl text-white shadow-xl"
      />
    )
  },
  h3: (
    props: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLHeadingElement>,
      HTMLHeadingElement
    >
  ) => {
    return (
      <h3
        {...props}
        className="col-start-2 col-span-3 border-2 border-white rounded p-1 text-xl text-white shadow-xl"
      />
    )
  },
  p: (
    props: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLParagraphElement>,
      HTMLParagraphElement
    >
  ) => {
    return (
      <p
        {...props}
        className="col-start-3 bg-white first-of-type:rounded-t-xl shadow-xl first-of-type:mt-4 p-2 last-of-type:rounded-b-xl last-of-type:mb-4"
      />
    )
  },
  pre: (
    preProps: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLPreElement>,
      HTMLPreElement
    >
  ) => {
    const props = preToCodeBlock(preProps as any)

    if (props) {
      return (
        <div className="col-span-3 col-start-2">
          <Code {...props} />
        </div>
      )
    }

    return (
      <pre
        {...preProps}
        className="col-start-2 col-span-3 rounded-xl bg-gray-800"
      />
    )
  },
  ul: (
    props: React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLUListElement>,
      HTMLUListElement
    >
  ) => {
    return <ul {...props} className="col-start-3 bg-white shadow-xl p-2" />
  }
}
