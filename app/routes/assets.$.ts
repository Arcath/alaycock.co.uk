import {type LoaderArgs} from '@remix-run/node'
import {mkdirp} from 'mkdirp'
import fs from 'fs'
import path from 'path'

const {readFile} = fs.promises

export const loader = async ({params}: LoaderArgs) => {
  await mkdirp(process.env.ASSETS_DIR!)

  const file = await readFile(path.join(process.env.ASSETS_DIR!, params['*']!))

  return new Response(file, {status: 200})
}
