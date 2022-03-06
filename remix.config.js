/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  appDirectory: 'app',
  browserBuildDirectory: 'public/build',
  publicPath: '/build/',
  serverBuildDirectory: 'netlify/functions',
  devServerPort: 8002,
  serverDependenciesToBundle: [
    'remark-gfm',
    /micromark-.*/,
    /mdast-.*/,
    'ccount',
    /unist-.*/,
    'decode-named-character-reference',
    'character-entities',
    'markdown-table'
  ]
  //server: process.env.NODE_ENV === 'production' ? './server.js' : undefined
}
