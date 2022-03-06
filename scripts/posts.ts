import path from 'path'
import fs from 'fs'

import {asyncForEach} from '@arcath/utils'
import {bundleMDX} from 'mdx-bundler'
import mkdir from 'mkdirp'

const SRC_DIRECTORY = path.join(process.cwd(), 'content', 'posts')
const DEST_DIRECTORY = path.join(process.cwd(), 'app', 'routes')

const {readdir, writeFile} = fs.promises

export const prepareMDX = async ({
  file,
  path,
  directory
}: {
  file: string
  path: string
  directory: string
}) => {
  const {code} = await bundleMDX({
    file,
    bundlePath: path,
    bundleDirectory: directory,
    cwd: directory,
    xdmOptions: options => {
      return options
    }
  })

  return {code}
}

const main = async () => {
  const posts = await readdir(SRC_DIRECTORY)

  await asyncForEach(posts, async post => {
    const [year, month, ...slugParts] = post.split('-')
    const slug = slugParts.join('-')

    const {code} = await prepareMDX({
      file: path.join(SRC_DIRECTORY, post, 'index.mdx'),
      path: `/${year}/${month}/${slug}`,
      directory: path.join(SRC_DIRECTORY, post)
    })

    await mkdir(path.join(DEST_DIRECTORY, year, month, slug))
    await writeFile(
      path.join(DEST_DIRECTORY, year, month, slug, 'index.tsx'),
      code.replace(
        ';return Component;',
        `;
      export default Component;`
      )
    )
  })
}

main()
