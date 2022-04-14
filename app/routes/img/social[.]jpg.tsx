import path from 'path'
import type {LoaderFunction} from '@remix-run/node'
import {createCanvas, registerFont, loadImage} from 'canvas'

import {getSiteData} from '~/lib/utils'

const WIDTH = 1280
const HEIGHT = 640

export const loader: LoaderFunction = async () => {
  const siteData = getSiteData()

  registerFont(
    path.join(
      process.cwd(),
      'public',
      'fonts',
      'montserrat',
      'montserrat-latin-300-normal.ttf'
    ),
    {family: 'Montserrat'}
  )

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
  const words = siteData.title.split(' ')
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

  lines.forEach(currentLine => {
    context.fillText(currentLine, 30, cursor)
    cursor += 80
  })

  cursor += 10
  context.font = '20pt Montserrat'
  context.fillText(siteData.subTitle, 30, cursor)

  context.font = '25pt Montserrat'
  context.textBaseline = 'bottom'
  context.textAlign = 'right'
  context.fillStyle = '#000'
  context.fillText(
    siteData.title,
    context.measureText(siteData.title).width + 10,
    HEIGHT - 10
  )

  const profile = await loadImage(
    path.join(process.cwd(), 'public', 'img', 'profile.jpg')
  )

  context.beginPath()
  context.moveTo(WIDTH - 5, HEIGHT - 130)
  context.arc(WIDTH - 130, HEIGHT - 130, 125, 0, 6.28)
  context.clip()

  context.drawImage(profile, WIDTH - 255, HEIGHT - 255, 250, 250)

  const buffer = canvas.toBuffer()

  return new Response(buffer, {
    headers: {
      'Cache-Control': 's-maxage=43200',
      'content-type': 'image/jpg'
    }
  })
}
