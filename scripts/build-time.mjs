import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'site-data.json')

fs.readFile(DATA_PATH, (err, data) => {
  const siteData = JSON.parse(data.toString())

  siteData.buildTime = new Date().toString()

  fs.writeFile(
    path.join(process.cwd(), 'site-data.json'),
    JSON.stringify(siteData),
    () => {
      console.log('Site Data updated')
    }
  )
})
