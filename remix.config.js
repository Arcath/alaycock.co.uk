/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
module.exports = {
  ignoredRouteFiles: ['.*'],
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
