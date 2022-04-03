import type {LoaderFunction} from 'remix'
import type {Params} from '@remix-run/react/node_modules/react-router'
import fetch from 'node-fetch'
import {createCanvas, registerFont} from 'canvas'
import path from 'path'

import {getArticleAsset, getArticle} from '~/lib/api/articles.server'

export const loader: LoaderFunction = async ({params}) => {
  if (
    typeof params.year !== 'string' ||
    typeof params.month !== 'string' ||
    typeof params.slug !== 'string' ||
    typeof params.file !== 'string'
  ) {
    throw new Response('Not Found', {status: 404})
  }

  if (params.file === 'social.jpg') {
    return socialImage(params)
  }

  const file = await getArticleAsset(params.slug, params.file)

  const imageReponse = await fetch(file.url)

  return new Response(await imageReponse.buffer(), {
    headers: {
      'Cache-Control': 's-maxage=43200',
      'content-type': imageReponse.headers.get('content-type')!
    }
  })
}

const WIDTH = 1280
const HEIGHT = 640

const socialImage = async (params: Params<string>) => {
  registerFont(
    path.join(
      process.cwd(),
      'public',
      'fonts',
      'montserrat',
      'montserrat-latin-300-normal.woff2'
    ),
    {family: 'Montserrat'}
  )

  const article = await getArticle(params.slug!, {
    year: params.year,
    month: params.month
  })

  const canvas = createCanvas(WIDTH, HEIGHT)
  const context = canvas.getContext('2d')

  context.fillStyle = '#fff'
  context.fillRect(0, 0, WIDTH, HEIGHT)

  context.rotate(25)

  const grd = context.createLinearGradient(0, 0, WIDTH, HEIGHT * 0.75)
  grd.addColorStop(0, 'rgb(104, 109, 224)')
  grd.addColorStop(1, 'rgb(72, 52, 212)')

  context.fillStyle = grd

  context.fillRect(-100, 0, WIDTH + 200, HEIGHT * 0.75)

  context.rotate(-25)

  context.font = '50pt Montserrat'
  context.textAlign = 'left'
  context.fillStyle = '#fff'
  context.textBaseline = 'top'

  const lines: string[] = []
  const words = article!.title.split(' ')
  let line: string[] = []
  while (words.length !== 0) {
    const nextLine = [...line, words[0]].join(' ')

    if (context.measureText(nextLine).width > WIDTH - 60) {
      lines.push(line.join(' '))
      line = []
    } else {
      line = [...line, words.shift()!]

      if (words.length === 0) {
        lines.push(line.join(' '))
      }
    }
  }

  let cursor = 10

  lines.forEach(line => {
    context.fillText(line, 30, cursor)
    cursor += 80
  })

  cursor += 10

  const buffer = canvas.toBuffer()

  return new Response(buffer, {
    headers: {
      'Cache-Control': 's-maxage=43200',
      'content-type': 'image/jpg'
    }
  })
}
