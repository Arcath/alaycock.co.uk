import {execSync} from 'child_process'
import https from 'https'

const [currentCommitSha] = process.argv.slice(2)

const fetchJson = url => {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        let data = ''
        res.on('data', d => {
          data += d
        })

        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (error) {
            reject(error)
          }
        })
      })
      .on('error', e => {
        reject(e)
      })
  })
}

const changeTypes = {
  M: 'modified',
  A: 'added',
  D: 'deleted',
  R: 'moved'
}

const getChangedFiles = async (currentCommitSha, compareCommitSha) => {
  try {
    const lineParser = /^(?<change>\w).*?\s+(?<filename>.+$)/
    const gitOutput = execSync(
      `git diff --name-status ${currentCommitSha} ${compareCommitSha}`
    ).toString()
    const changedFiles = gitOutput
      .split('\n')
      .map(line => line.match(lineParser)?.groups)
      .filter(Boolean)
    const changes = []
    for (const {change, filename} of changedFiles) {
      const changeType = changeTypes[change]
      if (changeType) {
        changes.push({changeType: changeTypes[change], filename})
      } else {
        console.error(`Unknown change type: ${change} ${filename}`)
      }
    }
    return changes
  } catch (error) {
    console.error(`Something went wrong trying to get changed files.`, error)
    return null
  }
}

const main = async () => {
  const buildInfo = await fetchJson(
    'https://www.alaycock.co.uk/build/info.json'
  )
  const compareCommitSha = buildInfo.commit.sha
  const changedFiles = await getChangedFiles(currentCommitSha, compareCommitSha)
  console.error('Determining whether the changed files are deployable', {
    currentCommitSha,
    compareCommitSha,
    changedFiles
  })
  // deploy if:
  // - there was an error getting the changed files (null)
  // - there are no changed files
  // - there are changed files, and they are in the app folder
  const isDeployable =
    changedFiles === null ||
    changedFiles.length === 0 ||
    changedFiles.some(({filename}) => filename.startsWith('app')) ||
    changedFiles.some(({filename}) => filename.startsWith('styles')) ||
    changedFiles.some(({filename}) => filename.startsWith('public')) ||
    changedFiles.some(({filename}) => filename.startsWith('package'))

  console.error(
    isDeployable
      ? '🟢 There are deployable changes'
      : '🔴 No deployable changes',
    {isDeployable}
  )
  console.log(isDeployable)
}

main().catch(e => {
  console.error(e)
  console.log('true')
})
