import {Octokit} from 'octokit'

let octokit: Octokit

export const getOctokit = async () => {
  if (octokit) return octokit

  octokit = new Octokit({auth: process.env.GH_TOKEN, userAgent: `remix/1.0.5`})

  return octokit
}

export const getPost = async (year: string, month: string, slug: string) => {
  const octokit = await getOctokit()

  const {data} = (await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    {
      owner: 'arcath',
      repo: 'alaycock.co.uk',
      path: `/content/posts/${year}-${month}-${slug}/index.mdx`
    }
  )) as {data: {html_url: string; content: string; encoding: 'base64'}}

  return {
    onGithub: data.html_url,
    content: Buffer.from(data.content, data.encoding).toString()
  }
}
