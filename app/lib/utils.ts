import {format} from 'date-fns'

import {CONSTANTS} from './constants'

export const pageTitle = (...parts: string[]) => {
  return [...parts, CONSTANTS.title].join(CONSTANTS.titleSeperator)
}

export const htmlDate = (date: Date) => {
  return format(date, 'yyyy-MM-dd')
}
