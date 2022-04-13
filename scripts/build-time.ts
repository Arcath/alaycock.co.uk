import siteData from '../site-data.json'
import fs from 'fs'
import path from 'path'

siteData.buildTime = new Date().toString()

fs.writeFile(
  path.join(process.cwd(), 'site-data.json'),
  JSON.stringify(siteData),
  err => {
    console.log('Site Data updated')
  }
)
