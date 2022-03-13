import fs from 'fs'
import path from 'path'
import copydir from 'copy-dir'
import mkdirp from 'mkdirp'
import {asyncForEach} from '@arcath/utils/lib/functions/async-for-each'

const {readdir, readFile, writeFile} = fs.promises

const main = async () => {
  const fonts = await readdir(
    path.join(process.cwd(), 'node_modules', '@fontsource')
  )

  await mkdirp(path.join(process.cwd(), 'public', 'fonts'))

  asyncForEach(fonts, async font => {
    copydir.sync(
      path.join(process.cwd(), 'node_modules', '@fontsource', font, 'files'),
      path.join(process.cwd(), 'public', 'fonts', font)
    )

    const css = (
      await readFile(
        path.join(
          process.cwd(),
          'node_modules',
          '@fontsource',
          font,
          'index.css'
        )
      )
    ).toString()

    const newCss = css.replace(/\.\/files/g, `/fonts/${font}`)

    await writeFile(
      path.join(process.cwd(), 'app', 'styles', `font-${font}.css`),
      newCss
    )
  })
}

main()