import fs from 'fs'
import path from 'path'

import siteData from '../site-data.json'

siteData.buildTime = new Date().toString()

fs.writeFile(
  path.join(process.cwd(), 'site-data.json'),
  JSON.stringify(siteData),
  () => {
    console.log('Site Data updated')
  }
)
