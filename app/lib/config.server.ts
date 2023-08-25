import {indexedBy} from '@arcath/utils'
import bcrypt from 'bcrypt'

import {getPrisma} from './prisma.server'

export const ConfigDefaults = {
  adminpassword: {
    value: bcrypt.hashSync('changeme', 10),
    description: 'The admin password.'
  }
}

export const getConfigValue = async (key: keyof typeof ConfigDefaults) => {
  const prisma = getPrisma()

  const dbr = await prisma.config.findFirst({
    select: {value: true},
    where: {key}
  })

  if (dbr) {
    return dbr.value
  }

  return ConfigDefaults[key].value
}

export const getConfigValues = async (
  keys: (keyof typeof ConfigDefaults)[]
) => {
  const prisma = getPrisma()

  const dbr = await prisma.config.findMany({
    select: {key: true, value: true},
    where: {key: {in: keys}}
  })

  const keyIndex = indexedBy('key', dbr)

  return keys.map(key => {
    if (keyIndex[key]) {
      return keyIndex[key].value
    }

    return ConfigDefaults[key].value
  })
}

export const setConfigValue = async (
  key: keyof typeof ConfigDefaults,
  value: string
) => {
  const prisma = getPrisma()

  await prisma.config.upsert({
    where: {key: key},
    create: {key, value},
    update: {value}
  })
}
