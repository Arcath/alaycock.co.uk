import {bundleMDX} from 'mdx-bundler'

export const compileMDX = async (source: string) => {
  const {code, errors} = await bundleMDX({
    source
  })

  console.dir(errors)

  return code
}
