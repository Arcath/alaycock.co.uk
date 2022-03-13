/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ['.*'],
  //appDirectory: 'app',
  //browserBuildDirectory: 'public/build',
  //publicPath: '/build/',
  //serverBuildDirectory: 'netlify/functions',
  //devServerPort: 8002,
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
}
