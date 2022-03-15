import data from '../../site-data.json'

export const getSiteData = () => data

export const pageTitle = (...title: string[]) => {
  return [data.title, ...title].join(' / ')
}
