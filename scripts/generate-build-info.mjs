import path from 'path'
import fs from 'fs'
import fetch from 'node-fetch'

const commit = process.env.COMMIT_SHA

const getCommit = async () => {
  if (!commit) return `No COMMIT_SHA environment variable set.`
  try {
    const res = await fetch(
      `https://api.github.com/repos/Arcath/alaycock.co.uk/commits/${commit}`
    )
    const data = await res.json()
    return {
      isDeployCommit: commit === 'HEAD' ? 'Unknown' : true,
      sha: data.sha,
      author: data.commit.author.name,
      date: data.commit.author.date,
      message: data.commit.message,
      link: data.html_url
    }
  } catch (error) {
    return `Unable to get git commit info: ${error.message}`
  }
}

const main = async () => {
  const buildInfo = {
    buildTime: Date.now(),
    commit: await getCommit()
  }

  fs.writeFileSync(
    path.join(process.cwd(), './public/build/info.json'),
    JSON.stringify(buildInfo, null, 2)
  )
  console.log('build info generated', buildInfo)
}

main()
