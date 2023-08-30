import fs from 'fs'
import path from 'path'

const {readdir} = fs.promises

export const filesInDir = async (dir: string) => {
  return readdir(dir)
}
