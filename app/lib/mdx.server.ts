import {bundleMDX} from 'mdx-bundler'
import remarkGfm from 'remark-gfm'

export const prepareMDX = async ({
  source,
  bundlePath,
  files
}: {
  source: string
  bundlePath: string
  files?: {[fileName: string]: string}
}) => {
  const {code} = await bundleMDX({
    source: source.replace(/\(\.\//g, `(${bundlePath}/`),
    files,
    mdxOptions: options => {
      options.remarkPlugins = [remarkGfm]

      return options
    }
  })

  return {code}
}
